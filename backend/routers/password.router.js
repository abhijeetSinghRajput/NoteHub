import express from "express";
import {
    requestResetPasswordOtp,
    resetPassword,
    updatePassword,
} from "../controller/password.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = express.Router();


router.post('/request-reset-password-otp', requestResetPasswordOtp);
router.post('/reset-password', resetPassword);
router.put('/update', protectRoute, updatePassword);

export default router;