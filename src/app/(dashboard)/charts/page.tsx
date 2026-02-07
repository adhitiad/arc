"use client";

import { ReplayControls } from "@/components/ReplayControls";
import { StockChart } from "@/components/StockChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function ChartsPage() {
  const { activeMarket } = useAuthStore();
  const [symbol, setSymbol] = useState("BBCA.JK");
  const [symbolQuery, setSymbolQuery] = useState("BBCA.JK");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("1d");
  const [isReplayMode, setIsReplayMode] = useState(false);

  const defaultSymbol = useMemo(() => {
    if (activeMarket === "CRYPTO") return "BTC/USDC";
    if (activeMarket === "FOREX") return "EURUSD=X";
    return "BBCA.JK";
  }, [activeMarket]);

  useEffect(() => {
    setSymbol(defaultSymbol);
    setSymbolQuery(defaultSymbol);
    setIsDropdownOpen(false);
  }, [defaultSymbol]);

  const cryptoSymbols = useMemo(
    () => [
      "BTC/USDC",
      "ETH/USDC",
      "SOL/USDC",
      "BNB/USDC",
      "XRP/USDC",
      "ADA/USDC",
      "DOGE/USDC",
      "AVAX/USDC",
      "LINK/USDC",
      "MATIC/USDC",
    ],
    [],
  );

  const cryptoOptions = useMemo(() => {
    const query = symbolQuery.trim().toUpperCase();
    const showAll = query.length < 2 || query === symbol.trim().toUpperCase();
    const filtered = showAll
      ? cryptoSymbols
      : cryptoSymbols.filter((item) => item.includes(query));
    return filtered.slice(0, 10);
  }, [cryptoSymbols, symbol, symbolQuery]);

  const searchEnabled =
    activeMarket !== "CRYPTO" &&
    isDropdownOpen &&
    symbolQuery.trim().length >= 2;

  const { data: searchResults = [], isFetching: isSearching } = useQuery({
    queryKey: ["charts-symbol-search", activeMarket, symbolQuery],
    queryFn: async () =>
      (
        await api.get("/search/", {
          params: { q: symbolQuery.trim() },
        })
      ).data,
    enabled: searchEnabled,
  });

  const symbolOptions = useMemo(() => {
    if (activeMarket === "CRYPTO") {
      return cryptoOptions.map((symbolOption) => ({
        symbol: symbolOption,
        category: "CRYPTO",
        status: null,
      }));
    }

    const filtered = (searchResults || []).filter((item: any) => {
      const category = String(item?.category || "");
      if (activeMarket === "FOREX") return category === "FOREX";
      if (activeMarket === "STOCK") return category.startsWith("STOCK");
      return false;
    });

    return filtered.slice(0, 10);
  }, [activeMarket, cryptoOptions, searchResults]);

  const { data: chartPayload, isFetching: isChartLoading, refetch } = useQuery({
    queryKey: ["charts-data", symbol, timeframe],
    queryFn: async () =>
      (
        await api.get(`/market/chart/${symbol}`, {
          params: { timeframe },
        })
      ).data,
    enabled: Boolean(symbol),
  });

  const chartData = useMemo(() => {
    const rows = chartPayload?.data || [];

    return rows
      .map((row: any) => {
        const rawTime = row.time ?? row.date ?? row.timestamp;
        let time: any = rawTime;
        if (typeof rawTime === "string" || typeof rawTime === "number") {
          const parsed = new Date(rawTime).getTime();
          if (!Number.isNaN(parsed)) {
            time = Math.floor(parsed / 1000);
          }
        }
        return {
          time,
          open: Number(row.open ?? row.Open ?? 0),
          high: Number(row.high ?? row.High ?? 0),
          low: Number(row.low ?? row.Low ?? 0),
          close: Number(row.close ?? row.Close ?? 0),
        };
      })
      .filter((row: any) => Number.isFinite(row.open) && row.time);
  }, [chartPayload]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Technical Analysis
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-72">
          <Input
            className="bg-zinc-900 border-zinc-800"
            placeholder={`Search ${activeMarket} symbol`}
            value={symbolQuery}
            onChange={(event) => {
              setSymbolQuery(event.target.value.toUpperCase());
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => window.setTimeout(() => setIsDropdownOpen(false), 150)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && symbolOptions.length > 0) {
                event.preventDefault();
                const firstOption = symbolOptions[0];
                setSymbol(firstOption.symbol);
                setSymbolQuery(firstOption.symbol);
                setIsDropdownOpen(false);
              }
            }}
          />
          {isDropdownOpen && (
            <div className="absolute z-50 mt-2 w-full rounded border border-zinc-800 bg-zinc-950 shadow-xl">
              {isSearching ? (
                <div className="px-3 py-2 text-xs text-zinc-500">
                  Searching...
                </div>
              ) : activeMarket !== "CRYPTO" &&
                symbolQuery.trim().length < 2 ? (
                <div className="px-3 py-2 text-xs text-zinc-500">
                  Type at least 2 characters.
                </div>
              ) : symbolOptions.length === 0 ? (
                <div className="px-3 py-2 text-xs text-zinc-500">
                  No matches.
                </div>
              ) : (
                symbolOptions.map((option: any) => (
                  <button
                    key={option.symbol}
                    type="button"
                    onMouseDown={() => {
                      setSymbol(option.symbol);
                      setSymbolQuery(option.symbol);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{option.symbol}</span>
                      {option.status ? (
                        <span className="text-[10px] text-zinc-500">
                          {option.status}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {option.category}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: "15m", value: "15m" },
            { label: "1h", value: "1h" },
            { label: "1d", value: "1d" },
          ].map((option) => (
            <Button
              key={option.value}
              variant={timeframe === option.value ? "default" : "outline"}
              className="border-zinc-800"
              onClick={() => setTimeframe(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          className="border-zinc-800"
          onClick={() => refetch()}
        >
          <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <CardHeader className="border-b border-zinc-800 pb-3">
          <CardTitle>
            {symbol} - {timeframe.toUpperCase()} Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Chart Component */}
          {isReplayMode && (
            <ReplayControls
              onPlay={() => console.log("Connect WS Replay")}
              onDateChange={(date: string) => console.log("Load data", date)}
              onReset={() => console.log("Reset Replay")}
              onPause={() => console.log("Disconnect WS Replay")}
            />
          )}
          {isChartLoading && chartData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-zinc-500">
              Loading chart...
            </div>
          ) : (
            <StockChart data={chartData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
