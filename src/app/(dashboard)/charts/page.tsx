"use client";

import { ReplayControls } from "@/components/ReplayControls";
import { StockChart } from "@/components/StockChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// Mock Data (Nanti diganti API backend)
const generateDummyData = () => {
  let date = new Date("2023-01-01");
  let price = 1000;
  const data = [];
  for (let i = 0; i < 100; i++) {
    const open = price;
    const close = price + (Math.random() - 0.5) * 50;
    const high = Math.max(open, close) + Math.random() * 20;
    const low = Math.min(open, close) - Math.random() * 20;

    data.push({
      time: date.toISOString().split("T")[0],
      open,
      high,
      low,
      close,
    });

    date.setDate(date.getDate() + 1);
    price = close;
  }
  return data;
};

export default function ChartsPage() {
  const [symbol, setSymbol] = useState("BBCA.JK");
  const [chartData, setChartData] = useState(generateDummyData());
  const [isReplayMode, setIsReplayMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Technical Analysis
        </h1>
      </div>

      <div className="flex gap-4">
        <Input
          className="max-w-xs bg-zinc-900 border-zinc-800"
          placeholder="Symbol (e.g. BBCA.JK)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <Button onClick={() => setChartData(generateDummyData())}>
          <Search className="w-4 h-4 mr-2" /> Load
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <CardHeader className="border-b border-zinc-800 pb-3">
          <CardTitle>{symbol} - Daily Chart</CardTitle>
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
          <StockChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
