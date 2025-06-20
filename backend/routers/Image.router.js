import express from "express";
import {
  uploadGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
} from "../controller/image.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

// Protected routes
router.post(
  "/upload",
  protectRoute,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadGalleryImage
);

router.get("/", protectRoute, getGalleryImages);
router.delete("/:imageId", protectRoute, deleteGalleryImage);

export default router;
