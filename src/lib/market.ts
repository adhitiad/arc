export type MarketType = "STOCK" | "FOREX" | "CRYPTO";

export interface MarketSnapshot {
  market: MarketType;
  label: string;
  isOpen: boolean;
  localTime: string;
  sessionNote: string;
  nextChange: string;
}

const formatTime = (date: Date, timeZone?: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(date);

const timeInZone = (date: Date, timeZone: string) =>
  new Date(date.toLocaleString("en-US", { timeZone }));

export const getMarketSnapshot = (
  market: MarketType,
  now: Date = new Date(),
): MarketSnapshot => {
  if (market === "CRYPTO") {
    return {
      market,
      label: "Crypto",
      isOpen: true,
      localTime: `${formatTime(now, "UTC")} UTC`,
      sessionNote: "24/7 Market",
      nextChange: "Always Open",
    };
  }

  if (market === "FOREX") {
    const utcDay = now.getUTCDay();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const openSunday = utcDay === 0 && utcMinutes >= 22 * 60;
    const openWeek = utcDay >= 1 && utcDay <= 4;
    const openFriday = utcDay === 5 && utcMinutes < 21 * 60;
    const isOpen = openSunday || openWeek || openFriday;

    const nextChange = isOpen
      ? "Closes Fri 21:00 UTC"
      : utcDay === 6
        ? "Opens Sun 22:00 UTC"
        : utcDay === 0
          ? "Opens 22:00 UTC"
          : "Opens Sun 22:00 UTC";

    return {
      market,
      label: "Forex",
      isOpen,
      localTime: `${formatTime(now, "UTC")} UTC`,
      sessionNote: "24/5 Market",
      nextChange,
    };
  }

  // Default: STOCK (IDX)
  const jakarta = timeInZone(now, "Asia/Jakarta");
  const day = jakarta.getDay();
  const minutes = jakarta.getHours() * 60 + jakarta.getMinutes();
  const openMin = 9 * 60;
  const closeMin = 15 * 60 + 30;
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && minutes >= openMin && minutes < closeMin;

  let nextChange = "Opens Mon 09:00 WIB";
  if (isWeekday && minutes < openMin) {
    nextChange = "Opens 09:00 WIB";
  } else if (isWeekday && minutes >= closeMin) {
    nextChange = "Opens next session 09:00 WIB";
  } else if (isOpen) {
    nextChange = "Closes 15:30 WIB";
  }

  return {
    market,
    label: "IDX Stocks",
    isOpen,
    localTime: `${formatTime(now, "Asia/Jakarta")} WIB`,
    sessionNote: "09:00-15:30 WIB",
    nextChange,
  };
};
