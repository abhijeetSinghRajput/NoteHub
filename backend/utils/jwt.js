// utils/jwt.js
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { durationToMs } from './time.util.js';

config();

export const setCookie = (res, name, value, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
    domain: process.env.COOKIE_DOMAIN,
    maxAge: durationToMs(process.env.JWT_EXPIRY || '7d'),
  };

  res.cookie(name, value, { ...defaultOptions, ...options });
};

export const clearCookie = (res, name) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    domain: process.env.COOKIE_DOMAIN
  });
};

export const generateToken = (res, sessionId) => {
  const token = jwt.sign(
    { 
      sessionId,
      iss: process.env.JWT_ISSUER || 'your-app-name',
      aud: process.env.JWT_AUDIENCE || 'your-app-client'
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRY || '7d',
      algorithm: 'HS256'
    }
  );

  setCookie(res, "jwt", token);
  return token;
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER || 'your-app-name',
      audience: process.env.JWT_AUDIENCE || 'your-app-client'
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
