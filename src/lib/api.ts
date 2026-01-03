import axios from "axios";
import { useAuthStore } from "./store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Otomatis pasang API Key dari Zustand
api.interceptors.request.use((config) => {
  const { apiKey } = useAuthStore.getState();
  if (apiKey) {
    config.headers["X-API-KEY"] = apiKey;
  }
  return config;
});
