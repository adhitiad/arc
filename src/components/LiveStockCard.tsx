// Komponen Kartu Saham yang Live
import { Button } from "@/components/ui/button";
import { useMarketSocket } from "@/hooks/useMarketSocket";

export type ScreenerIndicatorType =
  | "signal_score"
  | "rsi"
  | "macd"
  | "strength"
  | "volume"
  | "change_percent"
  | "bandar_status";

interface LiveStockCardProps {
  asset: any;
  displayedIndicator?: ScreenerIndicatorType;
}

const LiveStockCard = ({ asset, displayedIndicator = "signal_score" }: LiveStockCardProps) => {
  // Hubungkan ke socket untuk symbol spesifik ini
  const symbol = asset?.symbol ?? "UNKNOWN";
  const { data: liveData } = useMarketSocket(symbol);

  // Gunakan data live jika ada, jika tidak gunakan data snapshot dari API (asset.price)
  const currentPriceRaw = liveData?.price ?? asset?.price ?? 0;
  const currentPrice = Number.isFinite(Number(currentPriceRaw))
    ? Number(currentPriceRaw)
    : 0;

  const displayPrice = currentPrice.toLocaleString();

  const getIndicatorDisplay = (): { label: string; value: string | number } => {
    switch (displayedIndicator) {
      case "signal_score":
        return {
          label: "Score",
          value: asset?.signal_score ?? 0,
        };
      case "rsi":
        return {
          label: "RSI",
          value: asset?.rsi ?? "-",
        };
      case "macd":
        return {
          label: "MACD",
          value: asset?.macd ?? "-",
        };
      case "strength":
        return {
          label: "Strength",
          value: asset?.strength ?? asset?.signal_score ?? 0,
        };
      case "volume":
        return {
          label: "Volume",
          value: asset?.volume ?? "-",
        };
      case "change_percent":
        return {
          label: "Change",
          value:
            asset?.change_percent != null
              ? `${asset.change_percent >= 0 ? "+" : ""}${asset.change_percent}%`
              : "-",
        };
      case "bandar_status":
        return {
          label: "Bandar",
          value: asset?.bandar_status ?? "-",
        };
    }
  };

  const { label, value } = getIndicatorDisplay();

  return (
    <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{symbol}</h3>
            {liveData && (
              <span
                className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"
                title="Live Data"
              />
            )}
            <span className="px-2 py-1 bg-zinc-700 rounded text-xs">
              {label}: {value}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
            <div>
              <span className="text-zinc-500">Price: </span>
              <span
                className={`font-mono font-semibold ${liveData ? "text-white" : "text-zinc-300"}`}
              >
                {displayPrice}
              </span>
            </div>
            {/* ... render sisa data lainnya ... */}
            <div>
              <span className="text-zinc-500">Change: </span>
              <span
                className={`font-semibold ${asset.change_percent >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {asset?.change_percent ?? 0}%
              </span>
            </div>
          </div>
        </div>
        {/* Tombol aksi */}
        <div className="ml-6 flex flex-col gap-2">
          <Button size="sm" variant="outline" className="border-zinc-600">
            Chart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveStockCard;
