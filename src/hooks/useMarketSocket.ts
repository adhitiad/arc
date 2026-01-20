import { useAuthStore } from "@/lib/store";
import { useEffect, useRef, useState } from "react";

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: string;
}

export const useMarketSocket = (symbol: string) => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { apiKey } = useAuthStore(); // Asumsi auth store menyimpan API Key/Token

  useEffect(() => {
    if (!symbol) return;

    // Ganti URL sesuai environment (ws://localhost:8000 atau wss://api.domain.com)
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/market/${symbol}?token=${apiKey}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log(`🟢 WS Connected: ${symbol}`);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };

    ws.onclose = () => {
      console.log(`🔴 WS Disconnected: ${symbol}`);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [symbol, apiKey]);

  return { data, isConnected };
};
