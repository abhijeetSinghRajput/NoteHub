import express from 'express';
import { 
    signup, 
    sendSignupOtp, 
    login, 
    googleLogin, 
    logout 
} from '../controller/auth.controller.js';
import { signupLimiter, loginLimiter } from "../middleware/rateLimiter.middleware.js";


const router = express.Router();

router.post('/signup', signup); // TODO: signupLimiter
router.post('/send-signup-otp', sendSignupOtp);
router.post('/login', login);   // TODO: loginLimiter
router.post('/google-login', googleLogin);
router.post('/logout', logout);

export default router;
