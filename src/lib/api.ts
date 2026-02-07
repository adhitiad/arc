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

// --- Authentication & Users ---
export const registerUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/register", { email, password });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const connectTelegram = async (telegramChatId: string) => {
  try {
    const response = await api.post("/user/connect-telegram", {
      telegram_chat_id: telegramChatId,
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const addToWatchlist = async (symbol: string) => {
  try {
    const response = await api.post("/user/watchlist/add", undefined, {
      params: { symbol },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const removeFromWatchlist = async (symbol: string) => {
  try {
    const response = await api.delete("/user/watchlist/remove", {
      params: { symbol },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getWatchlist = async () => {
  try {
    const response = await api.get("/user/watchlist");
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const updateBalanceSettings = async (
  stockIdr: number,
  forexUsd: number,
) => {
  try {
    const response = await api.post("/user/settings/balance", {
      stock_idr: stockIdr,
      forex_usd: forexUsd,
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const checkSignal = async (symbol: string) => {
  try {
    const response = await api.get(`/user/signal/check/${symbol}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const updateTelegramSettings = async (chatId: string) => {
  try {
    const response = await api.post("/user/settings/telegram", {
      chat_id: chatId,
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- Real-Time Market Data ---
export const getDashboardData = async () => {
  try {
    const response = await api.get("/dashboard/all");
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getChartData = async (
  symbol: string,
  timeframe: string = "1h",
) => {
  try {
    const encodedSymbol = encodeURIComponent(symbol);
    const response = await api.get(`/market/chart/${encodedSymbol}`, {
      params: { timeframe },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getMarketDepth = async (symbol: string) => {
  try {
    const response = await api.get(`/market/depth/${symbol}`);
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- Search Functionality ---
export const searchAssets = async (query: string) => {
  try {
    const response = await api.get("/search/", { params: { q: query } });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const response = await api.get("/user/admin/search-user", {
      params: { q: query },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- AI Pipeline (Auto-ML) ---
export const runOptimization = async (symbol: string) => {
  try {
    const response = await api.post("/pipeline/optimize", undefined, {
      params: { symbol },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getOptimizationStatus = async (symbol: string) => {
  try {
    const response = await api.get("/pipeline/status", { params: { symbol } });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- Backtesting ---
export const runBacktest = async (
  symbol: string,
  period: string = "2y",
  balance: number = 100000000,
) => {
  try {
    const response = await api.get("/backtest/run", {
      params: { symbol, period, balance },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- Alerts & Screener ---
export const createAlert = async (
  symbol: string,
  type: string,
  condition: string,
  targetPrice: number,
  note: string,
) => {
  try {
    const response = await api.post("/alerts/create", {
      symbol,
      type,
      condition,
      target_price: targetPrice,
      note,
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getAlerts = async () => {
  try {
    const response = await api.get("/alerts/list");
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- Market Screener ---
export const runScreener = async (
  minScore: number = 0,
  rsiMax: number = 100,
  rsiMin: number = 0,
  signalOnly: boolean = false,
  bandarAccum: boolean = false,
) => {
  try {
    const response = await api.get("/screener/run", {
      params: {
        min_score: minScore,
        rsi_max: rsiMax,
        rsi_min: rsiMin,
        signal_only: signalOnly,
        bandar_accum: bandarAccum,
      },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- Trading Journal ---
export const getTradeHistory = async (limit: number = 50) => {
  try {
    const response = await api.get("/journal/history", { params: { limit } });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getPerformanceStats = async () => {
  try {
    const response = await api.get("/journal/stats");
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- Admin Operations ---
export const requestUpgrade = async (targetRole: string) => {
  try {
    const response = await api.post("/admin/user/request-upgrade", {
      target_role: targetRole,
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getUpgradeQueue = async () => {
  try {
    const response = await api.get("/admin/admin/upgrade-queue");
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const executeUpgrade = async (
  requestId: string,
  action: string,
  note: string,
) => {
  try {
    const response = await api.post("/admin/admin/execute-upgrade", {
      request_id: requestId,
      action,
      note,
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// --- Owner Operations ---
export const getFileTree = async () => {
  try {
    const response = await api.get("/owner/files/tree");
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const readFile = async (path: string) => {
  try {
    const response = await api.post("/owner/files/read", { path });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const saveFile = async (path: string, content: string) => {
  try {
    const response = await api.post("/owner/files/save", { path, content });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const validateAndFixCode = async (path: string, content: string) => {
  try {
    const response = await api.post("/owner/files/validate-fix", {
      path,
      content,
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getLogs = async () => {
  try {
    const response = await api.get("/owner/logs/stream");
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const retrainModel = async () => {
  try {
    const response = await api.post("/owner/action/retrain");
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const restartBot = async () => {
  try {
    const response = await api.post("/owner/action/restart-bot");
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getDatabaseContent = async (
  collectionName: string,
  limit: number = 20,
) => {
  try {
    const response = await api.get(`/owner/db/view/${collectionName}`, {
      params: { limit },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};
