"use client";

import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  IChartApi,
  LineSeries,
  Time,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";

interface ChartData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface LineDataPoint {
  time: Time;
  value: number;
}

interface HistogramDataPoint {
  time: Time;
  value: number;
  color?: string;
}

interface ChartProps {
  data: ChartData[];
  height?: number;
  indicatorHeight?: number;
  colors?: {
    backgroundColor?: string;
    textColor?: string;
    gridColor?: string;
    upColor?: string;
    downColor?: string;
    wickUpColor?: string;
    wickDownColor?: string;
  };
  sma20?: LineDataPoint[];
  sma50?: LineDataPoint[];
  volume?: HistogramDataPoint[];
  rsi?: LineDataPoint[];
  macd?: LineDataPoint[];
  macdSignal?: LineDataPoint[];
  macdHistogram?: HistogramDataPoint[];
}

export const StockChart: React.FC<ChartProps> = ({
  data,
  height = 400,
  indicatorHeight = 160,
  colors = {},
  sma20,
  sma50,
  volume,
  rsi,
  macd,
  macdSignal,
  macdHistogram,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const sma20SeriesRef = useRef<any>(null);
  const sma50SeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  const rsiContainerRef = useRef<HTMLDivElement>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);
  const rsiSeriesRef = useRef<any>(null);

  const macdContainerRef = useRef<HTMLDivElement>(null);
  const macdChartRef = useRef<IChartApi | null>(null);
  const macdSeriesRef = useRef<any>(null);
  const macdSignalSeriesRef = useRef<any>(null);
  const macdHistogramSeriesRef = useRef<any>(null);

  // Default color constants
  const defaultColors = {
    backgroundColor: "#18181b", // Zinc-900
    textColor: "#d4d4d8", // Zinc-300
    gridColor: "#27272a", // Zinc-800
    upColor: "#22c55e", // Green-500
    downColor: "#ef4444", // Red-500
    wickUpColor: "#22c55e",
    wickDownColor: "#ef4444",
  };

  const mergedColors = { ...defaultColors, ...colors };

  const showRsi = Boolean(rsi && rsi.length > 0);
  const showMacd = Boolean(
    (macd && macd.length > 0) ||
      (macdSignal && macdSignal.length > 0) ||
      (macdHistogram && macdHistogram.length > 0),
  );

  // Initialize main chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: chartContainerRef.current?.clientWidth || 600,
      });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: mergedColors.backgroundColor,
        },
        textColor: mergedColors.textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height,
      grid: {
        vertLines: { color: mergedColors.gridColor },
        horzLines: { color: mergedColors.gridColor },
      },
    });

    chartRef.current = chart;

    // Add Candlestick Series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: mergedColors.upColor,
      downColor: mergedColors.downColor,
      borderVisible: false,
      wickUpColor: mergedColors.wickUpColor,
      wickDownColor: mergedColors.wickDownColor,
    });

    seriesRef.current = candleSeries;

    sma20SeriesRef.current = chart.addSeries(LineSeries, {
      color: "#60a5fa",
      lineWidth: 2,
    });
    sma50SeriesRef.current = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 2,
    });

    volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: { type: "volume" },
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    chart.priceScale("right").applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.3 },
    });

    // Fit content
    chart.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [height]); // Only recreate on height change

  // Initialize RSI chart
  useEffect(() => {
    if (!showRsi || !rsiContainerRef.current) return;

    const handleResize = () => {
      rsiChartRef.current?.applyOptions({
        width: rsiContainerRef.current?.clientWidth || 600,
      });
    };

    const chart = createChart(rsiContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: mergedColors.backgroundColor,
        },
        textColor: mergedColors.textColor,
      },
      width: rsiContainerRef.current.clientWidth,
      height: indicatorHeight,
      grid: {
        vertLines: { color: mergedColors.gridColor },
        horzLines: { color: mergedColors.gridColor },
      },
      rightPriceScale: {
        scaleMargins: { top: 0.2, bottom: 0.2 },
      },
    });

    rsiChartRef.current = chart;
    rsiSeriesRef.current = chart.addSeries(LineSeries, {
      color: "#a855f7",
      lineWidth: 2,
    });

    chart.timeScale().fitContent();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      rsiChartRef.current = null;
      rsiSeriesRef.current = null;
    };
  }, [indicatorHeight, showRsi, mergedColors.backgroundColor, mergedColors.textColor, mergedColors.gridColor]);

  // Initialize MACD chart
  useEffect(() => {
    if (!showMacd || !macdContainerRef.current) return;

    const handleResize = () => {
      macdChartRef.current?.applyOptions({
        width: macdContainerRef.current?.clientWidth || 600,
      });
    };

    const chart = createChart(macdContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: mergedColors.backgroundColor,
        },
        textColor: mergedColors.textColor,
      },
      width: macdContainerRef.current.clientWidth,
      height: indicatorHeight,
      grid: {
        vertLines: { color: mergedColors.gridColor },
        horzLines: { color: mergedColors.gridColor },
      },
      rightPriceScale: {
        scaleMargins: { top: 0.2, bottom: 0.2 },
      },
    });

    macdChartRef.current = chart;
    macdSeriesRef.current = chart.addSeries(LineSeries, {
      color: "#22c55e",
      lineWidth: 2,
    });
    macdSignalSeriesRef.current = chart.addSeries(LineSeries, {
      color: "#f97316",
      lineWidth: 2,
    });
    macdHistogramSeriesRef.current = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
    });

    chart.timeScale().fitContent();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      macdChartRef.current = null;
      macdSeriesRef.current = null;
      macdSignalSeriesRef.current = null;
      macdHistogramSeriesRef.current = null;
    };
  }, [indicatorHeight, showMacd, mergedColors.backgroundColor, mergedColors.textColor, mergedColors.gridColor]);

  // Update chart options when colors change
  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.applyOptions({
      layout: {
        background: {
          type: ColorType.Solid,
          color: mergedColors.backgroundColor,
        },
        textColor: mergedColors.textColor,
      },
      grid: {
        vertLines: { color: mergedColors.gridColor },
        horzLines: { color: mergedColors.gridColor },
      },
    });
  }, [
    mergedColors.backgroundColor,
    mergedColors.textColor,
    mergedColors.gridColor,
  ]);

  // Update series data
  useEffect(() => {
    if (!seriesRef.current || !data || data.length === 0) return;

    seriesRef.current.setData(data);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  useEffect(() => {
    if (sma20SeriesRef.current && sma20) {
      sma20SeriesRef.current.setData(sma20);
    }
  }, [sma20]);

  useEffect(() => {
    if (sma50SeriesRef.current && sma50) {
      sma50SeriesRef.current.setData(sma50);
    }
  }, [sma50]);

  useEffect(() => {
    if (volumeSeriesRef.current && volume) {
      volumeSeriesRef.current.setData(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (rsiSeriesRef.current && rsi) {
      rsiSeriesRef.current.setData(rsi);
      rsiChartRef.current?.timeScale().fitContent();
    }
  }, [rsi]);

  useEffect(() => {
    if (macdSeriesRef.current && macd) {
      macdSeriesRef.current.setData(macd);
    }
    if (macdSignalSeriesRef.current && macdSignal) {
      macdSignalSeriesRef.current.setData(macdSignal);
    }
    if (macdHistogramSeriesRef.current && macdHistogram) {
      macdHistogramSeriesRef.current.setData(macdHistogram);
    }
    macdChartRef.current?.timeScale().fitContent();
  }, [macd, macdSignal, macdHistogram]);

  // Update series colors
  useEffect(() => {
    if (!seriesRef.current) return;

    seriesRef.current.applyOptions({
      upColor: mergedColors.upColor,
      downColor: mergedColors.downColor,
      wickUpColor: mergedColors.wickUpColor,
      wickDownColor: mergedColors.wickDownColor,
    });
  }, [
    mergedColors.upColor,
    mergedColors.downColor,
    mergedColors.wickUpColor,
    mergedColors.wickDownColor,
  ]);

  return (
    <div className="space-y-4">
      {!data || data.length === 0 ? (
        <div
          ref={chartContainerRef}
          className="w-full relative flex items-center justify-center"
          style={{ height: `${height}px` }}
          role="img"
          aria-label="Stock chart loading or no data available"
        >
          <span className="text-muted-foreground">No data available</span>
        </div>
      ) : (
        <div
          ref={chartContainerRef}
          className="w-full relative"
          style={{ height: `${height}px` }}
          role="img"
          aria-label="Stock price candlestick chart"
        />
      )}

      {showRsi && (
        <div>
          <div className="px-2 text-xs text-zinc-500">RSI (14)</div>
          <div
            ref={rsiContainerRef}
            className="w-full relative"
            style={{ height: `${indicatorHeight}px` }}
            role="img"
            aria-label="RSI indicator chart"
          />
        </div>
      )}

      {showMacd && (
        <div>
          <div className="px-2 text-xs text-zinc-500">MACD</div>
          <div
            ref={macdContainerRef}
            className="w-full relative"
            style={{ height: `${indicatorHeight}px` }}
            role="img"
            aria-label="MACD indicator chart"
          />
        </div>
      )}
    </div>
  );
};
