"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ChartWidget = ({
  type,
  summary,
}: {
  type: string;
  summary?: {
    symbol: string;
    price: number;
    changePercent: number;
    rsi?: number;
  };
}) => (
  <div className="h-64 bg-zinc-950/50 rounded border border-zinc-800 flex items-center justify-center text-zinc-500">
    <div className="text-center space-y-2">
      <div className="text-sm">{type} Chart Module</div>
      {summary ? (
        <div className="space-y-1 text-xs text-zinc-400">
          <div className="font-semibold text-zinc-200">{summary.symbol}</div>
          <div>
            Price:{" "}
            <span className="text-zinc-200">
              {summary.price.toLocaleString()}
            </span>
          </div>
          <div
            className={
              summary.changePercent >= 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {summary.changePercent >= 0 ? "+" : ""}
            {summary.changePercent.toFixed(2)}%
          </div>
          {summary.rsi !== undefined && (
            <div className="text-zinc-500">RSI: {summary.rsi.toFixed(1)}</div>
          )}
        </div>
      ) : (
        <div className="text-xs text-zinc-500">No data</div>
      )}
    </div>
  </div>
);

const OrderEntryWidget = ({
  simplified,
  symbol,
  price,
}: {
  simplified: boolean;
  symbol: string;
  price?: number;
}) => (
  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">
    <h4 className="font-bold mb-2 text-green-400">⚡ Instant Execution</h4>
    <div className="text-xs text-zinc-500 mb-3">
      {symbol} {price !== undefined ? `• ${price.toLocaleString()}` : ""}
    </div>
    <div className="flex gap-2">
      <Button className="flex-1 bg-green-600 hover:bg-green-700">BUY</Button>
      <Button className="flex-1 bg-red-600 hover:bg-red-700">SELL</Button>
    </div>
    {!simplified && (
      <div className="mt-2 text-xs text-zinc-500">
        Advanced limit order settings...
      </div>
    )}
  </div>
);

const FinancialWidget = ({
  summary,
  symbol,
}: {
  summary?: string;
  symbol: string;
}) => (
  <div className="h-64 bg-zinc-900 border border-zinc-800 rounded p-4">
    <h4 className="font-bold text-blue-400 mb-2">
      📊 Financial Report (AI Summary)
    </h4>
    <p className="text-xs text-zinc-500 mb-2">{symbol}</p>
    <p className="text-sm text-zinc-400">
      {summary || "No report available yet."}
    </p>
  </div>
);

export function AdaptiveLayout() {
  // Nanti state ini bisa diubah otomatis oleh AI Backend berdasarkan history trading user
  const [persona, setPersona] = useState<"SCALPER" | "INVESTOR" | "SWING">(
    "SWING",
  );
  const { activeMarket } = useAuthStore();

  const defaultSymbol = useMemo(() => {
    if (activeMarket === "CRYPTO") return "BTC/USDC";
    if (activeMarket === "FOREX") return "EURUSD=X";
    return "BBCA.JK";
  }, [activeMarket]);

  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [symbolQuery, setSymbolQuery] = useState(defaultSymbol);
  const [isSymbolOpen, setIsSymbolOpen] = useState(false);

  useEffect(() => {
    setSelectedSymbol(defaultSymbol);
    setSymbolQuery(defaultSymbol);
    setIsSymbolOpen(false);
  }, [defaultSymbol]);

  const timeframe = useMemo(() => {
    if (persona === "SCALPER") return "15m";
    if (persona === "INVESTOR") return "1d";
    return "1h";
  }, [persona]);

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
    const showAll =
      query.length < 2 || query === selectedSymbol.trim().toUpperCase();
    const filtered = showAll
      ? cryptoSymbols
      : cryptoSymbols.filter((item) => item.includes(query));
    return filtered.slice(0, 10);
  }, [cryptoSymbols, selectedSymbol, symbolQuery]);

  const searchEnabled =
    activeMarket !== "CRYPTO" &&
    isSymbolOpen &&
    symbolQuery.trim().length >= 2;

  const { data: searchResults = [], isFetching: isSearching } = useQuery({
    queryKey: ["symbol-search", activeMarket, symbolQuery],
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

  const activeSymbol = selectedSymbol || defaultSymbol;

  const { data: chartData } = useQuery({
    queryKey: ["market-chart", activeSymbol, timeframe],
    queryFn: async () =>
      (
        await api.get(`/market/chart/${activeSymbol}`, {
          params: { timeframe },
        })
      ).data,
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard", "signals"],
    queryFn: async () => (await api.get("/dashboard/all")).data,
    refetchInterval: 60000,
  });

  const scalperSignals = useMemo(() => {
    const items = dashboardData?.signals?.items || [];

    const categoryFromSymbol = (sym: string) => {
      if (sym.includes("/")) return "CRYPTO";
      if (sym.endsWith(".JK")) return "STOCK";
      if (sym.endsWith("=X") || sym.length === 6) return "FOREX";
      return "STOCK";
    };

    return items
      .map((item: any) => {
        const sym = item.Symbol || item.symbol || item.ticker || "UNKNOWN";
        const actionRaw = String(
          item.Action || item.action || "HOLD",
        ).toUpperCase();
        const action = actionRaw.startsWith("BUY")
          ? "BUY"
          : actionRaw.startsWith("SELL")
            ? "SELL"
            : "HOLD";
        return {
          symbol: sym,
          action,
          category: categoryFromSymbol(sym),
        };
      })
      .filter((signal: any) => {
        if (activeMarket === "CRYPTO") return signal.category === "CRYPTO";
        if (activeMarket === "FOREX") return signal.category === "FOREX";
        return signal.category === "STOCK";
      })
      .filter((signal: any) => signal.action !== "HOLD")
      .slice(0, 2);
  }, [dashboardData, activeMarket]);

  const summary = useMemo(() => {
    const rows = chartData?.data || [];
    if (!rows.length) return undefined;
    const last = rows[rows.length - 1];
    const prev = rows.length > 1 ? rows[rows.length - 2] : last;
    const changePercent =
      prev?.close && prev.close !== 0
        ? ((last.close - prev.close) / prev.close) * 100
        : 0;

    return {
      symbol: activeSymbol,
      price: Number(last?.close ?? 0),
      changePercent,
      rsi: last?.rsi,
    };
  }, [chartData, activeSymbol]);

  const { data: analysisData } = useQuery({
    queryKey: ["analysis-latest", activeSymbol],
    queryFn: async () => (await api.get(`/analysis/latest/${activeSymbol}`)).data,
    enabled: activeMarket === "STOCK",
  });

  const analysisSummary =
    analysisData?.analysis?.summary ||
    analysisData?.summary ||
    analysisData?.analysis?.highlights?.[0];

  return (
    <div className="space-y-6">
      {/* AI Persona Selector (Bisa disembunyikan jika fully automatic) */}
      <div className="flex items-center justify-between gap-4">
         <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Zap className="w-4 h-4 text-purple-500" />
            <span>AI Detected Persona: <strong>{persona}</strong></span>
         </div>
         <div className="flex items-center gap-4">
           <div className="relative w-64">
             <Input
               value={symbolQuery}
               onChange={(event) => {
                 setSymbolQuery(event.target.value.toUpperCase());
                 setIsSymbolOpen(true);
               }}
               onFocus={() => setIsSymbolOpen(true)}
               onBlur={() => {
                 window.setTimeout(() => setIsSymbolOpen(false), 150);
               }}
               onKeyDown={(event) => {
                 if (event.key === "Enter" && symbolOptions.length > 0) {
                   event.preventDefault();
                   const firstOption = symbolOptions[0];
                   setSelectedSymbol(firstOption.symbol);
                   setSymbolQuery(firstOption.symbol);
                   setIsSymbolOpen(false);
                 }
               }}
               placeholder={`Search ${activeMarket} symbol`}
             />
             {isSymbolOpen && (
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
                         setSelectedSymbol(option.symbol);
                         setSymbolQuery(option.symbol);
                         setIsSymbolOpen(false);
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
           <Tabs value={persona} onValueChange={(v: any) => setPersona(v)}>
              <TabsList className="bg-zinc-900">
                  <TabsTrigger value="SCALPER">Scalper (Speed)</TabsTrigger>
                  <TabsTrigger value="SWING">Swing (Balanced)</TabsTrigger>
                  <TabsTrigger value="INVESTOR">Investor (Deep)</TabsTrigger>
              </TabsList>
           </Tabs>
         </div>
      </div>

      {/* --- LAYOUT 1: SCALPER (Focus: Speed, 1-Min Chart, Big Buttons) --- */}
      {persona === "SCALPER" && (
        <div className="grid grid-cols-12 gap-4 animate-in fade-in duration-500">
            <div className="col-span-8 space-y-4">
                <ChartWidget type="1-Minute Tick" summary={summary} />
                <div className="grid grid-cols-2 gap-4">
                     <ChartWidget type="Orderflow / Tape" summary={summary} />
                     <ChartWidget type="RSI Divergence" summary={summary} />
                </div>
            </div>
            <div className="col-span-4 space-y-4">
                <OrderEntryWidget
                  simplified={true}
                  symbol={activeSymbol}
                  price={summary?.price}
                />
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader><CardTitle className="text-sm">Scalp Signals</CardTitle></CardHeader>
                    <CardContent className="text-xs text-zinc-400 space-y-2">
                        {scalperSignals.length === 0 ? (
                          <div className="text-zinc-500">No signals yet.</div>
                        ) : (
                          scalperSignals.map((signal: any) => (
                            <div
                              key={`${signal.symbol}-${signal.action}`}
                              className={`flex justify-between ${
                                signal.action === "SELL"
                                  ? "text-red-400"
                                  : "text-green-400"
                              }`}
                            >
                              <span>{signal.symbol}</span>
                              <span>{signal.action}</span>
                            </div>
                          ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

      {/* --- LAYOUT 2: INVESTOR (Focus: Fundamentals, Weekly Chart, No Noise) --- */}
      {persona === "INVESTOR" && (
        <div className="grid grid-cols-12 gap-4 animate-in fade-in duration-500">
            <div className="col-span-8 space-y-4">
                <ChartWidget type="Weekly Candle" summary={summary} />
                <FinancialWidget summary={analysisSummary} symbol={activeSymbol} />
            </div>
            <div className="col-span-4 space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader><CardTitle className="text-sm">Portfolio Health</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">+12.5%</div>
                        <p className="text-xs text-zinc-500">YTD Return (Low Risk)</p>
                    </CardContent>
                </Card>
                <div className="p-4 bg-blue-900/10 border border-blue-900/50 rounded text-sm text-blue-200">
                    <BookOpen className="w-4 h-4 mb-2 inline mr-2"/>
                    AI Suggestion: Rebalance your portfolio. Technology sector is overweight.
                </div>
            </div>
        </div>
      )}

      {/* --- LAYOUT 3: SWING (Balanced) --- */}
      {persona === "SWING" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
             <div className="col-span-2">
               <ChartWidget type="Daily" summary={summary} />
             </div>
             <div className="col-span-1 space-y-4">
                <OrderEntryWidget
                  simplified={false}
                  symbol={activeSymbol}
                  price={summary?.price}
                />
                <FinancialWidget summary={analysisSummary} symbol={activeSymbol} />
             </div>
        </div>
      )}
    </div>
  );
}
