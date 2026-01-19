import axios from "axios";
import { useAuthStore } from "./store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const api = axios.create({
  baseURL: API_BASE_URL,
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
        "⚠️ Warning: No API Key found in AuthStore. Request might fail.",
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor: Handle Error Global (Misal Token Expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.error("🔒 Unauthorized/Forbidden. Redirecting to login...");
      // Opsional: Paksa logout jika token tidak valid
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Test API connectivity
export const testApiConnection = async () => {
  try {
    const response = await api.get("/health");
    console.log("✅ API Connection successful:", response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("❌ API Connection failed:", error.message);
    return {
      success: false,
      error: error.message,
      details: error.response?.data || "Network error",
    };
  }
};
