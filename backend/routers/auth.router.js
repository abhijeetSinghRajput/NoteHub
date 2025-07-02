import express from 'express';
import { 
    signup, 
    sendSignupOtp, 
    login, 
    googleLogin, 
    logout, 
    getLoginHistory,
    getSessions,
    logoutAll
} from '../controller/auth.controller.js';
import { signupLimiter, loginLimiter } from "../middleware/rateLimiter.middleware.js";


const router = express.Router();

router.post('/signup', signup); // TODO: signupLimiter
router.post('/send-signup-otp', sendSignupOtp);
router.post('/login', login);   // TODO: loginLimiter
router.post('/google-login', googleLogin);
router.post('/logout', logout);

router.get('/sessions', getSessions);
router.get('/login-history', getLoginHistory);
router.post('/logout-all', logoutAll);

export default router;
