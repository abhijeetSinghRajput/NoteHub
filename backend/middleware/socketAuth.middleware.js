import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import LoginRecord from "../model/loginRecord.model.js";
import mongoose from "mongoose";

// Socket.IO middleware
const socketAuthMiddleware = async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    const authHeader = socket.handshake.headers.authorization;

    // 1. Extract token
    let token;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (cookieHeader) {
      const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => c.split("=")));
      token = cookies.jwt;
    }

    if (!token) return next(new Error("Authentication required"));

    // 2. Decode JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      });
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return next(new Error("Invalid or expired token"));
    }

    const { sessionId } = decoded;
    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return next(new Error("Invalid session ID"));
    }

    // 3. Validate session
    const session = await LoginRecord.findOne({
      _id: new mongoose.Types.ObjectId(sessionId),
      isRevoked: false,
      tokenExpiry: { $gt: new Date() },
    });

    if (!session) {
      return next(new Error("Session expired or invalid"));
    }

    // 4. Fetch user separately
    const user = await User.findById(session.userId).select("-password");
    if (!user) {
      await LoginRecord.findByIdAndUpdate(session._id, {
        isRevoked: true,
        logoutTime: new Date(),
      });
      return next(new Error("User not found"));
    }

    // 5. IP check (optional)
    const socketIP = socket.handshake.address;
    if (session.ipAddress && session.ipAddress !== socketIP) {
      console.log(session.ipAddress, socketIP);
      console.warn(`IP mismatch for user ${user._id}`);
    }

    // 6. Attach user + session to socket
    socket.user = user;
    socket.session = session;

    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    return next(new Error("Unauthorized"));
  }
};

export default socketAuthMiddleware;
