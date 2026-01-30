import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Wallet } from "lucide-react";

export function CryptoWidget() {
  return (
    <div className="grid gap-4 grid-cols-2">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-zinc-400 flex gap-2">
            <Gauge className="w-4 h-4" /> Fear & Greed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">72</div>
          <div className="text-xs text-zinc-500">Greed (Bullish)</div>
        </CardContent>
      </Card>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-zinc-400 flex gap-2">
            <Wallet className="w-4 h-4" /> Exchange NetFlow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">-2.5k BTC</div>
          <div className="text-xs text-zinc-500">Outflow (Accumulation)</div>
        </CardContent>
      </Card>
    </div>
  );
}
