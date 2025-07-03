// services/loginRecord.service.js
import LoginRecord from "../model/loginRecord.model.js";
import { parseDeviceInfo } from "../utils/deviceParser.js";
import { generateToken } from "../utils/jwt.js";
import { durationToMs } from "../utils/time.util.js";
import { getLocationFromIP } from "./location.service.js";
import jwt from "jsonwebtoken";

export const createLoginRecord = async (
  req,
  res,
  userId,
  authMethod = "email"
) => {
  const ipAddress =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"] || "";
  const expiryMs = durationToMs(process.env.JWT_EXPIRY || "7d");
  const tokenExpiry = new Date(Date.now() + expiryMs); // convert ms to Date

  const record = await LoginRecord.create({
    userId,
    ipAddress,
    userAgent,
    authMethod,
    device: parseDeviceInfo(userAgent),
    location: await getLocationFromIP(ipAddress),
    tokenExpiry,
  });

  // Generate token after creating the record (so we have record._id)
  generateToken(res, record._id);
  return record;
};

export const revokeToken = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });
  } catch (err) {
    console.error("Token verification failed:", err);
    const error = new Error("Invalid or expired token");
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  console.log(decoded);
  const { sessionId } = decoded;
  if (!sessionId) {
    const error = new Error("Token missing sessionId");
    error.statusCode = 400;
    throw error;
  }

  const updatedRecord = await LoginRecord.findByIdAndUpdate(
    decoded.sessionId,
    {
      logoutTime: new Date(),
      isRevoked: true,
    },
    { new: true }
  );

  if (!updatedRecord) {
    const error = new Error("Session record not found");
    error.statusCode = 404;
    throw error;
  }
  return updatedRecord;
};

export const getActiveSessions = async (userId) => {
  return await LoginRecord.find({
    userId,
    isRevoked: false,
    tokenExpiry: { $gt: new Date() },
    logoutTime: null,
  }).sort({ loginTime: -1 });
};

export const logoutAllSessions = async (userId) => {
  return await LoginRecord.updateMany(
    {
      userId,
      isRevoked: false,
      tokenExpiry: { $gt: new Date() },
    },
    {
      logoutTime: new Date(),
      isRevoked: true,
    }
  );
};
