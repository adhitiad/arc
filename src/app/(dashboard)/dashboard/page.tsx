"use client";

import { AdaptiveLayout } from "@/components/AdaptiveLayout";
import { AnomalyWidget } from "@/components/AnomalyWidget";
import { CommandCenter } from "@/components/CommandCenter";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { GamificationHub } from "@/components/GamificationHub";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi Loading Data
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="relative space-y-8 pb-10">
      {/* 1. Invisible Interface: Command Center */}
      <CommandCenter />

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Trading Terminal
          </h1>
          <p className="text-zinc-400 text-sm">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>{" "}
            to execute orders instantly.
          </p>
        </div>
      </div>

      {/* 2. Anomaly Alert (High Priority) */}
      <AnomalyWidget
        data={{
          type: "ACCUMULATION_DETECTED",
          message:
            "Price Action divergence on GOTO. Sentiment Negative but Price Holding Support.",
          severity: "MEDIUM",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Adaptive Workspace (Main Area - 2/3 width) */}
        <div className="lg:col-span-2">
          <AdaptiveLayout />
        </div>

        {/* 4. Gamification & Social (Sidebar - 1/3 width) */}
        <div className="space-y-6">
          <GamificationHub />
          {/* Widget lain seperti RiskCalculator bisa ditaruh di sini */}
        </div>
      </div>
    </div>
  );
}
