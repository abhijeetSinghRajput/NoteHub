import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isVerifyingEmail: false,
  emailStatus: "",
  isUploadingAvatar: false,
  isUploadingCover: false,
  isRemovingAvatar: false,
  isRemovingCover: false,
  isSendingOtp: false,
  isResettingPassword: false,

  requestResetPasswordOtp: async (identifier) => {
    set({ isSendingOtp: true });
    try {
      const response = await axiosInstance.post(
        "/password/request-reset-password-otp",
        {
          identifier,
        }
      );
      toast.success(response.data.message || "OTP sent successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      console.error("Request reset password OTP error:", error);
      return null;
    } finally {
      set({ isSendingOtp: false });
    }
  },
  resetPassword: async ({ identifier, newPassword, otp }) => {
    set({ isResettingPassword: true });
    try {
      const response = await axiosInstance.post("/password/reset-password", {
        identifier,
        newPassword,
        otp,
      });
      toast.success(response.data.message || "Password reset successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      console.error("Reset password error:", error);
      return null;
    } finally {
      set({ isResettingPassword: false });
    }
  },
  getUser: async (identifier) => {
    try {
      const response = await axiosInstance.get(`/user/${identifier}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/user/me");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/user/signup", data);
      const { message, user } = res.data;
      set({ authUser: user });
      toast.success(message);
      return { success: true };
    } catch (error) {
      toast.error(error.response.data.message);
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },

  sendSignupOtp: async (email) => {
    set({ isSendingOtp: true });
    try {
      const response = await axiosInstance.post("/user/send-signup-otp", {
        email,
      });
      toast.success(response.data.message || "OTP sent successfully!");
      return response.data;
    } catch (error) {
      if (error.status === 429) {
        toast.error("Too many requests. Please try again later.");
        return null;
      }
      toast.error("Failed to send OTP. Please try again.");
      console.error("Send OTP error:", error);
      return null;
    } finally {
      set({ isSendingOtp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/user/login", data);
      set({ authUser: res.data });
      toast.success("sign up successful");
    } catch (error) {
      set({ authUser: null });
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  googleLogin: async (data) => {},

  logout: async () => {
    try {
      const res = await axiosInstance.post("/user/logout");
      set({ authUser: null });
      toast.success(res.data.message);
    } catch (error) {
      set({ authUser: null });
      toast.error(error.response.data.message);
    }
  },

  verifyEmail: async (data) => {
    set({ isVerifyingEmail: true });
    try {
      const res = await axiosInstance.post("/email/verify-otp", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      set({ authUser: null });
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isVerifyingEmail: false });
    }
  },

  resendEmailOTP: async () => {
    try {
      const res = await axiosInstance("/email/resend-otp");
      toast.success(res.data.message);
      return { success: true };
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      return { success: false };
    }
  },
  updateUserField: async (apiEndPoint, data) => {
    try {
      let res;
      if (data.email) {
        res = await axiosInstance.post(apiEndPoint, data);
      } else {
        res = await axiosInstance.put(apiEndPoint, data);
      }
      set({ authUser: res.data.user });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response?.data?.message);
      console.log(error);
      return false;
    }
  },

  uploadUserAvatar: async (data) => {
    set({ isUploadingAvatar: true });
    try {
      const res = await axiosInstance.post("/user/upload-avatar", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      return false;
    } finally {
      set({ isUploadingAvatar: false });
    }
  },

  removeUserAvatar: async () => {
    set({ isRemovingAvatar: true });
    try {
      const res = await axiosInstance.delete("/user/remove-avatar");
      set({ authUser: res.data.user });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      return false;
    } finally {
      set({ isRemovingAvatar: false });
    }
  },

  uploadUserCover: async (data) => {
    set({ isUploadingCover: true });
    try {
      const res = await axiosInstance.post("/user/upload-cover", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      return false;
    } finally {
      set({ isUploadingCover: false });
    }
  },

  removeUserCover: async () => {
    set({ isRemovingCover: true });
    try {
      const res = await axiosInstance.delete("/user/remove-cover");
      set({ authUser: res.data.user });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      return false;
    } finally {
      set({ isRemovingCover: false });
    }
  },

  checkEmailStatus: async () => {
    try {
      const res = await axiosInstance.get("email/check-status");
      set({ emailStatus: res.data.status });
      return get().emailStatus;
    } catch (error) {
      console.log(error.response.data.message);
      set({ emailStatus: "" });
    }
  },
}));
