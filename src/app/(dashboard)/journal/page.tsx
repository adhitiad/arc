"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BookOpen,
  Calendar,
  DollarSign,
  Filter,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface TradeEntry {
  id?: string;
  symbol: string;
  action: "BUY" | "SELL";
  entry_price: number;
  exit_price?: number;
  quantity: number;
  entry_date: string;
  exit_date?: string;
  pnl?: number;
  pnl_percent?: number;
  status: "OPEN" | "CLOSED" | "WIN" | "LOSS";
  notes?: string;
  strategy?: string;
}

interface TradingStats {
  total_trades: number;
  win_rate: number;
  total_pnl: number;
  total_pnl_percent: number;
  avg_win: number;
  avg_loss: number;
  profit_factor: number;
  max_drawdown: number;
  best_trade: number;
  worst_trade: number;
}

export default function JournalPage() {
  const [limit, setLimit] = useState(50);
  const [filter, setFilter] = useState("all");

  const { data: trades, isLoading } = useQuery({
    queryKey: ["trades", limit],
    queryFn: async () => {
      const res = await api.get(`/journal/history?limit=${limit}`);
      return res.data as TradeEntry[];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await api.get("/journal/stats");
      return res.data as TradingStats;
    },
  });

  const filteredTrades =
    trades?.filter((trade) => {
      if (filter === "all") return true;
      if (filter === "open") return trade.status === "OPEN";
      if (filter === "closed") return trade.status === "CLOSED";
      if (filter === "wins") return trade.status === "WIN";
      if (filter === "losses") return trade.status === "LOSS";
      return true;
    }) || [];

  const totalPnL = filteredTrades.reduce(
    (sum, trade) => sum + (trade.pnl || 0),
    0
  );
  const winCount = filteredTrades.filter(
    (trade) => trade.status === "WIN"
  ).length;
  const totalCount = filteredTrades.length;
  const winRate = totalCount > 0 ? (winCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Journal</h1>
          <p className="text-zinc-400">
            Track your trades and analyze performance
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <BookOpen className="w-4 h-4 mr-2" />
          Add Trade
        </Button>
      </div>

      {/* Trading Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm text-zinc-400">Win Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {stats.win_rate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-zinc-400">Total P&L</span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  stats.total_pnl >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ${stats.total_pnl.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-zinc-400">Total Trades</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {stats.total_trades}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <span className="text-sm text-zinc-400">Max Drawdown</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {stats.max_drawdown.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Summary */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Trade History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="filter">Filter Trades</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="open">Open Positions</SelectItem>
                  <SelectItem value="closed">Closed Positions</SelectItem>
                  <SelectItem value="wins">Winning Trades</SelectItem>
                  <SelectItem value="losses">Losing Trades</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="limit">Show Last</Label>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(parseInt(value))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Trades</SelectItem>
                  <SelectItem value="25">25 Trades</SelectItem>
                  <SelectItem value="50">50 Trades</SelectItem>
                  <SelectItem value="100">100 Trades</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-zinc-800 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-zinc-400">Filtered Trades</div>
              <div className="text-lg font-semibold text-zinc-100">
                {filteredTrades.length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-zinc-400">Win Rate</div>
              <div className="text-lg font-semibold text-green-400">
                {winRate.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-zinc-400">Total P&L</div>
              <div
                className={`text-lg font-semibold ${
                  totalPnL >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ${totalPnL.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-zinc-400">Avg Trade</div>
              <div
                className={`text-lg font-semibold ${
                  totalPnL >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                $
                {filteredTrades.length > 0
                  ? (totalPnL / filteredTrades.length).toFixed(2)
                  : "0.00"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trades List */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading trades...
            </div>
          ) : filteredTrades.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No trades found</p>
              <p className="text-sm">Start trading to build your journal</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrades.map((trade, index) => (
                <div
                  key={trade.id || index}
                  className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          trade.action === "BUY"
                            ? "bg-green-900/30"
                            : "bg-red-900/30"
                        }`}
                      >
                        {trade.action === "BUY" ? (
                          <ArrowUpCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowDownCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {trade.symbol}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              trade.status === "WIN"
                                ? "bg-green-900/30 text-green-400"
                                : trade.status === "LOSS"
                                ? "bg-red-900/30 text-red-400"
                                : trade.status === "OPEN"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-zinc-700 text-zinc-300"
                            }`}
                          >
                            {trade.status}
                          </span>
                        </div>
                        <div className="text-sm text-zinc-400 flex items-center gap-4">
                          <span>Entry: ${trade.entry_price}</span>
                          {trade.exit_price && (
                            <span>Exit: ${trade.exit_price}</span>
                          )}
                          <span>Qty: {trade.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {trade.pnl !== undefined && (
                        <div
                          className={`text-lg font-semibold ${
                            trade.pnl >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                        </div>
                      )}
                      {trade.pnl_percent !== undefined && (
                        <div
                          className={`text-sm ${
                            trade.pnl_percent >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {trade.pnl_percent >= 0 ? "+" : ""}
                          {trade.pnl_percent.toFixed(2)}%
                        </div>
                      )}
                      <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(trade.entry_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {trade.notes && (
                    <div className="mt-3 p-2 bg-zinc-700 rounded text-sm text-zinc-300">
                      <strong>Notes:</strong> {trade.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {stats && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Detailed Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-400">Profitability</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Profit Factor</span>
                    <span className="text-zinc-100">
                      {stats.profit_factor.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Avg Win</span>
                    <span className="text-green-400">
                      ${stats.avg_win.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Avg Loss</span>
                    <span className="text-red-400">
                      ${stats.avg_loss.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-purple-400">
                  Risk Management
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Max Drawdown</span>
                    <span className="text-red-400">
                      {stats.max_drawdown.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Best Trade</span>
                    <span className="text-green-400">
                      ${stats.best_trade.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Worst Trade</span>
                    <span className="text-red-400">
                      ${stats.worst_trade.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-yellow-400">
                  Trading Activity
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Trades</span>
                    <span className="text-zinc-100">{stats.total_trades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Win Rate</span>
                    <span className="text-green-400">
                      {stats.win_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total P&L %</span>
                    <span
                      className={
                        stats.total_pnl_percent >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {stats.total_pnl_percent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
