"use client";

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Clock, Lock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface FreeDashboardProps {
  signals: Array<{ Symbol: string; Action: string }>;
  counts: { BUY: number; SELL: number; HOLD: number };
  serverTime?: string;
  marketLabel: string;
  activeMarket: "STOCK" | "FOREX" | "CRYPTO";
}

export function FreeDashboard({
  signals,
  counts,
  serverTime,
  marketLabel,
  activeMarket,
}: FreeDashboardProps) {
  const latestSignals = signals.slice(0, 3);

  const symbol = useMemo(() => {
    if (activeMarket === "CRYPTO") return "BTC/USDT";
    if (activeMarket === "FOREX") return "EURUSD=X";
    return "BBCA.JK";
  }, [activeMarket]);

  const { data: chartData } = useQuery({
    queryKey: ["free-chart", symbol],
    queryFn: async () =>
      (
        await api.get(`/market/chart/${symbol}`, {
          params: { timeframe: "1d" },
        })
      ).data,
  });

  const chartSummary = useMemo(() => {
    const rows = chartData?.data || [];
    if (!rows.length) return undefined;
    const last = rows[rows.length - 1];
    const prev = rows.length > 1 ? rows[rows.length - 2] : last;
    const changePercent =
      prev?.close && prev.close !== 0
        ? ((last.close - prev.close) / prev.close) * 100
        : 0;
    return {
      price: Number(last?.close ?? 0),
      changePercent,
      points: rows.slice(-30).map((r: any) => Number(r?.close ?? 0)),
    };
  }, [chartData]);

  const sparkline = useMemo(() => {
    const points = chartSummary?.points || [];
    if (points.length < 2) return "";
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    return points
      .map((value: number, idx: number) => {
        const x = (idx / (points.length - 1)) * 100;
        const y = 40 - ((value - min) / range) * 36 - 2;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [chartSummary]);

  return (
    <div className="space-y-6">
      {/* 1. Header dengan Peringatan Data Delayed */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg flex items-center gap-3">
        <Clock className="w-5 h-5 text-yellow-500" />
        <div>
          <h4 className="font-bold text-yellow-500">Data Delayed (15 Menit)</h4>
          <p className="text-sm text-zinc-400">
            Anda menggunakan akun Free. Harga yang ditampilkan bukan real-time.
            <Link
              href="/settings"
              className="text-yellow-500 hover:underline ml-1"
            >
              Upgrade ke Premium
            </Link>{" "}
            untuk data live.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2. Chart Sederhana (Market Overview) */}
        <Card className="md:col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>{marketLabel} Overview (Delayed)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-zinc-950/50 rounded m-4 border border-dashed border-zinc-800">
            <div className="text-center space-y-3 w-full px-6">
              <TrendingUp className="w-10 h-10 text-zinc-600 mx-auto" />
              {sparkline ? (
                <svg viewBox="0 0 100 40" className="w-full h-16">
                  <polyline
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    points={sparkline}
                  />
                </svg>
              ) : (
                <div className="text-xs text-zinc-600">No chart data</div>
              )}
              <div className="text-xs text-zinc-500">
                {symbol} •{" "}
                <span className="text-zinc-200">
                  {chartSummary?.price?.toLocaleString() || "-"}
                </span>{" "}
                <span
                  className={
                    (chartSummary?.changePercent ?? 0) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {(chartSummary?.changePercent ?? 0) >= 0 ? "+" : ""}
                  {(chartSummary?.changePercent ?? 0).toFixed(2)}%
                </span>
              </div>
              <p className="text-zinc-500">
                BUY {counts.BUY} • SELL {counts.SELL} • HOLD {counts.HOLD}
              </p>
              {serverTime && (
                <p className="text-xs text-zinc-600">
                  Last update: {new Date(serverTime).toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 3. Locked Signals (Fitur yang diblur) */}
        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
            {/* Overlay Kunci */}
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-6 text-center">
              <div className="p-3 bg-zinc-800 rounded-full mb-3">
                <Lock className="w-6 h-6 text-zinc-400" />
              </div>
              <h4 className="font-bold text-white mb-1">AI Signals Locked</h4>
              <p className="text-xs text-zinc-400 mb-4">
                Lihat sinyal Buy/Sell otomatis dari AI PPO.
              </p>
              <Link href="/settings">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Unlock Premium
                </Button>
              </Link>
            </div>

            <CardHeader>
              <CardTitle>AI Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 blur-sm select-none">
              {latestSignals.length === 0 ? (
                <div className="text-sm text-zinc-500">
                  Tidak ada sinyal aktif.
                </div>
              ) : (
                latestSignals.map((signal) => (
                  <div
                    key={signal.Symbol}
                    className="flex justify-between items-center"
                  >
                    <span>{signal.Symbol}</span>
                    <Badge
                      className={
                        signal.Action === "SELL" ? "bg-red-600" : "bg-green-600"
                      }
                    >
                      {signal.Action}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 mb-4">
                Anda memantau 3 saham.
              </p>
              <Button variant="outline" className="w-full border-zinc-700">
                Manage Watchlist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
