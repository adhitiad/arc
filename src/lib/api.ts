import axios from "axios";
import { useAuthStore } from "./store.ts";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Pasang Token Otomatis
api.interceptors.request.use(
  (config) => {
    // Ambil token langsung dari State Zustand
    const state = useAuthStore.getState();
    const apiKey = state.apiKey;

    if (apiKey) {
      config.headers["X-API-KEY"] = apiKey;
    } else {
      console.warn(
        "⚠️ Warning: No API Key found in AuthStore. Request might fail."
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Handle Error Global (Misal Token Expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.error("🔒 Unauthorized/Forbidden. Redirecting to login...");
      // Opsional: Paksa logout jika token tidak valid
      // useAuthStore.getState().logout();
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
