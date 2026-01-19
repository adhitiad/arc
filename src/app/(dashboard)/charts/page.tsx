"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Loader2, Search, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ChartData {
  symbol: string;
  timeframe: string;
  ohlcv: Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  indicators?: {
    rsi?: number[];
    macd?: { macd: number[]; signal: number[]; histogram: number[] };
    sma_20?: number[];
    sma_50?: number[];
    bandar_line?: number[];
  };
}

export default function ChartsPage() {
  const [symbol, setSymbol] = useState("BBCA.JK");
  const [timeframe, setTimeframe] = useState("1d");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["chart", symbol, timeframe],
    queryFn: async () => {
      const res = await api.get(
        `/market/chart/${symbol}?timeframe=${timeframe}`
      );
      return res.data as ChartData;
    },
    enabled: !!symbol,
  });

  const { data: marketDepth } = useQuery({
    queryKey: ["depth", symbol],
    queryFn: async () => {
      const res = await api.get(`/market/depth/${symbol}`);
      return res.data;
    },
    enabled: !!symbol,
  });

  // Initialize TradingView widget when component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && symbol) {
      // Load TradingView script if not already loaded
      if (!document.querySelector('script[src*="tradingview"]')) {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
          initTradingView();
        };
      } else {
        initTradingView();
      }
    }
  }, [symbol, timeframe]);

  const initTradingView = () => {
    if (typeof window !== "undefined" && (window as any).TradingView) {
      const container = document.getElementById("tradingview-chart");
      if (!container) return;

      // Remove any existing widget
      if ((window as any).tvWidget) {
        (window as any).tvWidget.remove();
      }

      const widget = new (window as any).TradingView.widget({
        container_id: "tradingview-chart",
        symbol: symbol,
        interval: timeframe === "1d" ? "D" : timeframe === "1h" ? "60" : "240",
        theme: "dark",
        style: 1,
        locale: "en",
        toolbar_bg: "#1f2937",
        enable_publishing: false,
        hide_legend: false,
        save_image: false,
        height: 600,
        width: "100%",
      });

      (window as any).tvWidget = widget;
    }
  };

  const timeframes = [
    { value: "1m", label: "1 Minute" },
    { value: "5m", label: "5 Minutes" },
    { value: "15m", label: "15 Minutes" },
    { value: "1h", label: "1 Hour" },
    { value: "4h", label: "4 Hours" },
    { value: "1d", label: "1 Day" },
    { value: "1w", label: "1 Week" },
  ];

  const popularSymbols = [
    "BBCA.JK",
    "TLKM.JK",
    "BMRI.JK",
    "ASII.JK",
    "UNVR.JK",
    "EURUSD",
    "GBPUSD",
    "USDJPY",
    "AUDUSD",
    "USDCAD",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Charts</h1>
          <p className="text-zinc-400">
            Advanced charting with technical indicators
          </p>
        </div>
      </div>

      {/* Chart Controls */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Chart Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <div className="flex gap-2">
                <Input
                  id="symbol"
                  placeholder="e.g., BBCA.JK, EURUSD"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="bg-zinc-800 border-zinc-700"
                />
                <Button
                  size="sm"
                  onClick={() => setSymbol(searchTerm || symbol)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quick Symbols</Label>
              <div className="flex flex-wrap gap-2">
                {popularSymbols.slice(0, 4).map((sym) => (
                  <Button
                    key={sym}
                    size="sm"
                    variant="outline"
                    onClick={() => setSymbol(sym)}
                    className={`border-zinc-600 text-xs ${
                      symbol === sym ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {sym}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Display */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {symbol} -{" "}
              {timeframes.find((tf) => tf.value === timeframe)?.label}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-zinc-600">
                Indicators
              </Button>
              <Button size="sm" variant="outline" className="border-zinc-600">
                Drawing Tools
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              Loading chart data...
            </div>
          ) : (
            <div className="space-y-4">
              {/* TradingView Chart Container */}
              <div
                id="tradingview-chart"
                className="w-full h-96 bg-zinc-800 rounded border border-zinc-700"
              />

              {/* Chart Info */}
              {chartData && chartData.ohlcv && chartData.ohlcv.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-zinc-500">Latest Price</div>
                    <div className="font-semibold text-lg">
                      {chartData.ohlcv[
                        chartData.ohlcv.length - 1
                      ]?.close.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-zinc-500">Volume (24h)</div>
                    <div className="font-semibold">
                      {(
                        chartData.ohlcv.reduce(
                          (sum, candle) => sum + candle.volume,
                          0
                        ) / 1000000
                      ).toFixed(1)}
                      M
                    </div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-zinc-500">RSI</div>
                    <div className="font-semibold text-blue-400">
                      {chartData.indicators?.rsi?.[
                        chartData.indicators.rsi.length - 1
                      ]?.toFixed(1) || "N/A"}
                    </div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-zinc-500">Bandar Status</div>
                    <div className="font-semibold text-green-400">
                      {chartData.indicators?.bandar_line ? "Active" : "Neutral"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Depth */}
      {marketDepth && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Market Depth - {symbol}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bids */}
              <div>
                <h4 className="font-semibold text-green-400 mb-3">
                  Bids (Buy Orders)
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {marketDepth.bids
                    ?.slice(0, 10)
                    .map((bid: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-green-400">{bid.price}</span>
                        <span className="text-zinc-400">{bid.volume}</span>
                      </div>
                    )) || (
                    <p className="text-zinc-500">No bid data available</p>
                  )}
                </div>
              </div>

              {/* Asks */}
              <div>
                <h4 className="font-semibold text-red-400 mb-3">
                  Asks (Sell Orders)
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {marketDepth.asks
                    ?.slice(0, 10)
                    .map((ask: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-red-400">{ask.price}</span>
                        <span className="text-zinc-400">{ask.volume}</span>
                      </div>
                    )) || (
                    <p className="text-zinc-500">No ask data available</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart Features Guide */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Chart Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">
                Technical Indicators
              </h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• RSI (Relative Strength Index)</li>
                <li>• MACD (Moving Average Convergence)</li>
                <li>• SMA (Simple Moving Average)</li>
                <li>• Bollinger Bands</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Bandar Analysis</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Bandar Accumulation Line</li>
                <li>• Smart Money Flow</li>
                <li>• Institutional Activity</li>
                <li>• Whale Tracking</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-400">AI Insights</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Pattern Recognition</li>
                <li>• Signal Strength</li>
                <li>• Risk Assessment</li>
                <li>• Market Sentiment</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
