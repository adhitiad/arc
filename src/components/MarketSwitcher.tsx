"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMarketStatus } from "@/hooks/useMarketStatus";
import { MarketType } from "@/lib/market";
import { useAuthStore } from "@/lib/store";

const marketOptions: { value: MarketType; label: string }[] = [
  { value: "STOCK", label: "IDX Stocks" },
  { value: "FOREX", label: "Forex" },
  { value: "CRYPTO", label: "Crypto" },
];

export function MarketSwitcher() {
  const { activeMarket, setMarket } = useAuthStore();
  const status = useMarketStatus(activeMarket);

  return (
    <div className="flex flex-col items-end gap-1 min-w-[180px]">
      <Select
        value={activeMarket}
        onValueChange={(value) => setMarket(value as MarketType)}
      >
        <SelectTrigger className="h-8 bg-zinc-900 border-zinc-700 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800">
          {marketOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
        <Badge
          variant="outline"
          className={
            status.isOpen
              ? "border-green-700 text-green-400"
              : "border-red-700 text-red-400"
          }
        >
          {status.isOpen ? "OPEN" : "CLOSED"}
        </Badge>
        <span>{status.localTime}</span>
      </div>
      <div className="text-[10px] text-zinc-500">{status.nextChange}</div>
    </div>
  );
}
