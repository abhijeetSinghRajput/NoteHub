// services/loginRecord.service.js
import LoginRecord from "../model/loginRecord.model.js";
import { parseDeviceInfo } from "../utils/deviceParser.js";
import { generateToken } from "../utils/jwt.js";
import { durationToMs } from "../utils/time.util.js";
import { getLocationFromIP } from "./location.service.js";

export const createLoginRecord = async (
  req,
  res,
  userId,
  authMethod = "email"
) => {
  
  const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
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

export const updateLogoutRecord = async (sessionId) => {
  return await LoginRecord.findByIdAndUpdate(
    sessionId,
    {
      logoutTime: new Date(),
      isRevoked: true,
    },
    { new: true }
  );
};

export const revokeToken = async (token) => {
  return await LoginRecord.findOneAndUpdate(
    { jwtToken: token },
    { isRevoked: true },
    { new: true }
  );
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
