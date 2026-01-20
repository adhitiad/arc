// Komponen Kartu Saham yang Live
import { Button } from "@/components/ui/button";
import { useMarketSocket } from "@/hooks/useMarketSocket"; // Import hook yang tadi dibuat

const LiveStockCard = (asset: any) => {
  // Hubungkan ke socket untuk symbol spesifik ini
  const { data: liveData } = useMarketSocket(asset.symbol);

  // Gunakan data live jika ada, jika tidak gunakan data snapshot dari API (asset.price)
  const currentPrice = liveData?.price || asset.price;

  // Hitung perubahan harga (Mock calculation for live, or use liveData change)
  // Di real app, liveData harus mengirimkan change_percent juga
  const displayPrice = currentPrice.toLocaleString();

  // Efek kedip (Flash) bisa ditambahkan di sini dengan useEffect memantau currentPrice

  return (
    <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{asset.symbol}</h3>
            {/* Indikator Live */}
            {liveData && (
              <span
                className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"
                title="Live Data"
              />
            )}
            <span className="px-2 py-1 bg-zinc-700 rounded text-xs">
              Score: {asset.signal_score}
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
                {asset.change_percent}%
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
