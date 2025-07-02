import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { clearCookie, setCookie } from "../utils/jwt.js";
import { sendOtp, validateOtp } from "../services/otp.service.js";
import { OAuth2Client } from "google-auth-library";
import validator from "validator";
import {
  createLoginRecord,
  getActiveSessions,
  logoutAllSessions,
  revokeToken,
  updateLogoutRecord,
} from "../services/loginRecord.service.js";
import LoginRecord from "../model/loginRecord.model.js";

// common response functions
const sendAuthResponse = async (req, res, user, authMethod) => {
  const loginRecord = await createLoginRecord(req, res, user._id, authMethod);
  const { password, ...userWithoutPassword } = user.toObject();
  return res.status(200).json({
    user: userWithoutPassword,
    sessionId: loginRecord._id,
  });
};

export const signup = async (req, res) => {
  let { fullName, email, password: inputPassword, otp } = req.body;
  fullName = fullName.trim();
  email = email.trim();
  inputPassword = inputPassword.trim();
  otp = otp.trim();

  if (!fullName || !email || !inputPassword || !otp) {
    return res.status(400).json({ message: "All fields required." });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password strength
  if (!validator.isLength(inputPassword, { min: 6 })) {
    return res.status(400).json({
      message: "Password must contain at least 6 characters.",
    });
  }

  try {
    const normalizedEmail = validator.normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otpValidation = await validateOtp({
      email: normalizedEmail,
      purpose: "signup",
      otp,
    });
    if (otpValidation.status !== 200) {
      return res
        .status(otpValidation.status)
        .json({ message: otpValidation.message });
    }

    // password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(inputPassword, salt);

    // creating the user with temporary username
    const newUser = await User.create({
      fullName: validator.escape(fullName),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return sendAuthResponse(req, res, newUser, "email");
  } catch (error) {
    console.error("error in signup controller: \n", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const sendSignupOtp = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const result = await sendOtp({
      email: validator.normalizeEmail(email),
      purpose: "signup",
    });
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    res.status(err.status || 500).json({ message: "Internal server error" });
    console.log("error in sendSignupOtp\n", err);
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields required." });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { userName: identifier }],
    }).select("+password");

    // Verify credentials
    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return sendAuthResponse(req, res, user, "email");
  } catch (error) {
    console.error("error in login controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Initialize without redirect URI
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export const googleLogin = async (req, res) => {
  const { code, codeVerifier, redirectUri } = req.body;
  // Input validation and trimming
  if (!code?.trim() || !codeVerifier?.trim() || !redirectUri?.trim()) {
    return res.status(400).json({ message: "All fields required." });
  }

  if (redirectUri !== process.env.GOOGLE_REDIRECT_URI) {
    return res.status(400).json({
      message: "Redirect URI mismatch",
    });
  }

  try {
    // Create token endpoint URL with all parameters
    const tokenEndpoint = `https://oauth2.googleapis.com/token`;
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri", redirectUri);
    params.append("grant_type", "authorization_code");
    params.append("code_verifier", codeVerifier);

    // Make direct HTTP request to token endpoint
    const tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Google token exchange error:", tokens);
      return res.status(400).json({ message: "Invalid authorization code." });
    }

    // Verify ID token using the library
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email_verified) {
      return res.status(403).json({
        message:
          "Google email not verified. Please verify your email with Google first.",
      });
    }

    const { email, sub: googleId, name: fullName, picture } = payload;
    const avatar = picture.replace(/=s96-c$/, "=s400-c");
    const normalizedEmail = validator.normalizeEmail(email);

    // Find or create user (aligned with your signup flow)
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user (like in signup)
      user = await User.create({
        fullName: validator.escape(fullName || ""),
        email: normalizedEmail,
        googleId,
        avatar,
        password: null,
        hasGoogleAuth: true,
      });
    } else {
      // Add Google auth to existing account
      if (!user.googleId) {
        user.googleId = googleId;
        user.hasGoogleAuth = true;
      }
      if (!user.avatar) user.avatar = avatar;
      await user.save();
    }

    // Generate token and send response (aligned with login/signup)
    return sendAuthResponse(req, res, user, "google");
  } catch (error) {
    console.error("Error in Google login controller: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getSessions = async (req, res) => {
  try {
    const { userId } = req.query; 

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in query parameters" });
    }

    const sessions = await getActiveSessions(userId);
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Controller: getLoginHistory.js
export const getLoginHistory = async (req, res) => {
  const { userId, limit = 10 } = req.query; 

  if (!userId) {
    return res.status(400).json({ message: "userId query parameter is required" });
  }

  try {
    const records = await LoginRecord.find({ userId })
      .sort({ loginTime: -1 })
      .limit(Number(limit));

    res.status(200).json(records);
  } catch (error) {
    console.error("Error in getting Login History:\n", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const logout = async (req, res) => {
  try {
    const { jwt: token, sessionId } = req.cookies;

    // Revoke token if exists
    if (token) {
      await revokeToken(token);
    }

    // Update session record if session ID exists
    if (sessionId) {
      await updateLogoutRecord(sessionId);
    }

    // Clear cookies
    clearCookie(res, "jwt");
    clearCookie(res, "sessionId");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutAll = async (req, res) => {
  try {
    const { userId } = req.body; // todo req.user

    // Revoke all active sessions
    const result = await logoutAllSessions(userId);

    // Clear current session cookies
    clearCookie(res, "jwt");
    clearCookie(res, "sessionId");

    res.status(200).json({
      message: "All sessions logged out",
      revokedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
