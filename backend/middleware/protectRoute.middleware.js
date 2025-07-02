import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import LoginRecord from "../model/loginRecord.model.js";
import { Types } from "mongoose";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        code: "AUTH_REQUIRED",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      });
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
        code: err.name || "INVALID_TOKEN",
      });
    }

    const { sessionId } = decoded;
    if (!sessionId || !Types.ObjectId.isValid(sessionId)) {
      return res.status(401).json({
        message: "Invalid session ID in token",
        code: "INVALID_SESSION_ID",
      });
    }

    // Fetch session (not populating user directly)
    const session = await LoginRecord.findOne({
      _id: new Types.ObjectId(sessionId),
      isRevoked: false,
      tokenExpiry: { $gt: new Date() },
    });

    if (!session) {
      res.clearCookie("jwt");
      res.clearCookie("sessionId");
      return res.status(401).json({
        message: "Session expired or invalid",
        code: "SESSION_INVALID",
      });
    }

    // Fetch user separately
    const user = await User.findById(session.userId).select("-password");
    if (!user) {
      await LoginRecord.findByIdAndUpdate(session._id, {
        isRevoked: true,
        logoutTime: new Date(),
      });
      return res.status(404).json({
        message: "User account not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Optional IP check
    const requestIP = req.ip || req.headers["x-forwarded-for"];
    if (session.ipAddress && session.ipAddress !== requestIP) {
      console.warn(`IP mismatch for user ${user._id}`);
    }

    // ✅ Store user and session separately
    req.user = user;         // clean user data
    req.session = session;   // raw session data

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.clearCookie("jwt");
    res.clearCookie("sessionId");

    const isExpired = error.name === "TokenExpiredError";
    res.status(isExpired ? 401 : 500).json({
      message: isExpired
        ? "Session expired. Please log in again."
        : "Authentication failed",
      code: error.name || "AUTH_ERROR",
    });
  }
};
