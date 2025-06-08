import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { cloudinary, removeCloudinaryImage } from "../utils/cloudinary.js";
import { sendOtp, validateOtp } from "../services/otp.service.js";

const sanitizeUserForSharing = (user) => {
  return {
    _id: user._id,
    avatarUrl: user.avatarUrl,
    coverUrl: user.coverUrl,
    email: user.email,
    fullName: user.fullName,
    imageUrls: user.imageUrls,
    isEmailVerified: user.isEmailVerified,
    streak: user.streak,
    userName: user.userName,
  };
};

export const sendSignupOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const result = await sendOtp({
      email,
      purpose: "signup",
    });
    res.status(result.status).json({ message: result.message});
  } catch (err) {
    res.status(err.status || 500).json({ message: "Internal server error" });
    console.log("error in sendSignupOtp\n", err);
  }
};

export const signup = async (req, res) => {
  const { fullName, email, password: inputPassword, otp } = req.body;
  if (!fullName || !email || !inputPassword || !otp) {
    return res.status(400).json({ message: "All fields required." });
  }

  // validating the credentials
  if (inputPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must contain at least 6 characters." });
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otpValidation = await validateOtp({ email, purpose: "signup", otp });
    if (otpValidation.status !== 200) {
      return res.status(otpValidation.status).json({ message: otpValidation.message });
    }

    // password and verfication code hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(inputPassword, salt);

    // creating the user and setting verification code expiration of 15 min
    const newUser = await User.create({
      fullName,
      email,
      userName: "user" + new Date().getTime(),
      password: hashedPassword,
    });

    generateToken(newUser._id, res);
    const { password, ...safeUser } = newUser._doc;
    res.status(201).json({ user: safeUser, message: "Registered successfully." });
  } catch (error) {
    console.error("error in signup controller: \n", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({ message: "All fields required." });
  }
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "Invalid credential provided." });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ message: "Invalid credential provided." });
    }

    generateToken(user._id, res);

    res.status(200).json(sanitizeUserForSharing(user));
  } catch (error) {
    console.error("error in login controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("error in logout controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "user not found" });
    }
    const user = req.user;

    res.status(200).json(sanitizeUserForSharing(user));
  } catch (error) {
    console.error("Error in checkAuth controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }
    res.status(200).json(sanitizeUserForSharing(user));
  } catch (error) {
    console.error("Error in getUser controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadAvatar = async (req, res) => {
  const { user } = req;
  const { imageBase64: avatarBase64 } = req.body;
  if (!user) {
    return res.status(401).json({ message: "Unothorized: user not found" });
  }
  if (!avatarBase64) {
    return res.status(400).json({ message: "Avatar must required." });
  }
  try {
    const publicId = `user_${user._id}_avatar`;
    const result = await cloudinary.uploader.upload(avatarBase64, {
      public_id: `avatar/${publicId}`,
      overwrite: true,
      resource_type: "image",
    });

    user.avatarUrl = result.secure_url;
    await user.save();

    res.status(200).json({
      user: sanitizeUserForSharing(user),
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error("Error in uploadAvatar controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeAvatar = async (req, res) => {
  const { user } = req;
  try {
    const { success, status, message } = await removeCloudinaryImage(
      user.avatarUrl,
      "avatar/"
    );
    if (success) {
      user.avatarUrl = "";
      user.save();
    }
    res.status(status).json({ user, message });
  } catch (error) {
    console.error("Error in removeAvatar controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadCover = async (req, res) => {
  const { user } = req;
  const { imageBase64: coverBase64 } = req.body;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized: user not found" });
  }
  if (!coverBase64) {
    return res.status(400).json({ message: "Cover must be provided." });
  }
  try {
    const publicId = `user_${user._id}_cover`;
    const result = await cloudinary.uploader.upload(coverBase64, {
      public_id: `cover/${publicId}`,
      overwrite: true,
      resource_type: "image",
    });

    user.coverUrl = result.secure_url; // Update coverUrl field
    await user.save();

    res.status(200).json({
      user: sanitizeUserForSharing(user),
      message: "Cover uploaded successfully",
    });
  } catch (error) {
    console.error("Error in uploadCover controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeCover = async (req, res) => {
  const { user } = req;
  try {
    const { success, status, message } = await removeCloudinaryImage(
      user.coverUrl,
      "cover/"
    );
    if (success) {
      user.coverUrl = ""; // Clear the coverUrl field
      await user.save();
    }
    res.status(status).json({ user, message });
  } catch (error) {
    console.error("Error in removeCover controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFullName = async (req, res) => {
  try {
    const { fullName } = req.body;
    const { user } = req;
    if (!fullName) {
      return res
        .status(400)
        .json({ message: "fullName required for updation." });
    }

    user.fullName = fullName;
    await user.save();
    res.status(200).json({
      user: sanitizeUserForSharing(user),
      message: "fullName updated successfully.",
    });
  } catch (error) {
    console.log("Error in updateFullName controller\n", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateUserName = async (req, res) => {
  try {
    const { userName } = req.body;
    const { user } = req;

    if (!userName) {
      return res
        .status(400)
        .json({ message: "userName required, for updation." });
    }
    if (!/^[a-zA-Z0-9._]{3,30}$/.test(userName)) {
      return res.status(400).json({ message: "Invalid userName format." });
    }
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    user.userName = userName;
    await user.save();
    res.status(200).json({
      user: sanitizeUserForSharing(user),
      message: "userName updated successfully.",
    });
  } catch (error) {
    console.log("Error in updateUserName controller\n", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const { user } = req;
    user.fullName = email;
    await user.save();
  } catch (error) {
    console.log("Error in updateEmail controller\n", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
