"use client";

import {
  CandlestickSeries,
  ColorType,
  createChart,
  IChartApi,
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

interface ChartProps {
  data: ChartData[];
  height?: number;
  colors?: {
    backgroundColor?: string;
    textColor?: string;
    gridColor?: string;
    upColor?: string;
    downColor?: string;
    wickUpColor?: string;
    wickDownColor?: string;
  };
}

export const StockChart: React.FC<ChartProps> = ({
  data,
  height = 400,
  colors = {},
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

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

  // Initialize chart
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

    // Fit content
    chart.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [height]); // Only recreate on height change

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

  if (!data || data.length === 0) {
    return (
      <div
        ref={chartContainerRef}
        className="w-full relative flex items-center justify-center"
        style={{ height: `${height}px` }}
        role="img"
        aria-label="Stock chart loading or no data available"
      >
        <span className="text-muted-foreground">No data available</span>
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      className="w-full relative"
      style={{ height: `${height}px` }}
      role="img"
      aria-label="Stock price candlestick chart"
    />
  );
};
