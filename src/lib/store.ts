import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  email: string | null;
  role: string | null; // free, premium, admin, owner
  apiKey: string | null;
  login: (email: string, apiKey: string, role: string) => void;
  activeMarket: "STOCK" | "CRYPTO" | "FOREX";
  setMarket: (market: "STOCK" | "CRYPTO" | "FOREX") => void;
  logout: () => void;
}

export const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      role: null,
      apiKey: process.env.NEXT_PUBLIC_API_KEY || null,
      activeMarket: "STOCK", // Default
      setMarket: (market) => set({ activeMarket: market }),
      login: (email, apiKey, role) => set({ email, apiKey, role }),
      logout: () => set({ email: null, apiKey: null, role: null }),
    }),
    { name: "user_storage" },
  ),
);
