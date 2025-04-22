import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useContributionStore = create((set, get) => ({
  contributionCalendar: null,
  fetchingCalendar: false,
  totalContribution: 0,
  hasContributedToday: false,

  getContributionCalendar: async () => {
    set({ fetchingCalendar: true });
    try {
      const offsetMinutes = new Date().getTimezoneOffset() * -1;
      const res = await axiosInstance.get("/contribution", {
        params: { offsetMinutes },
      });
      const {
        weeks,
        totalContribution,
        hasContributedToday,
      } = res.data;

      set({
        contributionCalendar: weeks,
        totalContribution,
        hasContributedToday,
      });

      res.statusText === "OK";
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch calendar";
      set({ contributionCalendar: null });
      set({ totalContribution: 0 });

      console.log(message);
      console.log(error);
      toast.error(message);
      return false;
    } finally {
      set({ fetchingCalendar: false });
    }
  },
}));
