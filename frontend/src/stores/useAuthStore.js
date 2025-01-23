import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,
  isVerifyingEmail: false,
  emailStatus: "",

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    const { authUser } = get();
    try {
      const res = await axiosInstance.get('/user/check/auth');
      console.log(res.data);
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
      const res = await axiosInstance.post('/user/signup', data);
      const { user, message } = res.data;
      set({ authUser: user });
      toast.success(message);
      return { success: true };
    } catch (error) {
      set({ authUser: null });
      toast.error(error.response.data.message);
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/user/login', data);
      set({ authUser: res.data });
      toast.success("sign up successful");
    } catch (error) {
      set({ authUser: null });
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post('/user/logout');
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
      const res = await axiosInstance.post('/email/verify-otp', data);
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
      const res = await axiosInstance('/email/resend-otp');
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  },
  updateUserField: async (apiEndPoint, data) => {
    try {
      const res = await axiosInstance.put(apiEndPoint, data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      toast.success(error.response.data.message);
      console.log(error);
    }
  },
  checkEmailStatus: async () => {
    try {
      const res = await axiosInstance.get('email/check-status');
      set({ emailStatus: res.data.status });
    } catch (error) {
      console.log(error.response.data.message);
      set({ emailStatus: "" });
    } finally{
      console.log("status", get().emailStatus);
    }
  }
})); 