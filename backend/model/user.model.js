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
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    googleId: {
        type: String
    },
    coverUrl: {
        type: String,
        default: '',
    },
    password: {
        type: String,
    },
    streak: {
        type: Number,
        default: 0,
    }
})

const User = mongoose.model('user', userSchema);
export default User;