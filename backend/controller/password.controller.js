import User from "../model/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import bcrypt from "bcryptjs"
import { validateVerificationCode } from "../utils/validateVerificationCode.js";
import { generateResetPasswordToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export const forgetPassword = async (req, res) => {
    const { userName } = req.body;
    if (!userName) {
        return res.status(400).json({ message: "Username must required." })
    }

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "user not found." })
        }
        // password and verfication code hashing
        const salt = await bcrypt.genSalt(10);
        const passwordVerificationCode = generateVerificationCode();
        const passwordVerificationHash = await bcrypt.hash(passwordVerificationCode, salt);


        // Re-Configuring code and set expiration of 15 min  
        user.verificationCode = passwordVerificationHash;
        user.verificationCodeExpiration = Date.now() + 15 * 60 * 1000;
        user.verificationPurpose = 'password_verification';
        await user.save();

        // sending mail to the 
        const mailSubject = "Password verification code";
        const title = "Password Verification";
        const mailMessage = "We received a request to reset your password for your NoteHub account.";
        const mailBody = verifyEmailTemplate(title, mailMessage, passwordVerificationCode);
        await sendMail(user.email, mailSubject, mailBody);

        res.status(200).json({message: `OTP sent to ${user.email}`});
    } catch (error) {
        console.log("Error in forgetPassword controller\n", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

export const verifyPassword = async (req, res) => {
    const { userName, otp } = req.body;
    if (!userName) {
        return res.status(400).json({ message: "Username must required." })
    }
    if (!otp) {
        return res.status(400).json({ message: "OTP must required." })
    }

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "user not found." })
        }

        const { success, message } = await validateVerificationCode(user, otp);
        if (!success) {
            return res.status(400).json({ message });
        }

        // send a jwt token
        generateResetPasswordToken(user._id, res);

        res.status(200).json({
            user: {
                fullName: user.fullName,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                userName: user.userName,
                avatarUrl: user.avatarUrl,
                streak: user.streak,
            },
            message,
        });
    } catch (error) {
        console.log("Error in verifyPassword controller\n", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

export const changePassword = async (req, res) => {
    const { reset_password_token } = req.cookies;
    const { password } = req.body;

    if (!reset_password_token) {
        return res.status(401).json({ message: "No token provided." })
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must contain at least 6 characters." });
    }

    try {
        const decode = jwt.verify(reset_password_token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" })
        }

        const { userId } = decode;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        user.password = hashPassword;
        user.verificationCode = undefined;
        user.verificationCodeExpiration = undefined;
        user.verificationPurpose = undefined;
        await user.save();

        res.clearCookie('reset_password_token');

        res.status(200).json({
            user: {
                fullName: user.fullName,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                userName: user.userName,
                avatarUrl: user.avatarUrl,
                streak: user.streak,
            },
            message: "Password changed."
        });
    } catch (error) {
        console.log("Error in changePassword controller\n", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}


export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { user } = req;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields must required." });
    }

    try {
        const isMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isMatched) return res.status(400).json({ message: "Invalid password." });

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
            message: "Password changed."
        });
    } catch (error) {
        console.log("Error in updatePassword controller\n", error);
        res.status(500).json({ message: "Internal Server Error." });
    }

}