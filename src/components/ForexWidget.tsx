import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

export function ForexWidget() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-zinc-400 flex gap-2">
          <Globe className="w-4 h-4" /> Currency Strength
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Visualisasi Bar Kekuatan Mata Uang */}
          <div className="flex items-center gap-2">
            <span className="w-8 font-bold">USD</span>
            <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
              <div className="h-full bg-green-500 w-[85%]" />
            </div>
            <span className="text-xs text-green-400">85</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 font-bold">JPY</span>
            <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
              <div className="h-full bg-red-500 w-[20%]" />
            </div>
            <span className="text-xs text-red-400">20</span>
          </div>
        </div>
        <div className="mt-4 p-2 bg-blue-900/20 text-blue-300 text-xs rounded text-center">
          Signal: <strong>BUY USDJPY</strong> (Strong vs Weak)
        </div>
      </CardContent>
    </Card>
  );
}
