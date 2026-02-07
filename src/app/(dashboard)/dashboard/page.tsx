"use client";

import { AdaptiveLayout } from "@/components/AdaptiveLayout";
import { AnomalyWidget, type AnomalyProps } from "@/components/AnomalyWidget";
import { BandarDetector } from "@/components/BandarDetector";
import { CommandCenter } from "@/components/CommandCenter";
import { CryptoWidget } from "@/components/CryptoWidget";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { EnterpriseDashboard } from "@/components/dashboard/EnterpriseDashboard";
import { FreeDashboard } from "@/components/dashboard/FreeDashboard";
import SignalCard from "@/components/dashboard/SignalCard";
import { ForexWidget } from "@/components/ForexWidget";
import { GamificationHub } from "@/components/GamificationHub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketStatus } from "@/hooks/useMarketStatus";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const { role, activeMarket } = useAuthStore();
  const marketStatus = useMarketStatus(activeMarket);
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard", "all"],
    queryFn: async () => (await api.get("/dashboard/all")).data,
    refetchInterval: 60000,
  });

  const [currentSignalPage, setCurrentSignalPage] = useState(1);
  const signalsPerPage = 3;

  const BANDAR_STOCK_SYMBOLS = [
    { value: "BBCA.JK", label: "BBCA (BCA)" },
    { value: "BBRI.JK", label: "BBRI (BRI)" },
    { value: "BBNI.JK", label: "BBNI (BNI)" },
    { value: "BMRI.JK", label: "BMRI (Mandiri)" },
    { value: "TLKM.JK", label: "TLKM (Telkom)" },
    { value: "GOTO.JK", label: "GOTO (GoTo)" },
    { value: "ASII.JK", label: "ASII (Astra)" },
    { value: "UNVR.JK", label: "UNVR (Unilever)" },
    { value: "ICBP.JK", label: "ICBP (Indofood)" },
    { value: "ADRO.JK", label: "ADRO (Adaro)" },
    { value: "SMGR.JK", label: "SMGR (Semen Indonesia)" },
    { value: "INDF.JK", label: "INDF (Indofood)" },
  ];

  const [selectedBandarSymbol, setSelectedBandarSymbol] = useState("BBCA.JK");
  const bandarSymbol = selectedBandarSymbol;
  const { data: bandarData } = useQuery({
    queryKey: ["bandar", bandarSymbol],
    queryFn: async () => (await api.get(`/market/bandar/${bandarSymbol}`)).data,
    enabled: activeMarket === "STOCK",
    refetchInterval: 300000,
  });

  const { data: bandarChartData } = useQuery({
    queryKey: ["market-chart", bandarSymbol],
    queryFn: async () =>
      (
        await api.get(`/market/chart/${bandarSymbol}`, {
          params: { timeframe: "1d" },
        })
      ).data,
    enabled: activeMarket === "STOCK",
  });

  const bandarTechnicals = useMemo(() => {
    const rows = bandarChartData?.data || [];
    if (!rows.length) return {};
    const last = rows[rows.length - 1];
    const prev = rows.length > 1 ? rows[rows.length - 2] : last;
    const changePercent =
      prev?.close && prev.close !== 0
        ? ((last.close - prev.close) / prev.close) * 100
        : 0;
    return {
      rsi: last?.rsi != null ? Number(last.rsi) : undefined,
      macd: last?.macd != null ? Number(last.macd) : undefined,
      changePercent,
    };
  }, [bandarChartData]);

  const bandarSignalProb = useMemo(() => {
    const items = dashboardData?.signals?.items || [];
    const match = items.find(
      (s: any) =>
        (s.Symbol || s.symbol || s.ticker || "").replace(".JK", "") ===
        (bandarData?.symbol || "BBCA").replace(".JK", ""),
    );
    const prob = match?.Prob ?? match?.prob ?? match?.signal_score;
    if (prob == null) return undefined;
    const num =
      typeof prob === "string"
        ? parseFloat(prob.replace("%", ""))
        : Number(prob);
    return Number.isFinite(num) ? num : undefined;
  }, [dashboardData, bandarData]);

  const { signals, openTrades, counts } = useMemo(() => {
    const items = dashboardData?.signals?.items || [];
    const open = dashboardData?.open_trades || [];

    const categoryFromSymbol = (symbol: string) => {
      if (symbol.includes("/")) return "CRYPTO";
      if (symbol.endsWith(".JK")) return "STOCK";
      if (symbol.endsWith("=X") || symbol.length === 6) return "FOREX";
      return "STOCK";
    };

    const filterByMarket = (symbol: string) => {
      const category = categoryFromSymbol(symbol);
      if (activeMarket === "CRYPTO") return category === "CRYPTO";
      if (activeMarket === "FOREX") return category === "FOREX";
      return category === "STOCK";
    };

    const normalizedSignals = items
      .map((item: any) => {
        const symbol = item.Symbol || item.symbol || item.ticker || "UNKNOWN";
        const actionRaw = String(
          item.Action || item.action || "HOLD",
        ).toUpperCase();
        const action = actionRaw.startsWith("BUY")
          ? "BUY"
          : actionRaw.startsWith("SELL")
            ? "SELL"
            : "HOLD";
        const category = categoryFromSymbol(symbol);
        return {
          Symbol: symbol,
          Category: category,
          Action: action,
          Price: Number(item.Price ?? item.price ?? 0),
          Tp: Number(item.Tp ?? item.tp ?? 0),
          Sl: Number(item.Sl ?? item.sl ?? 0),
          LotSize: item.LotSize ?? item.lot_size,
          Prob: item.Prob ?? item.prob,
          Whale_Activity: item.Whale_Activity ?? item.whale_activity,
          Bandar_Info: item.Bandar_Info ?? item.bandar_info,
          AI_Analyst: item.AI_Analyst ?? item.ai_analyst,
          Reason: item.Reason ?? item.reason,
          _include: filterByMarket(symbol),
        };
      })
      .filter((item: any) => item._include);

    const normalizedOpenTrades = open.filter((trade: any) => {
      const symbol = trade.symbol || trade.Symbol || "UNKNOWN";
      return filterByMarket(symbol);
    });

    const countsByAction = normalizedSignals.reduce(
      (acc: { BUY: number; SELL: number; HOLD: number }, signal: any) => {
        if (signal.Action === "BUY") acc.BUY += 1;
        else if (signal.Action === "SELL") acc.SELL += 1;
        else acc.HOLD += 1;
        return acc;
      },
      { BUY: 0, SELL: 0, HOLD: 0 },
    );

    return {
      signals: normalizedSignals,
      openTrades: normalizedOpenTrades,
      counts: countsByAction,
    };
  }, [dashboardData, activeMarket]);

  const headlineSignal = signals.find((s: any) => s.Action !== "HOLD");
  const anomalyData = headlineSignal
    ? {
        type:
          headlineSignal.Action === "BUY"
            ? "ACCUMULATION_DETECTED"
            : "DISTRIBUTION_DETECTED",
        message: `${headlineSignal.Symbol} ${headlineSignal.Action} signal detected (${headlineSignal.Prob || "n/a"})`,
        severity: "MEDIUM",
      }
    : { type: "NORMAL", message: "", severity: "LOW" };

  // Calculate signal pagination
  const totalSignalPages = Math.ceil(signals.length / signalsPerPage);
  const startSignalIndex = (currentSignalPage - 1) * signalsPerPage;
  const currentSignals = signals.slice(
    startSignalIndex,
    startSignalIndex + signalsPerPage,
  );

  // Handle signal page change
  const handleSignalPageChange = (page: number) => {
    if (page >= 1 && page <= totalSignalPages) {
      setCurrentSignalPage(page);
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  // --- LOGIC SWITCHER DASHBOARD ---

  // 1. TAMPILAN FREE USER
  if (role === "free" || !role) {
    return (
      <FreeDashboard
        signals={signals}
        counts={counts}
        serverTime={dashboardData?.server_time}
        marketLabel={marketStatus.label}
        activeMarket={activeMarket}
      />
    );
  }

  // 2. TAMPILAN ENTERPRISE USER
  if (role === "enterprise") {
    return (
      <div className="relative space-y-8 pb-10">
        <CommandCenter /> {/* Enterprise juga dapat Command Center */}
        <EnterpriseDashboard
          signals={signals}
          counts={counts}
          openTrades={openTrades}
          serverTime={dashboardData?.server_time}
          marketLabel={marketStatus.label}
        />
      </div>
    );
  }

  // 3. TAMPILAN PREMIUM USER (Default: Adaptive & Gamification)
  return (
    <div className="relative space-y-8 pb-10">
      {/* Invisible Interface */}
      <CommandCenter />

      {/* Market Status Banner */}
      <div
        className={`rounded-lg border px-4 py-3 text-sm ${
          marketStatus.isOpen
            ? "bg-green-900/10 border-green-800 text-green-200"
            : "bg-red-900/10 border-red-800 text-red-200"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold">
            {marketStatus.label} • {marketStatus.isOpen ? "Open" : "Closed"}
          </div>
          <div className="text-xs text-zinc-400">
            {marketStatus.localTime} • {marketStatus.sessionNote}
          </div>
        </div>
        <div className="text-xs text-zinc-400 mt-1">
          {marketStatus.nextChange}
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Trading Terminal
          </h1>
          <p className="text-zinc-400 text-sm">
            Press{" "}
            <kbd className="bg-zinc-800 px-1 rounded text-xs border border-zinc-700">
              ⌘K
            </kbd>{" "}
            to execute.
          </p>
        </div>
      </div>

      {/* High Priority Alerts */}
      <AnomalyWidget data={[anomalyData as AnomalyProps]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Area */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm text-zinc-400">
                  Live Signals ({signals.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {signals.length === 0 ? (
                  <div className="text-sm text-zinc-500">
                    No active signals for this market yet.
                  </div>
                ) : (
                  currentSignals.map((signal: any) => (
                    <SignalCard key={signal.Symbol} data={signal} />
                  ))
                )}
              </CardContent>
              {/* Signal Pagination */}
              {totalSignalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-zinc-800">
                  <button
                    onClick={() =>
                      handleSignalPageChange(currentSignalPage - 1)
                    }
                    disabled={currentSignalPage === 1}
                    className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: totalSignalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleSignalPageChange(page)}
                      className={`px-3 py-1 rounded transition-colors ${
                        currentSignalPage === page
                          ? "bg-zinc-700 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      handleSignalPageChange(currentSignalPage + 1)
                    }
                    disabled={currentSignalPage === totalSignalPages}
                    className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </Card>

            <AdaptiveLayout />
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {activeMarket === "CRYPTO" && <CryptoWidget />}
          {activeMarket === "FOREX" && <ForexWidget />}
          {activeMarket === "STOCK" && (
            <BandarDetector
              symbol={
                bandarData?.symbol || selectedBandarSymbol.replace(".JK", "")
              }
              availableSymbols={BANDAR_STOCK_SYMBOLS}
              selectedSymbol={selectedBandarSymbol}
              onSymbolChange={setSelectedBandarSymbol}
              status={
                bandarData?.status?.includes("DISTRIB")
                  ? "DISTRIBUTION"
                  : bandarData?.status?.includes("ACCUM")
                    ? "ACCUMULATION"
                    : "NEUTRAL"
              }
              strength={bandarData?.score ?? 0}
              rsi={bandarTechnicals.rsi}
              macd={bandarTechnicals.macd}
              signalScore={bandarSignalProb}
              changePercent={bandarTechnicals.changePercent}
              topBuyers={[
                { code: "YP", value: 42, avgPrice: 9145 },
                { code: "BK", value: 31, avgPrice: 9130 },
              ]}
              topSellers={[
                { code: "CC", value: 18, avgPrice: 9155 },
                { code: "PD", value: 12, avgPrice: 9160 },
              ]}
            />
          )}
          <GamificationHub />
        </div>
      </div>
    </div>
  );
}
