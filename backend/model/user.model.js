import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrls: {
        type: Array,
        default: [],
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    coverUrl: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: true,
    },
    verificationCode: {
        type: String,
    },
    verificationCodeExpiration: {
        type: Date,
    },
    verificationPurpose: {
        type: String, // password_reset || email_verification
    },
    currentStreak: {
        type: Number,
        default: 0,
    },
    maxStreak: {
        type: Number,
        default: 0,
    },
    lastContributionDate: {
        type: Date,
        default: null,
    },
})

const User = mongoose.model('user', userSchema);
export default User;