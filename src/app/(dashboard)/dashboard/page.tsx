"use client";

import SignalCard from "@/components/dashboard/SignalCard";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, TimerResetIcon } from "lucide-react";

export default function DashboardPage() {
  // Fetch Sinyal Real-time (Auto refresh tiap 3 detik)
  const {
    data: signals,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["activeSignals"],
    queryFn: async () => {
      const res = await api.get("/dashboard/all");
      return res.data; // Mengembalikan Dictionary: {"BBCA": {...}, "EURUSD": {...}}
    },
    refetchInterval: 3000,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="animate-spin mr-2" /> Connecting to AI Hub...
      </div>
    );
  }

  // Convert Dict ke Array untuk di-map
  const signalList = signals ? Object.values(signals) : [];

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Pulse</h1>
          <p className="text-zinc-400">
            Live signals from Hybrid AI Engine (PPO + Llama3)
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="border-zinc-800 text-zinc-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {signalList.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 rounded border border-dashed border-zinc-800">
          <p className="text-zinc-500">
            No active signals yet. AI is scanning...
            <TimerResetIcon className="inline-block w-4 h-4 ml-2 animate-spin" />
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {signalList.map((sig: any, index: number) => (
            // FIX: Gunakan fallback index jika Symbol undefined
            <SignalCard key={sig.Symbol || index} data={sig} />
          ))}
        </div>
      )}
    </div>
  );
}
