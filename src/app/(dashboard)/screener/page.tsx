"use client";

import { InsiderNetwork } from "@/components/InsiderNetwork";
import LiveStockCard, {
  type ScreenerIndicatorType,
} from "@/components/LiveStockCard";
import { RiskCalculator } from "@/components/RiskCalculator";
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
import { Filter, Loader2, Search, TrendingUp } from "lucide-react";
import { useState } from "react";

export interface ScreenerResult {
  symbol: string;
  name?: string;
  price: number;
  change_percent: number;
  volume?: number;
  rsi?: number;
  macd?: number;
  signal_score: number;
  bandar_status?: string;
  ai_recommendation?: string;
}

const INDICATOR_OPTIONS: { key: ScreenerIndicatorType; label: string }[] = [
  { key: "signal_score", label: "Signal Score" },
  { key: "rsi", label: "RSI" },
  { key: "macd", label: "MACD" },
  { key: "strength", label: "Strength" },
  { key: "volume", label: "Volume" },
  { key: "change_percent", label: "Change %" },
  { key: "bandar_status", label: "Bandar Status" },
];

export default function ScreenerPage() {
  const [displayedIndicator, setDisplayedIndicator] =
    useState<ScreenerIndicatorType>("signal_score");
  const [filters, setFilters] = useState({
    min_score: 0,
    rsi_max: 100,
    rsi_min: 0,
    signal_only: false,
    bandar_accum: false,
  });

  const {
    data: screenerResults,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["screener", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 0 && value !== false && value !== undefined) {
          params.append(key, value.toString());
        }
      });
      const res = await api.get(`/screener/run?${params.toString()}`);
      const payload = res.data;
      if (Array.isArray(payload)) return payload as ScreenerResult[];
      return (payload?.matches || []) as ScreenerResult[];
    },
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const results = (Array.isArray(screenerResults) ? screenerResults : []).map(
    (item: any) => {
      const symbol = item.symbol || item.Symbol || item.ticker || "UNKNOWN";
      const price = Number(item.price ?? item.Price ?? 0);
      const changeRaw = item.change_percent ?? item.ChangePercent ?? 0;
      const changePercent =
        typeof changeRaw === "string"
          ? parseFloat(changeRaw.replace("%", ""))
          : Number(changeRaw);
      const prob = item.signal_score ?? item.Prob ?? item.prob ?? 0;
      const parsedScore =
        typeof prob === "string"
          ? parseFloat(prob.replace("%", ""))
          : Number(prob);

      return {
        ...item,
        id: item.id || symbol,
        symbol,
        price,
        change_percent: changePercent,
        signal_score: Number.isFinite(parsedScore) ? parsedScore : 0,
        rsi: item.rsi != null ? Number(item.rsi) : undefined,
        macd: item.macd != null ? Number(item.macd) : undefined,
        volume: item.volume,
        bandar_status: item.bandar_status,
      } as ScreenerResult;
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Screener</h1>
          <p className="text-zinc-400">
            Filter assets by technical indicators and AI signals
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Search className="w-4 h-4 mr-2" />
          Run Screener
        </Button>
      </div>

      <div className="col-span-1 space-y-6">
        {/* Hitung Lot Otomatis */}
        <RiskCalculator />

        {/* Lihat Koneksi Bandar */}
        <InsiderNetwork
          symbol="GOTO"
          relations={[
            {
              entity: "Patrick Walujo",
              related_company: "ARTO (Bank Jago)",
              role: "Commissioner",
            },
            {
              entity: "Garibaldi Thohir",
              related_company: "ADRO (Adaro Energy)",
              role: "Director",
            },
          ]}
        />
      </div>
      {/* Filters */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Screening Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_score">Min Signal Score</Label>
              <Input
                id="min_score"
                type="number"
                min="0"
                max="100"
                value={filters.min_score}
                onChange={(e) =>
                  handleFilterChange("min_score", parseInt(e.target.value) || 0)
                }
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rsi_min">RSI Min</Label>
              <Input
                id="rsi_min"
                type="number"
                min="0"
                max="100"
                value={filters.rsi_min}
                onChange={(e) =>
                  handleFilterChange("rsi_min", parseInt(e.target.value) || 0)
                }
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rsi_max">RSI Max</Label>
              <Input
                id="rsi_max"
                type="number"
                min="0"
                max="100"
                value={filters.rsi_max}
                onChange={(e) =>
                  handleFilterChange("rsi_max", parseInt(e.target.value) || 100)
                }
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signal_only">Signal Only</Label>
              <Select
                value={filters.signal_only.toString()}
                onValueChange={(value) =>
                  handleFilterChange("signal_only", value === "true")
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">All Assets</SelectItem>
                  <SelectItem value="true">Signals Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bandar_accum">Bandar Accumulation</Label>
              <Select
                value={filters.bandar_accum.toString()}
                onValueChange={(value) =>
                  handleFilterChange("bandar_accum", value === "true")
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">All</SelectItem>
                  <SelectItem value="true">Accumulation Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Screener Results ({results.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="indicator-switch" className="text-xs text-zinc-400">
                Kolom Indikator:
              </Label>
              <Select
                value={displayedIndicator}
                onValueChange={(v) =>
                  setDisplayedIndicator(v as ScreenerIndicatorType)
                }
              >
                <SelectTrigger
                  id="indicator-switch"
                  className="h-9 w-[180px] bg-zinc-800 border-zinc-700"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDICATOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.key} value={opt.key}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Running screener...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No assets match your criteria</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((asset: any) => (
                <LiveStockCard
                  key={asset.id}
                  asset={asset}
                  displayedIndicator={displayedIndicator}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Screener Guide */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Screener Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-400">
                Technical Indicators
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">RSI (0-100)</span>
                  <span className="text-zinc-300">Relative Strength Index</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">MACD</span>
                  <span className="text-zinc-300">
                    Moving Average Convergence Divergence
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Signal Score</span>
                  <span className="text-zinc-300">
                    AI-generated rating (0-100)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-green-400">Bandar Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Accumulation</span>
                  <span className="text-zinc-300">
                    Smart money accumulation detected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Distribution</span>
                  <span className="text-zinc-300">
                    Smart money distribution detected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Neutral</span>
                  <span className="text-zinc-300">
                    No significant bandar activity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
