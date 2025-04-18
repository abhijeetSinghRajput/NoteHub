import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useContributionStore = create((set, get) => ({
  contributionCalendar: null,
  fetchingCalendar: false,

  getContributionCalendar: async () => {
    set({ fetchingCalendar: true });
    try {
        const res = await axiosInstance.get('/contribution');
        console.log(res);
        set({contributionCalendar: res.data});
        console.log(contributionCalendar);
        return true;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to fetch calendar';
        set({contributionCalendar: null});
        console.log(message);
        console.log(error);
        toast.error(message);
        return false;
    } finally {
      set({ fetchingCalendar: false });
    }
  },
}));
