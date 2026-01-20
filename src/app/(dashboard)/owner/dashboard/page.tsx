"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  DollarSign,
  HardDrive,
  Server,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function OwnerDashboard() {
  const { data: financials } = useQuery({
    queryKey: ["owner-financials"],
    queryFn: async () => (await api.get("/owner/financial-health")).data,
  });

  if (!financials) return <Skeleton className="h-62.5 w-full" />;

  // Data untuk grafik
  const chartData = [
    {
      name: "Financials",
      Revenue: financials.gross_revenue,
      Costs: financials.costs.total,
      Profit: financials.net_profit,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Owner Super Dashboard
          </h1>
          <p className="text-zinc-400">
            Real-time profit tracking & cost analysis
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg font-bold text-xl ${financials.net_profit > 0 ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}
        >
          Net Profit: ${financials.net_profit}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Gross Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${financials.gross_revenue}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Costs
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ${financials.costs.total}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Profit Margin
            </CardTitle>
            <Activity className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {financials.profit_margin}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              AI Cost
            </CardTitle>
            <Zap className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              ${financials.costs.breakdown.ai_groq_api}
            </div>
            <p className="text-xs text-zinc-500">Groq/LLM Usage</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Operational Costs Breakdown</CardTitle>
            <CardDescription>
              Biaya spesifik infrastruktur bulanan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Server className="w-4 h-4" /> Cloud Compute (AWS/VPS)
                </span>
                <span>${financials.costs.breakdown.cloud_compute}</span>
              </div>
              <Progress
                value={
                  (financials.costs.breakdown.cloud_compute /
                    financials.costs.total) *
                  100
                }
                className="bg-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" /> Database (Mongo)
                </span>
                <span>${financials.costs.breakdown.database_mongo}</span>
              </div>
              <Progress
                value={
                  (financials.costs.breakdown.database_mongo /
                    financials.costs.total) *
                  100
                }
                className="bg-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Redis Cache
                </span>
                <span>${financials.costs.breakdown.redis_cache}</span>
              </div>
              <Progress
                value={
                  (financials.costs.breakdown.redis_cache /
                    financials.costs.total) *
                  100
                }
                className="bg-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" /> AI Inference (Groq)
                </span>
                <span>${financials.costs.breakdown.ai_groq_api}</span>
              </div>
              <Progress
                value={
                  (financials.costs.breakdown.ai_groq_api /
                    financials.costs.total) *
                  100
                }
                className="bg-zinc-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* Profitability Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Profit vs Loss Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-62.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#3f3f46"
                    vertical={false}
                  />
                  <XAxis dataKey="name" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#27272a",
                    }}
                    cursor={{ fill: "#27272a" }}
                  />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Costs" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Profit" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
