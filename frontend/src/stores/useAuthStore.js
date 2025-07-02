import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { io } from "socket.io-client";
const BASE_URL = "http://localhost:3001";

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
  sessionId: null,
  socket: null,
  onlineUsers: [],

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

  isEmailAvailable: async (email) => {
    try {
      const response = await axiosInstance.get(`/user/check-email/${email}`);
      return response.data.available;
    } catch (error) {
      console.error("Email check failed:", error);
      return false;
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
  getAllUsers: async (page = 1, limit = 10, search = "", filter = "all") => {
    try {
      const response = await axiosInstance.get("/user", {
        params: { page, limit, search, filter },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        users: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalUsers: 0,
          usersPerPage: limit,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        counts: {
          all: 0,
          online: 0,
          oauth: 0,
        },
      };
    }
  },
  searchUsers: async (query) => {
    try {
      const response = await axiosInstance.get(`/search/users`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },
  searchNotes: async (query) => {
    try {
      const response = await axiosInstance.get(`/search/notes`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/user/me");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log(console.log(error));
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      const { message, user } = res.data;
      set({ authUser: user });
      toast.success(message);
      get().connectSocket();
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
      const response = await axiosInstance.post("/auth/send-signup-otp", {
        email,
      });
      toast.success(response.data.message || "OTP sent successfully!");
      return response.data;
    } catch (error) {
      if (error.status === 429) {
        toast.error("Too many requests. Please try again later.");
        return null;
      }
      toast.error(error.response?.data?.message || "Failed to send email");
      console.error("Send OTP error:", error);
      return null;
    } finally {
      set({ isSendingOtp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const { user, sessionId } = res.data;
      set({ authUser: user, sessionId });
      get().connectSocket();
      toast.success("Log in successful");
    } catch (error) {
      set({ authUser: null });
      console.log(error);
      toast.error(error.response.data.message || "error while logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // 📂 client/src/stores/useAuthStore.js
  googleLogin: async ({ code, codeVerifier, redirectUri }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("auth/google-login", {
        code,
        codeVerifier,
        redirectUri,
      });
      set({ authUser: res.data.user });
      console.log(res.data.user);
      get().connectSocket();
      toast.success("Log in successful");
      return true;
    } catch (error) {
      set({ authUser: null });
      toast.error(error.response?.data?.message || "OAuth Login Failed");
      return null;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
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

  uploadUserAvatar: async (file) => {
    set({ isUploadingAvatar: true });
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axiosInstance.post("/user/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  uploadUserCover: async (file) => {
    set({ isUploadingCover: true });
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axiosInstance.post("/user/upload-cover", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data.user);
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

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();
    set({ socket });

    socket.on("online-users", (onlineUsers) => {
      set({ onlineUsers });
      console.log(get().onlineUsers)
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
  },
}));
