import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Brain,
  TrendingUp,
} from "lucide-react";

interface SignalProps {
  Symbol: string;
  Category: string; // FOREX, STOCKS_INDO
  Action: "BUY" | "SELL" | "HOLD";
  Price: number;
  Tp: number;
  Sl: number;
  LotSize?: string;
  Prob?: string;
  // Data Khusus dari Backend Python kita
  Whale_Activity?: string;
  Bandar_Info?: { Status: string; Score: string; Message?: string };
  AI_Analyst?: {
    Verdict: string;
    Projected_Profit: string;
    Projected_Loss: string;
    Note: string;
    Risk_Level: string;
  };
  Reason?: string;
}

export default function SignalCard({ data }: { data: SignalProps }) {
  const isBuy = data.Action === "BUY";

  return (
    <Card
      className={`border-l-4 ${
        isBuy ? "border-l-green-500" : "border-l-red-500"
      } bg-zinc-900 text-zinc-100 shadow-xl`}
    >
      {/* HEADER */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold">{data.Symbol}</CardTitle>
              <Badge
                variant="outline"
                className="text-[10px] border-zinc-700 text-zinc-400"
              >
                {data.Category}
              </Badge>
            </div>

            {/* INDIKATOR KHUSUS (BANDAR / PAUS) */}
            <div className="mt-1 space-y-1">
              {data.Whale_Activity && (
                <div className="text-[10px] text-yellow-400 flex items-center animate-pulse">
                  <Activity className="w-3 h-3 mr-1" /> {data.Whale_Activity}
                </div>
              )}
              {data.Bandar_Info && (
                <div className="text-[10px] text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> Bandar:{" "}
                  {data.Bandar_Info.Status} ({data.Bandar_Info.Score})
                </div>
              )}
            </div>
          </div>

          <Badge
            className={`text-md px-3 py-1 ${
              isBuy ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {isBuy ? (
              <ArrowUpCircle className="mr-1 w-4 h-4" />
            ) : (
              <ArrowDownCircle className="mr-1 w-4 h-4" />
            )}
            {data.Action}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* HARGA & LOT */}
        <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-3 rounded border border-white/5">
          <div>
            <p className="text-zinc-500 text-xs">Entry Price</p>
            <p className="font-mono text-lg font-bold">{data.Price}</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-xs">Size</p>
            <p className="font-mono font-bold text-blue-400">{data.LotSize}</p>
          </div>
        </div>

        {/* TP / SL */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between p-2 rounded bg-green-900/10 border border-green-900/30">
            <span className="text-zinc-500">TP</span>
            <span className="text-green-500 font-bold">{data.Tp}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-red-900/10 border border-red-900/30">
            <span className="text-zinc-500">SL</span>
            <span className="text-red-500 font-bold">{data.Sl}</span>
          </div>
        </div>

        {/* --- FITUR: AI ANALYST (GROQ) --- */}
        {data.AI_Analyst && (
          <div className="mt-2 border border-indigo-500/30 rounded overflow-hidden">
            <div className="bg-indigo-950/30 p-1.5 flex items-center gap-2 border-b border-indigo-500/20">
              <Brain className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-300 uppercase">
                AI Analyst Insight
              </span>
            </div>
            <div className="p-2 bg-indigo-950/10 text-xs space-y-2">
              <div className="flex justify-between">
                <Badge
                  variant={
                    data.AI_Analyst.Verdict === "FOLLOW"
                      ? "default"
                      : "secondary"
                  }
                  className="h-5 text-[10px]"
                >
                  {data.AI_Analyst.Verdict}
                </Badge>
                <span className="text-zinc-400">
                  Risk: {data.AI_Analyst.Risk_Level}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-green-400/80">
                  +{data.AI_Analyst.Projected_Profit}
                </div>
                <div className="text-red-400/80">
                  -{data.AI_Analyst.Projected_Loss}
                </div>
              </div>
              <p className="italic text-zinc-500 text-[10px]">
                "{data.AI_Analyst.Note}"
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
