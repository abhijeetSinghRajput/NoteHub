import cloudinary from "../config/cloudinary.config.js";
import Image from "../model/Image.model.js";
import {uploadStream } from "../services/cloudinary.service.js";


// Upload gallery image to Cloudinary

export const uploadGalleryImage = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    // Upload to Cloudinary from buffer
    const { secure_url, public_id } = await uploadStream(file.buffer, "gallery");

    const newImage = await Image.create({
      userId,
      url: secure_url,
      publicId: public_id,
    });

    res.status(201).json({
      image: newImage,
      message: "Image uploaded to gallery successfully.",
    });
  } catch (error) {
    console.error("Gallery upload error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


// Get all gallery images
export const getGalleryImages = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access." });
    }
    const images = await Image.find({ userId}).sort({ createdAt: -1 });
    res.status(200).json({ images });
  } catch (error) {
    console.error("Fetch gallery error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete gallery image
export const deleteGalleryImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user._id;

    const image = await Image.findOne({ _id: imageId, userId});
    if (!image) {
      return res.status(404).json({ message: "Image not found or not authorized." });
    }

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await Image.deleteOne({ _id: imageId });
    res.status(200).json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error("Delete gallery error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
