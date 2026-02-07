"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingDown, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

interface BrokerData {
  code: string;
  value: number; // Dalam Milyar/Juta
  avgPrice: number;
}

export type BandarIndicatorType =
  | "strength"
  | "rsi"
  | "macd"
  | "signal_score"
  | "volume"
  | "change_percent";

interface BandarProps {
  symbol: string;
  status: "ACCUMULATION" | "DISTRIBUTION" | "NEUTRAL";
  strength: number; // 0-100
  rsi?: number;
  macd?: number;
  signalScore?: number;
  volume?: number;
  changePercent?: number;
  topBuyers: BrokerData[];
  topSellers: BrokerData[];
  /** Pilih simbol saham untuk Bandarmology Flow */
  availableSymbols?: { value: string; label: string }[];
  selectedSymbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

const INDICATOR_OPTIONS: {
  key: BandarIndicatorType;
  label: string;
}[] = [
  { key: "strength", label: "Strength (Bandar)" },
  { key: "rsi", label: "RSI" },
  { key: "macd", label: "MACD" },
  { key: "signal_score", label: "Signal Score" },
  { key: "volume", label: "Volume" },
  { key: "change_percent", label: "Change %" },
];

export const BandarDetector: React.FC<BandarProps> = ({
  symbol,
  status,
  strength,
  rsi,
  macd,
  signalScore,
  volume,
  changePercent,
  topBuyers,
  topSellers,
  availableSymbols,
  selectedSymbol,
  onSymbolChange,
}) => {
  const [selectedIndicator, setSelectedIndicator] =
    useState<BandarIndicatorType>("strength");

  const isAccum = status === "ACCUMULATION";
  const statusColor = isAccum
    ? "text-green-400"
    : status === "DISTRIBUTION"
      ? "text-red-400"
      : "text-zinc-400";

  const getIndicatorValue = (): { value: number; label: string } => {
    switch (selectedIndicator) {
      case "strength":
        return { value: strength, label: "Strength" };
      case "rsi":
        return {
          value: rsi ?? 0,
          label: "RSI",
        };
      case "macd":
        return {
          value: macd ?? 0,
          label: "MACD",
        };
      case "signal_score":
        return {
          value: signalScore ?? 0,
          label: "Signal Score",
        };
      case "volume":
        return {
          value: volume ?? 0,
          label: "Volume",
        };
      case "change_percent":
        return {
          value: changePercent ?? 0,
          label: "Change %",
        };
    }
  };

  const { value: indicatorValue, label: indicatorLabel } = getIndicatorValue();
  const progressValue = Math.min(100, Math.max(0, indicatorValue));

  const showSymbolSelect =
    availableSymbols &&
    availableSymbols.length > 0 &&
    selectedSymbol != null &&
    onSymbolChange;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <span>Bandarmology Flow ({symbol})</span>
            <Users className="w-4 h-4" />
          </CardTitle>
          {showSymbolSelect && (
            <Select
              value={selectedSymbol}
              onValueChange={onSymbolChange}
            >
              <SelectTrigger className="h-8 w-[130px] text-xs bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Pilih saham" />
              </SelectTrigger>
              <SelectContent>
                {availableSymbols.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Status Utama */}
        <div className="mb-4">
          <div
            className={`text-2xl font-bold ${statusColor} flex items-center gap-2`}
          >
            {status}
            {isAccum ? (
              <TrendingUp className="w-6 h-6" />
            ) : status === "DISTRIBUTION" ? (
              <TrendingDown className="w-6 h-6" />
            ) : null}
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Select
              value={selectedIndicator}
              onValueChange={(v) => setSelectedIndicator(v as BandarIndicatorType)}
            >
              <SelectTrigger className="h-8 text-xs bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Pilih indikator" />
              </SelectTrigger>
              <SelectContent>
                {INDICATOR_OPTIONS.map((opt) => (
                  <SelectItem key={opt.key} value={opt.key}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Progress
                value={progressValue}
                className={`h-2 ${isAccum ? "bg-green-900" : "bg-red-900"}`}
              />
              <span className="text-xs text-zinc-500">
                {indicatorValue.toFixed(1)}{" "}
                {selectedIndicator === "change_percent" ? "%" : ""}{" "}
                {indicatorLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Broker Summary Table */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-green-500 font-semibold mb-2 border-b border-zinc-800 pb-1">
              Top Buyers
            </div>
            {topBuyers.map((broker) => (
              <div key={broker.code} className="flex justify-between py-1">
                <span className="font-mono bg-zinc-800 px-1 rounded">
                  {broker.code}
                </span>
                <span>{broker.value}B</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-red-500 font-semibold mb-2 border-b border-zinc-800 pb-1">
              Top Sellers
            </div>
            {topSellers.map((broker) => (
              <div key={broker.code} className="flex justify-between py-1">
                <span className="font-mono bg-zinc-800 px-1 rounded">
                  {broker.code}
                </span>
                <span>{broker.value}B</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
