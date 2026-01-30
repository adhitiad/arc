"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Zap } from "lucide-react";
import { useState } from "react";

// Asumsi widget ini sudah ada atau placeholder
const ChartWidget = ({ type }: { type: string }) => (
    <div className="h-64 bg-zinc-950/50 rounded border border-zinc-800 flex items-center justify-center text-zinc-500">
        {type} Chart Module
    </div>
);

const OrderEntryWidget = ({ simplified }: { simplified: boolean }) => (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">
        <h4 className="font-bold mb-2 text-green-400">⚡ Instant Execution</h4>
        <div className="flex gap-2">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">BUY</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700">SELL</Button>
        </div>
        {!simplified && <div className="mt-2 text-xs text-zinc-500">Advanced limit order settings...</div>}
    </div>
);

const FinancialWidget = () => (
    <div className="h-64 bg-zinc-900 border border-zinc-800 rounded p-4">
        <h4 className="font-bold text-blue-400 mb-2">📊 Financial Report (AI Summary)</h4>
        <p className="text-sm text-zinc-400">BBCA Q3 Revenue grew 15% YoY...</p>
    </div>
);

export function AdaptiveLayout() {
  // Nanti state ini bisa diubah otomatis oleh AI Backend berdasarkan history trading user
  const [persona, setPersona] = useState<"SCALPER" | "INVESTOR" | "SWING">("SWING");

  return (
    <div className="space-y-6">
      {/* AI Persona Selector (Bisa disembunyikan jika fully automatic) */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Zap className="w-4 h-4 text-purple-500" />
            <span>AI Detected Persona: <strong>{persona}</strong></span>
         </div>
         <Tabs value={persona} onValueChange={(v: any) => setPersona(v)}>
            <TabsList className="bg-zinc-900">
                <TabsTrigger value="SCALPER">Scalper (Speed)</TabsTrigger>
                <TabsTrigger value="SWING">Swing (Balanced)</TabsTrigger>
                <TabsTrigger value="INVESTOR">Investor (Deep)</TabsTrigger>
            </TabsList>
         </Tabs>
      </div>

      {/* --- LAYOUT 1: SCALPER (Focus: Speed, 1-Min Chart, Big Buttons) --- */}
      {persona === "SCALPER" && (
        <div className="grid grid-cols-12 gap-4 animate-in fade-in duration-500">
            <div className="col-span-8 space-y-4">
                <ChartWidget type="1-Minute Tick" />
                <div className="grid grid-cols-2 gap-4">
                     <ChartWidget type="Orderflow / Tape" />
                     <ChartWidget type="RSI Divergence" />
                </div>
            </div>
            <div className="col-span-4 space-y-4">
                <OrderEntryWidget simplified={true} />
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader><CardTitle className="text-sm">Scalp Signals</CardTitle></CardHeader>
                    <CardContent className="text-xs text-zinc-400 space-y-2">
                        <div className="flex justify-between text-green-400"><span>GOTO</span> <span>STRONG BUY (1m)</span></div>
                        <div className="flex justify-between text-red-400"><span>BUKA</span> <span>SELL (1m)</span></div>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

      {/* --- LAYOUT 2: INVESTOR (Focus: Fundamentals, Weekly Chart, No Noise) --- */}
      {persona === "INVESTOR" && (
        <div className="grid grid-cols-12 gap-4 animate-in fade-in duration-500">
            <div className="col-span-8 space-y-4">
                <ChartWidget type="Weekly Candle" />
                <FinancialWidget />
            </div>
            <div className="col-span-4 space-y-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader><CardTitle className="text-sm">Portfolio Health</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">+12.5%</div>
                        <p className="text-xs text-zinc-500">YTD Return (Low Risk)</p>
                    </CardContent>
                </Card>
                <div className="p-4 bg-blue-900/10 border border-blue-900/50 rounded text-sm text-blue-200">
                    <BookOpen className="w-4 h-4 mb-2 inline mr-2"/>
                    AI Suggestion: Rebalance your portfolio. Technology sector is overweight.
                </div>
            </div>
        </div>
      )}

      {/* --- LAYOUT 3: SWING (Balanced) --- */}
      {persona === "SWING" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
             <div className="col-span-2"><ChartWidget type="Daily" /></div>
             <div className="col-span-1 space-y-4">
                <OrderEntryWidget simplified={false} />
                <FinancialWidget />
             </div>
        </div>
      )}
    </div>
  );
}