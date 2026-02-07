"use client";

import { useEffect, useMemo, useState } from "react";

import { getMarketSnapshot, MarketSnapshot, MarketType } from "@/lib/market";

export const useMarketStatus = (market: MarketType): MarketSnapshot => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => getMarketSnapshot(market, now), [market, now]);
};
