import {
  Navigation2Icon,
  Trash,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

interface AnomalyProps {
  type: "DISTRIBUTION_DETECTED" | "ACCUMULATION_DETECTED" | "NORMAL";
  message: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

export function AnomalyWidget({ data }: { data: AnomalyProps }) {
  if (data.type === "NORMAL") return null;

  const isDist = data.type === "DISTRIBUTION_DETECTED"; // Harga turun, Berita Bagus

  return (
    <div
      className={`rounded-lg p-4 border-l-4 mb-4 flex items-start gap-3 shadow-lg animate-in slide-in-from-top-2
        ${isDist ? "bg-red-900/20 border-red-500" : "bg-green-900/20 border-green-500"}`}
    >
      <div
        className={`p-2 rounded-full ${isDist ? "bg-red-900/50" : "bg-green-900/50"}`}
      >
        {isDist ? (
          <TrendingDown className="w-5 h-5 text-red-400" />
        ) : (
          <TrendingUp className="w-5 h-5 text-green-400" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4
            className={`font-bold text-sm flex items-center gap-2 ${isDist ? "text-red-400" : "text-green-400"}`}
          >
            <Zap className="w-3 h-3" />
            {isDist ? "DISTRIBUTION DETECTED" : "ACCUMULATION DETECTED"}
          </h4>
          {data.severity === "HIGH" && (
            <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
              CRITICAL
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-300 mt-1">{data.message}</p>
        <div className="mt-2 text-xs text-zinc-500 flex gap-4">
          <span>
            Sentiment:{" "}
            <strong className={isDist ? "text-green-400" : "text-red-400"}>
              {isDist ? "Very Positive" : "Very Negative"}
            </strong>
          </span>
          <span>
            Price Action:{" "}
            <strong className={isDist ? "text-red-400" : "text-green-400"}>
              {isDist ? (
                <Trash className="w-4 h-4 inline" />
              ) : (
                <Navigation2Icon className="w-4 h-4 inline" />
              )}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
