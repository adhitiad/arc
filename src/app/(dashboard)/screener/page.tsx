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
import { Filter, Loader2, Search, TrendingUp } from "lucide-react";
import { useState } from "react";

interface ScreenerResult {
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

export default function ScreenerPage() {
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
        if (
          value !== 0 &&
          value !== false &&
          value !== "" &&
          value !== undefined
        ) {
          params.append(key, value.toString());
        }
      });
      const res = await api.get(`/screener/run?${params.toString()}`);
      return res.data as ScreenerResult[];
    },
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const results = Array.isArray(screenerResults) ? screenerResults : [];

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
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Screener Results ({results.length})
          </CardTitle>
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
              {results.map((asset) => (
                <div
                  key={asset.symbol}
                  className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {asset.symbol}
                        </h3>
                        <span className="px-2 py-1 bg-zinc-700 rounded text-xs">
                          Score: {asset.signal_score}
                        </span>
                        {asset.bandar_status && (
                          <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                            {asset.bandar_status}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-zinc-500">Price: </span>
                          <span className="font-mono font-semibold">
                            {asset.price.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Change: </span>
                          <span
                            className={`font-semibold ${
                              asset.change_percent >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {asset.change_percent >= 0 ? "+" : ""}
                            {asset.change_percent.toFixed(2)}%
                          </span>
                        </div>
                        {asset.rsi && (
                          <div>
                            <span className="text-zinc-500">RSI: </span>
                            <span className="font-semibold">
                              {asset.rsi.toFixed(1)}
                            </span>
                          </div>
                        )}
                        {asset.volume && (
                          <div>
                            <span className="text-zinc-500">Volume: </span>
                            <span className="font-semibold">
                              {(asset.volume / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        )}
                      </div>

                      {asset.ai_recommendation && (
                        <div className="bg-blue-900/20 border border-blue-700 p-2 rounded text-sm">
                          <span className="text-blue-400 font-semibold">
                            AI:{" "}
                          </span>
                          {asset.ai_recommendation}
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                      >
                        View Chart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                      >
                        Add to Watchlist
                      </Button>
                    </div>
                  </div>
                </div>
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
