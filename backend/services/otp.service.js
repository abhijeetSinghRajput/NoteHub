import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "./sendEmail.js";
import { otpTemplate } from "./emailTemplates.js";
import Otp from "../model/otp.model.js";

export const sendOtp = async ({ email, purpose }) => {
  const existingOtp = await Otp.findOne({ email, purpose});
  const now = new Date();

  if (existingOtp && now - existingOtp.lastSentAt < 60 * 1000) {
    return { status: 400, message: "OTP already sent. Please wait a minute" };
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otpCode, 10);
  const expiresInMinutes = 30;
  const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000);

  await Otp.findOneAndUpdate(
    { email, purpose },
    {
      otp: hashedOtp,
      purpose,
      expiresAt,
      lastSentAt: now,
    },
    { upsert: true, new: true }
  );

  const subject = "Your Notehub Verification Code";
  const html = otpTemplate({
    email,
    otpCode,
    expiresInMinutes,
    purpose,
  });
  const text = `Your Notehub verification code is: ${otpCode}\nThis code expires in ${expiresInMinutes}.`;

  await sendEmail(email, subject, text, html);
  return { status: 200, message: "OTP sent successfully" };
};

export const validateOtp = async ({ email, purpose, otp }) => {
  const otpRecord = await Otp.findOne({ email, purpose });
  if (!otpRecord) return { status: 400, message: "Please request OTP first" };

  if (new Date() > otpRecord.expiresAt) return { status: 410, message: "OTP has expired" };

  const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
  if (!isOtpValid) return { status: 401, message: "Invalid OTP" };

  await Otp.deleteOne({ email, purpose });
  return { status: 200, message: "OTP validated successfully" };
};

