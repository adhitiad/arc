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
import { AlertCircle, Gauge, RefreshCw, Wallet } from "lucide-react";
import { useState } from "react";

export function CryptoWidget() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USDC");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["crypto-data", selectedSymbol],
    queryFn: async () =>
      (
        await api.get("/market/crypto/summary", {
          params: { symbol: selectedSymbol, include: "fear_greed,net_flow" },
        })
      ).data,
  });

  const { data: cryptoSymbols } = useQuery({
    queryKey: ["crypto-symbols"],
    queryFn: async () => (await api.get("/market/crypto/summary")).data,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24 bg-zinc-800" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1 bg-zinc-800" />
              <Skeleton className="h-3 w-32 bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="bg-red-900/10 border-red-900 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-red-400 mb-3">Gagal memuat data Crypto</p>
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-zinc-300">Crypto Summary</h3>
        <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Pilih Crypto" />
          </SelectTrigger>
          <SelectContent>
            {cryptoSymbols?.map((symbol: { value: string; label: string }) => (
              <SelectItem key={symbol.value} value={symbol.value}>
                {symbol.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400 flex gap-2">
              <Gauge className="w-4 h-4" /> Fear & Greed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                data.fear_greed > 50 ? "text-green-500" : "text-red-500"
              }`}
            >
              {data.fear_greed}
            </div>
            <div className="text-xs text-zinc-500">Market Sentiment</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400 flex gap-2">
              <Wallet className="w-4 h-4" /> NetFlow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{data.net_flow}</div>
            <div className="text-xs text-zinc-500">Exchange Flow</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
