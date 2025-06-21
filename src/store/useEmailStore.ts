import { create } from "zustand";

interface EmailStore {
  email: string | null;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

const useEmailStore = create<EmailStore>((set) => ({
  email: null,
  setEmail: (email: string) => set({ email }),
  clearEmail: () => set({ email: null }),
}));

export default useEmailStore;
