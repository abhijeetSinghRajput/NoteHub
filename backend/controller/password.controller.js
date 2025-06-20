import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../model/user.model.js";
import { sendOtp, validateOtp } from "../services/otp.service.js";

export const requestResetPasswordOtp = async (req, res) => {
  const { identifier } = req.body;
  
  if (!identifier) {
    return res.status(400).json({ 
      success: false,
      message: "Username or email is required" 
    });
  }

  try {
    // Check if identifier is email or username
    const isEmail = validator.isEmail(identifier);
    const query = isEmail 
      ? { email: validator.normalizeEmail(identifier) }
      : { userName: identifier };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    await sendOtp({
      email: user.email,
      purpose: "password_reset",
    });

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${user.email}`,
      email: user.email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + b.replace(/./g, '*') + c) // Partially mask email
    });
  } catch (error) {
    console.error("Password reset OTP error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to send OTP" 
    });
  }
};

export const resetPassword = async (req, res) => {
  const { identifier, newPassword, otp } = req.body;

  if (!identifier || !newPassword || !otp) {
    return res.status(400).json({ 
      success: false,
      message: "All fields are required" 
    });
  }

  if (!validator.isLength(inputPassword, { min: 6 })) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters with uppercase, lowercase, number and symbol"
    });
  }

  try {
    const isEmail = validator.isEmail(identifier);
    const user = await User.findOne(
      isEmail 
        ? { email: validator.normalizeEmail(identifier) } 
        : { userName: identifier }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    await validateOtp({
      email: user.email,
      purpose: "password_reset",
      otp,
    });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: "Password reset successfully" 
    });
  } catch (error) {
    console.error("Password reset error:", error);
    const status = error.name === 'ValidationError' ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Password reset failed"
    });
  }
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { user } = req;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ 
      success: false,
      message: "Both old and new passwords are required" 
    });
  }

  if (oldPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different from old password"
    });
  }

  if (!validator.isLength(inputPassword, { min: 6 })) {
    return res.status(400).json({
      success: false,
      message: "New password must contain at least 6 characters with uppercase, lowercase, number and symbol"
    });
  }

  try {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Current password is incorrect" 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    // Return user data without sensitive information
    const { password, ...safeUser } = user.toObject();
    
    return res.status(200).json({
      success: true,
      user: safeUser,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update password"
    });
  }
};