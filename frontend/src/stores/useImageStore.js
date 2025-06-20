import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useImageStore = create((set, get) => ({
  galleryImages: [],
  isLoadingImages: false,

  getImages: async () => {
    set({ isLoadingImages: true });
    try {
      const res = await axiosInstance.get("/images");
      const { images: galleryImages } = res.data;
      set({ galleryImages });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoadingImages: false });
    }
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosInstance.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { image, message } = res.data;
      set({ galleryImages: [image, ...get().galleryImages] });
      localStorage.setItem("imageCount", get().galleryImages.length);
      toast.success(message);
      return true;
    } catch (error) {
      console.error("Image upload error:\n", error);
      toast.error("Failed to upload image");
      return false;
    }
  },

  removeImage: async (imageId) => {
    try {
      const res = await axiosInstance.delete(`/images/${imageId}`);
      const { message } = res.data;
      set((state) => ({
        galleryImages: state.galleryImages.filter((img) => img._id !== imageId),
      }));
      localStorage.setItem("imageCount", get().galleryImages.length);
      toast.success(message);
      return true;
    } catch (error) {
      console.error("Image delete error:\n", error);
      toast.error(error.response.data.message);
      return false;
    }
  },
}));
