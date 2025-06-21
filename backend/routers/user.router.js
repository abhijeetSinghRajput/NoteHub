import express from "express";
import {
    uploadAvatar,
    uploadCover,
    removeAvatar,
    removeCover,
    updateFullName,
    updateUserName,
    updateEmail,
    checkAuth,
    getUser,
    isEmailAvailable,
} from "../controller/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import { handlefileUpload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post( "/upload-avatar", protectRoute, handlefileUpload("file"), uploadAvatar);
router.post( "/upload-cover", protectRoute, handlefileUpload("file"), uploadCover);
router.delete("/remove-avatar", protectRoute, removeAvatar);
router.delete("/remove-cover", protectRoute, removeCover);

router.put("/update-fullname", protectRoute, updateFullName);
router.put("/update-username", protectRoute, updateUserName);
router.put("/update-email", protectRoute, updateEmail);

router.get("/me", protectRoute, checkAuth);
router.get("/:identifier", getUser);
router.get("/check-email/:email", isEmailAvailable);

export default router;
