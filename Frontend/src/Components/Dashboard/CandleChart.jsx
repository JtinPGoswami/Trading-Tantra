import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const CandlestickChart = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#131722" }, // Dark theme
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "rgba(42, 46, 57, 0.5)" },
        horzLines: { color: "rgba(42, 46, 57, 0.5)" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries(); // ✅ Fix here

    // Sample candlestick data
    candleSeries.setData([
      { time: 1708500000, open: 150, high: 155, low: 145, close: 152 },
      { time: 1708503600, open: 152, high: 158, low: 151, close: 157 },
      { time: 1708507200, open: 157, high: 160, low: 155, close: 159 },
      { time: 1708510800, open: 159, high: 162, low: 157, close: 158 },
      { time: 1708514400, open: 158, high: 160, low: 155, close: 157 },
    ]);

    return () => chart.remove(); // Cleanup on unmount
  }, []);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />;
};

export default CandlestickChart;
