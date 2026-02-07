"use client";

import { InsiderNetwork } from "@/components/InsiderNetwork";
import SignalCard from "@/components/dashboard/SignalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database, GitPullRequest, Server } from "lucide-react";
import Link from "next/link";

/** Sinkron dengan ai-hub: signals dari GET /dashboard/all, open_trades dari signals_collection */
export interface EnterpriseSignal {
  Symbol: string;
  Category?: string;
  Action: "BUY" | "SELL" | "HOLD";
  Price: number;
  Tp?: number;
  Sl?: number;
  LotSize?: string;
  Prob?: string;
  Whale_Activity?: string;
  Bandar_Info?: {
    Status: string;
    Score: string;
    Message?: string;
    relations?: { entity: string; related_company: string; role: string }[];
  };
  AI_Analyst?: {
    Verdict: string;
    Projected_Profit: string;
    Projected_Loss: string;
    Note: string;
    Risk_Level: string;
  };
  Reason?: string;
}

/** ai-hub signals_collection: symbol, action, entry_price, tp, sl, lot_size, status, created_at */
export interface EnterpriseOpenTrade {
  symbol?: string;
  action?: string;
  entry_price?: number;
  tp?: number;
  sl?: number;
  lot_size?: string;
  status?: string;
  created_at?: string;
}

interface EnterpriseDashboardProps {
  signals: EnterpriseSignal[];
  counts: { BUY: number; SELL: number; HOLD: number };
  openTrades: EnterpriseOpenTrade[];
  serverTime?: string;
  marketLabel: string;
}

function downloadCsv(
  signals: EnterpriseSignal[],
  openTrades: EnterpriseOpenTrade[]
) {
  const headers = [
    "Type",
    "Symbol",
    "Action",
    "Price",
    "TP",
    "SL",
    "LotSize",
    "Prob",
    "Status",
  ];
  const rows: string[][] = [headers];

  signals.forEach((s) => {
    rows.push([
      "SIGNAL",
      s.Symbol,
      s.Action,
      String(s.Price ?? ""),
      String(s.Tp ?? ""),
      String(s.Sl ?? ""),
      s.LotSize ?? "",
      s.Prob ?? "",
      "",
    ]);
  });

  openTrades.forEach((t) => {
    rows.push([
      "OPEN_TRADE",
      t.symbol ?? "",
      t.action ?? "",
      String(t.entry_price ?? ""),
      String(t.tp ?? ""),
      String(t.sl ?? ""),
      t.lot_size ?? "",
      "",
      t.status ?? "OPEN",
    ]);
  });

  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `enterprise-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function EnterpriseDashboard({
  signals,
  counts,
  openTrades,
  serverTime,
  marketLabel,
}: EnterpriseDashboardProps) {
  const topSignals = signals.slice(0, 4);

  const DEFAULT_INSIDER_RELATIONS = [
    { entity: "Patrick Walujo", related_company: "ARTO (Bank Jago)", role: "Commissioner" },
    { entity: "Garibaldi Thohir", related_company: "ADRO (Adaro Energy)", role: "Director" },
  ];

  const firstSignal = signals[0];
  const insiderSymbol = firstSignal?.Symbol
  const insiderRelations =
    firstSignal?.Bandar_Info?.relations ?? DEFAULT_INSIDER_RELATIONS;

  return (
    <div className="space-y-6">
      {/* 1. Institutional Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Institutional Terminal
          </h1>
          <p className="text-zinc-400">
            {marketLabel} • Updated{" "}
            {serverTime ? new Date(serverTime).toLocaleString() : "recently"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-purple-500/50 text-purple-400"
            onClick={() => downloadCsv(signals, openTrades)}
          >
            <Database className="w-4 h-4 mr-2" /> Export Data (CSV)
          </Button>
          <Link href="/settings">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Server className="w-4 h-4 mr-2" /> Manage API Keys
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards (sinkron dengan ai-hub dashboard/all counts) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-purple-900/10 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">
              Active Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {signals.length}
            </div>
            <div className="text-xs text-zinc-400">
              BUY {counts.BUY} • SELL {counts.SELL}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">
              Open Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {openTrades.length}
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Running Smoothly
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">
              Signal Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {counts.HOLD} Hold
            </div>
            <div className="text-xs text-zinc-400">Across tracked assets</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">
              Signal Momentum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {counts.BUY - counts.SELL > 0 ? "+" : ""}
              {counts.BUY - counts.SELL}
            </div>
            <div className="text-xs text-zinc-400">Net BUY vs SELL</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Insider Network + Live Signals (sinkron tampilan premium) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-purple-500" /> Insider
                Network Map (Live)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-zinc-950 rounded flex items-center justify-center border border-zinc-800">
                <InsiderNetwork
                  symbol={insiderSymbol}
                  relations={insiderRelations}
                />
              </div>
            </CardContent>
          </Card>

          {/* Live Signals - gunakan SignalCard (sinkron dengan premium) */}
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
                topSignals.map((signal) => (
                  <SignalCard
                    key={signal.Symbol}
                    data={{
                      ...signal,
                      Category: signal.Category ?? "STOCK",
                      Tp: signal.Tp ?? 0,
                      Sl: signal.Sl ?? 0,
                    }}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* 4. Open Trades (sinkron ai-hub signals_collection: symbol, action, entry_price, tp, sl, lot_size) */}
        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm">
                Open Trades (Snapshot)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {openTrades.length === 0 ? (
                <div className="text-xs text-zinc-500">
                  No open trades currently.
                </div>
              ) : (
                openTrades.slice(0, 6).map((trade, idx) => (
                  <div
                    key={trade.symbol || idx}
                    className="p-3 bg-zinc-800 rounded border border-zinc-700 space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold">
                        {trade.symbol || "N/A"}
                      </span>
                      <span
                        className={`text-sm font-bold ${trade.action?.toUpperCase().includes("SELL")
                            ? "text-red-500"
                            : "text-green-500"
                          }`}
                      >
                        {trade.action || "OPEN"}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 grid grid-cols-2 gap-1">
                      <span>Entry: {trade.entry_price ?? "-"}</span>
                      <span>TP: {trade.tp ?? "-"}</span>
                      <span>SL: {trade.sl ?? "-"}</span>
                      <span>Size: {trade.lot_size ?? "-"}</span>
                    </div>
                    {trade.created_at && (
                      <div className="text-[10px] text-zinc-500">
                        {new Date(trade.created_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
