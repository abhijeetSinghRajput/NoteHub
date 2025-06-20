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
    isEmailAvailable,
    googleLogin,
} from "../controller/user.controller.js"
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { signupLimiter, loginLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post('/signup', signup);//signupLimiter todo
router.post('/send-signup-otp', sendSignupOtp);
router.post('/login', login);//loginLimiter todo
router.post('/google-login', googleLogin);
router.post('/logout', logout);

router.post(
    '/upload-avatar', 
    protectRoute, 
    (req, res, next) =>{
        upload.single('file')(req, res, (err)=>{
            if(err){
                return res.status(400).json({message: err.message});
            }
            next();
        });
    },
    uploadAvatar
);
router.post(
    '/upload-cover', 
    protectRoute, 
    (req, res, next) =>{
        upload.single('file')(req, res, (err)=>{
            if(err){
                return res.status(400).json({message: err.message});
            }
            next();
        });
    },
    uploadCover
);
router.delete('/remove-avatar', protectRoute, removeAvatar);
router.delete('/remove-cover', protectRoute, removeCover);
router.get('/check-email/:email', isEmailAvailable);

router.put('/update-fullname', protectRoute, updateFullName);
router.put('/update-username', protectRoute, updateUserName);
router.put('/update-email', protectRoute, updateEmail);

router.get('/me', protectRoute, checkAuth);
router.get('/:identifier', getUser);

export default router;