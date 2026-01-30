import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface AnalysisResult {
  overall_sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  score: number;
  highlights: string[];
  risk_factors: string[];
  summary: string;
}

export function FinancialReportCard({
  data,
  symbol,
  period,
}: {
  data: AnalysisResult;
  symbol: string;
  period: string;
}) {
  const isBullish = data.overall_sentiment === "BULLISH";
  const colorClass = isBullish
    ? "text-green-500"
    : data.overall_sentiment === "BEARISH"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Kolom Kiri: Skor & Sentimen */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Analysis Result: {symbol} ({period})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-zinc-950 rounded-lg border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-2">
              AI Confidence Score
            </div>
            <div className={`text-5xl font-bold mb-4 ${colorClass}`}>
              {data.score}/100
            </div>
            <Badge
              variant={isBullish ? "default" : "destructive"}
              className="text-lg px-4 py-1"
            >
              {data.overall_sentiment}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-zinc-400">Fundamental Health</div>
            <Progress
              value={data.score}
              className={`h-3 ${isBullish ? "bg-green-900" : "bg-red-900"}`}
            />
          </div>

          <p className="text-zinc-300 italic">"{data.summary}"</p>
        </CardContent>
      </Card>

      {/* Kolom Kanan: Detail Poin */}
      <div className="space-y-4">
        <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Key Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.highlights.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{" "}
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.risk_factors.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-300">
                  <TrendingDown className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />{" "}
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
