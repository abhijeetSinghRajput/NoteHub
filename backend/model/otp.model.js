import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  purpose: {
    type: String,
    enum: ["signup", "password_reset", "email_update"],
    required: true,
  },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  lastSentAt: { type: Date, required: true },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired OTPs

export const Otp = mongoose.model("Otp", otpSchema);
