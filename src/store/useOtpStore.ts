import { OtpData } from "@/types/type";
import { create } from "zustand";

interface OtpStore {
  otpData: OtpData | null;
  setOtp: (otp: OtpData) => void;
  clearOtp: () => void;
}

const useOtpStore = create<OtpStore>((set) => ({
  otpData: null,
  setOtp: (otp: OtpData) => set({ otpData: otp }),
  clearOtp: () => set({ otpData: null }),
}));

export default useOtpStore;
