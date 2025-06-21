import express from "express";
import {
  uploadGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
} from "../controller/image.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import {handlefileUpload} from "../middleware/multer.middleware.js";

const router = express.Router();

// Protected routes
router.get("/", protectRoute, getGalleryImages);
router.post( "/upload", protectRoute, handlefileUpload('file'), uploadGalleryImage);
router.delete("/:imageId", protectRoute, deleteGalleryImage);

export default router;
