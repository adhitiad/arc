import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp, Users } from "lucide-react";

interface BrokerData {
  code: string;
  value: number; // Dalam Milyar/Juta
  avgPrice: number;
}

interface BandarProps {
  symbol: string;
  status: "ACCUMULATION" | "DISTRIBUTION" | "NEUTRAL";
  strength: number; // 0-100
  topBuyers: BrokerData[];
  topSellers: BrokerData[];
}

export const BandarDetector: React.FC<BandarProps> = ({
  symbol,
  status,
  strength,
  topBuyers,
  topSellers,
}) => {
  const isAccum = status === "ACCUMULATION";
  const statusColor = isAccum
    ? "text-green-400"
    : status === "DISTRIBUTION"
      ? "text-red-400"
      : "text-zinc-400";

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center justify-between">
          <span>Bandarmology Flow ({symbol})</span>
          <Users className="w-4 h-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Status Utama */}
        <div className="mb-4">
          <div
            className={`text-2xl font-bold ${statusColor} flex items-center gap-2`}
          >
            {status}
            {isAccum ? (
              <TrendingUp className="w-6 h-6" />
            ) : status === "DISTRIBUTION" ? (
              <TrendingDown className="w-6 h-6" />
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Progress
              value={strength}
              className={`h-2 ${isAccum ? "bg-green-900" : "bg-red-900"}`}
            />
            <span className="text-xs text-zinc-500">{strength}% Strength</span>
          </div>
        </div>

        {/* Broker Summary Table */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-green-500 font-semibold mb-2 border-b border-zinc-800 pb-1">
              Top Buyers
            </div>
            {topBuyers.map((broker) => (
              <div key={broker.code} className="flex justify-between py-1">
                <span className="font-mono bg-zinc-800 px-1 rounded">
                  {broker.code}
                </span>
                <span>{broker.value}B</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-red-500 font-semibold mb-2 border-b border-zinc-800 pb-1">
              Top Sellers
            </div>
            {topSellers.map((broker) => (
              <div key={broker.code} className="flex justify-between py-1">
                <span className="font-mono bg-zinc-800 px-1 rounded">
                  {broker.code}
                </span>
                <span>{broker.value}B</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
