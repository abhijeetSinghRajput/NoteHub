import express from "express";
import {
    login,
    signup,
    logout,
    getUser,
    checkAuth,
    uploadAvatar,
    removeAvatar,
    updateFullName,
    updateUserName,
    updateEmail,
    uploadCover,
    removeCover,
    sendSignupOtp,
} from "../controller/user.controller.js"
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import { signupLimiter, loginLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post('/signup', signup);//signupLimiter todo
router.post('/send-signup-otp', sendSignupOtp);
router.post('/login', login);//loginLimiter todo
router.post('/logout', logout);

router.post('/upload-avatar', protectRoute, uploadAvatar);
router.delete('/remove-avatar', protectRoute, removeAvatar);

router.post('/upload-cover', protectRoute, uploadCover);
router.delete('/remove-cover', protectRoute, removeCover);

router.put('/update-fullname', protectRoute, updateFullName);
router.put('/update-username', protectRoute, updateUserName);
router.put('/update-email', protectRoute, updateEmail);

router.get('/me', protectRoute, checkAuth);
router.get('/:identifier', getUser);

export default router;