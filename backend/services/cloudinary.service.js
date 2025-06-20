import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.config.js";

export const uploadStream = (buffer, folder = "default_folder") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) return reject(error);

        // ✅ Return both URL and publicId
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const extractPublicIdFromUrl = (url) => {
  const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches ? matches[1] : null;
};

export const deleteImage = async (imageUrl) => {
  try {
    if (imageUrl.includes("lh3.googleusercontent.com")) {
      // Skip deletion for Google-hosted profile pictures
      return;
    }
    
    const publicId = extractPublicIdFromUrl(imageUrl);
    if(!publicId) {
      throw new Error("Invalid image URL");
    }
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
};



