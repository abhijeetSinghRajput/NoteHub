import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import { sendOtp, validateOtp } from "../services/otp.service.js";

export const requestResetPasswordOtp = async (req, res) => {
  const { identifier } = req.body; // Changed from email to identifier
  if (!identifier) {
    return res.status(400).json({ message: "Username or email is required" });
  }

  try {
    // Look for user by either email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with this username or email not found` });
    }

    await sendOtp({
      email: user.email, // Always send to email, even if they identified by username
      purpose: "password_reset",
    });

    return res.status(200).json({
      message: `OTP successfully sent to ${user.email}`,
      email: user.email, // Return the email so frontend can display it
    });
  } catch (error) {
    console.error("Error sending reset password OTP:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { identifier, newPassword, otp } = req.body; // Changed from email to identifier
  console.log({
    identifier,
    newPassword,
    otp,
  });

  if (!identifier || !newPassword || !otp) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find user by either email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate OTP against the user's email (OTP is always sent to email)
    await validateOtp({
      email: user.email,
      purpose: "password_reset",
      otp,
    });

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { user } = req;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields must required." });
  }

  try {
    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isMatched)
      return res.status(400).json({ message: "Invalid password." });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();
    res.status(200).json({
      user: {
        fullName: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        userName: user.userName,
        avatarUrl: user.avatarUrl,
        streak: user.streak,
      },
      message: "Password changed.",
    });
  } catch (error) {
    console.log("Error in updatePassword controller\n", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
