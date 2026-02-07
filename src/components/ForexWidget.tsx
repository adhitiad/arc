"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Globe, RefreshCw } from "lucide-react";
import { useState } from "react";

const FOREX_PAIRS = [
  { value: "EURUSD", label: "EUR/USD" },
  { value: "USDJPY", label: "USD/JPY" },
  { value: "GBPUSD", label: "GBP/USD" },
  { value: "USDCHF", label: "USD/CHF" },
  { value: "AUDUSD", label: "AUD/USD" },
  { value: "USDCAD", label: "USD/CAD" },
  { value: "NZDUSD", label: "NZD/USD" },
  { value: "EURJPY", label: "EUR/JPY" },
  { value: "GBPJPY", label: "GBP/JPY" },
  { value: "EURGBP", label: "EUR/GBP" },
  { value: "AUDJPY", label: "AUD/JPY" },
];

export function ForexWidget() {
  const [selectedPair, setSelectedPair] = useState("USDJPY");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["forex-strength", selectedPair],
    queryFn: async () =>
      (
        await api.get("/market/forex/summary", {
          params: { pair: selectedPair },
        })
      ).data,
  });

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm text-zinc-400 flex gap-2">
              <Globe className="w-4 h-4" /> Currency Strength
            </CardTitle>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="h-8 w-[120px] bg-zinc-800 border-zinc-700 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOREX_PAIRS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-8 bg-zinc-800" />
              <Skeleton className="h-2 flex-1 bg-zinc-800" />
              <Skeleton className="h-3 w-6 bg-zinc-800" />
            </div>
          ))}
          <Skeleton className="h-6 w-full bg-zinc-800" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-red-900/10 border-red-900 border-dashed">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm text-zinc-400 flex gap-2">
              <Globe className="w-4 h-4" /> Currency Strength
            </CardTitle>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="h-8 w-[120px] bg-zinc-800 border-zinc-700 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOREX_PAIRS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-red-400 mb-3">
            Gagal memuat data Forex
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-red-800 text-red-400 hover:bg-red-900/20"
          >
            <RefreshCw className="w-3 h-3 mr-2" /> Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  const base = data.base_currency as string;
  const quote = data.quote_currency as string;
  const baseStrength = Number(data.strength?.[base] ?? 0);
  const quoteStrength = Number(data.strength?.[quote] ?? 0);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm text-zinc-400 flex gap-2">
            <Globe className="w-4 h-4" /> Currency Strength
          </CardTitle>
          <Select value={selectedPair} onValueChange={setSelectedPair}>
            <SelectTrigger className="h-8 w-[120px] bg-zinc-800 border-zinc-700 text-xs">
              <SelectValue placeholder="Pilih pair" />
            </SelectTrigger>
            <SelectContent>
              {FOREX_PAIRS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Visualisasi Bar Kekuatan Mata Uang */}
          <div className="flex items-center gap-2">
            <span className="w-8 font-bold">{base}</span>
            <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${baseStrength}%` }}
              />
            </div>
            <span className="text-xs text-green-400">{baseStrength}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 font-bold">{quote}</span>
            <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${quoteStrength}%` }}
              />
            </div>
            <span className="text-xs text-red-400">{quoteStrength}</span>
          </div>
        </div>
        <div className="mt-4 p-2 bg-blue-900/20 text-blue-300 text-xs rounded text-center">
          Signal:{" "}
          <strong>
            {data.signal} {data.pair}
          </strong>
          {data.session ? ` (${data.session})` : ""}
        </div>
      </CardContent>
    </Card>
  );
}
