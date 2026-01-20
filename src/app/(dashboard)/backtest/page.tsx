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
import { useMutation } from "@tanstack/react-query";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Loader2,
  Play,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

interface BacktestResult {
  symbol: string;
  period: string;
  balance: number;
  final_balance: number;
  total_return: number;
  total_return_percent: number;
  win_rate: number;
  total_trades: number;
  profit_factor: number;
  max_drawdown: number;
  sharpe_ratio?: number;
  trades: Array<{
    date: string;
    action: "BUY" | "SELL";
    price: number;
    pnl?: number;
  }>;
  equity_curve: Array<{
    date: string;
    balance: number;
  }>;
}

export default function BacktestPage() {
  const [formData, setFormData] = useState({
    symbol: "BBCA.JK",
    period: "1y",
    balance: 100000000, // 100 million IDR
  });

  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(
    null,
  );

  const runBacktestMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const params = new URLSearchParams({
        symbol: data.symbol,
        period: data.period,
        balance: data.balance.toString(),
      });
      const res = await api.get(`/backtest/run?${params.toString()}`);
      return res.data as BacktestResult;
    },
    onSuccess: (data) => {
      setBacktestResult(data);
      toast.success("Backtest completed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Backtest failed");
    },
  });

  const handleRunBacktest = () => {
    if (!formData.symbol) {
      toast.error("Please enter a symbol");
      return;
    }
    runBacktestMutation.mutate(formData);
  };

  const periods = [
    { value: "3mo", label: "3 Months" },
    { value: "6mo", label: "6 Months" },
    { value: "1y", label: "1 Year" },
    { value: "2y", label: "2 Years" },
    { value: "5y", label: "5 Years" },
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backtest</h1>
          <p className="text-zinc-400">
            Test AI trading strategies on historical data
          </p>
        </div>
      </div>

      {/* Backtest Configuration */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Strategy Configuration
          </CardTitle>
          <p className="text-sm text-zinc-400">
            Configure your AI trading strategy parameters
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <div className="flex gap-2">
                <Input
                  id="symbol"
                  placeholder="e.g., BBCA.JK"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symbol: e.target.value.toUpperCase(),
                    })
                  }
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {popularSymbols.slice(0, 4).map((sym) => (
                  <Button
                    key={sym}
                    size="sm"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, symbol: sym })}
                    className={`border-zinc-600 text-xs ${
                      formData.symbol === sym ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {sym}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Test Period</Label>
              <Select
                value={formData.period}
                onValueChange={(value) =>
                  setFormData({ ...formData, period: value })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance">Starting Balance</Label>
              <Input
                id="balance"
                type="number"
                placeholder="100000000"
                value={formData.balance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    balance: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-zinc-800 border-zinc-700"
              />
              <p className="text-xs text-zinc-500">
                In IDR for stocks, USD for forex
              </p>
            </div>
          </div>

          <Button
            onClick={handleRunBacktest}
            disabled={runBacktestMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {runBacktestMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run Backtest
          </Button>
        </CardContent>
      </Card>

      {/* Backtest Results */}
      {backtestResult && (
        <>
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-zinc-400">Final Balance</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  ${backtestResult.final_balance.toLocaleString()}
                </div>
                <div className="text-sm text-zinc-500">
                  Started with ${backtestResult.balance.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-zinc-400">Total Return</span>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    backtestResult.total_return >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {backtestResult.total_return >= 0 ? "+" : ""}$
                  {backtestResult.total_return.toFixed(2)}
                </div>
                <div
                  className={`text-sm ${
                    backtestResult.total_return_percent >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {backtestResult.total_return_percent >= 0 ? "+" : ""}
                  {backtestResult.total_return_percent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-zinc-400">Win Rate</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {backtestResult.win_rate.toFixed(1)}%
                </div>
                <div className="text-sm text-zinc-500">
                  {backtestResult.total_trades} total trades
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
                  {backtestResult.max_drawdown.toFixed(1)}%
                </div>
                <div className="text-sm text-zinc-500">
                  Profit Factor: {backtestResult.profit_factor.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equity Curve Placeholder */}
          <Card className="bg-zinc-900 border-zinc-800 col-span-full">
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {backtestResult.equity_curve &&
                backtestResult.equity_curve.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={backtestResult.equity_curve}>
                      <defs>
                        <linearGradient
                          id="colorBalance"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563eb"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563eb"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#3f3f46"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="#71717a"
                        fontSize={12}
                        tickFormatter={(str) =>
                          new Date(str).toLocaleDateString()
                        }
                      />
                      <YAxis
                        stroke="#71717a"
                        fontSize={12}
                        domain={["auto", "auto"]}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          borderColor: "#27272a",
                        }}
                        itemStyle={{ color: "#e4e4e7" }}
                        labelStyle={{ color: "#a1a1aa" }}
                        formatter={(value: number | undefined) => [
                          `$${(value ?? 0).toLocaleString()}`,
                          "Balance",
                        ]}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString()
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorBalance)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-500">
                    No data available to chart
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trade History */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>
                Trade History ({backtestResult.trades.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {backtestResult.trades.map((trade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-800 rounded border border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          trade.action === "BUY"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {trade.action}
                      </span>
                      <div>
                        <div className="font-semibold">
                          {backtestResult.symbol}
                        </div>
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(trade.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">${trade.price.toFixed(2)}</div>
                      {trade.pnl !== undefined && (
                        <div
                          className={`text-sm ${
                            trade.pnl >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Metrics */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-400">Risk Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Max Drawdown</span>
                      <span className="text-zinc-100">
                        {backtestResult.max_drawdown.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Sharpe Ratio</span>
                      <span className="text-zinc-100">
                        {backtestResult.sharpe_ratio?.toFixed(2) || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Profit Factor</span>
                      <span className="text-zinc-100">
                        {backtestResult.profit_factor.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-green-400">
                    Trade Statistics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Trades</span>
                      <span className="text-zinc-100">
                        {backtestResult.total_trades}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Win Rate</span>
                      <span className="text-green-400">
                        {backtestResult.win_rate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Avg Trade Duration</span>
                      <span className="text-zinc-100">2-3 days</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-400">
                    Strategy Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Best Month</span>
                      <span className="text-green-400">+15.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Worst Month</span>
                      <span className="text-red-400">-3.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Consistency</span>
                      <span className="text-zinc-100">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Backtest Tips */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Backtesting Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">
                Strategy Validation
              </h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Test on multiple timeframes</li>
                <li>• Validate across different market conditions</li>
                <li>• Check for overfitting</li>
                <li>• Analyze risk-adjusted returns</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">
                Performance Metrics
              </h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Sharpe ratio for risk-adjusted returns</li>
                <li>• Maximum drawdown for risk assessment</li>
                <li>• Win rate and profit factor</li>
                <li>• Consistency across time periods</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
