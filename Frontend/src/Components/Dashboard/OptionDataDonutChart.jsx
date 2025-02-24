import React, { useState } from "react";
import Chart from "react-apexcharts";

const OptionDataDonutChart = () => {
  const shares = [
    { name: "Reliance", percent: 44, change: 2.5 },  
    { name: "TCS", percent: 55, change: -1.8 },      
    { name: "Infosys", percent: 10, change: 8.2 },   
    { name: "HDFC Bank", percent: 17, change: -7.9 }, 
    { name: "ICICI Bank", percent: 15, change: 1.2 }, 
  ];

  // Function to interpolate between two colors
  const interpolateColor = (startColor, endColor, factor) => {
    const hexToRgb = (hex) =>
      hex
        .replace(/^#/, "")
        .match(/.{1,2}/g)
        .map((x) => parseInt(x, 16));

    const rgbToHex = (rgb) =>
      `#${rgb.map((x) => x.toString(16).padStart(2, "0")).join("")}`;

    const startRGB = hexToRgb(startColor);
    const endRGB = hexToRgb(endColor);

    const resultRGB = startRGB.map((start, i) =>
      Math.round(start + (endRGB[i] - start) * factor)
    );

    return rgbToHex(resultRGB);
  };

  // Generate color based on percentage and change
  const getColor = (percent, change) => {
    const minPercent = Math.min(...shares.map((s) => s.percent));
    const maxPercent = Math.max(...shares.map((s) => s.percent));

    // Normalize percent value between 0 and 1
    const factor = (percent - minPercent) / (maxPercent - minPercent);

    if (change > 0) {
      return interpolateColor("#c0f2c0", "#144d14", factor); // Light Green → Dark Green
    }
    return interpolateColor("#f2c0c0", "#611414", factor); // Light Red → Dark Red
  };

  const [chartData] = useState({
    series: shares.map((s) => s.percent),
    options: {
      chart: {
        type: "donut",
        width: 250,
      },
      labels: shares.map((s) => s.name),
      colors: shares.map((s) => getColor(s.percent, s.change)),
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(1) + "%";
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: "NIFTY 50",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 600,
              },
            },
          },
        },
      },
      legend: {
        position: "right",
        labels: {
          useSeriesColors: true,
          colors: "#fff",
        },
      },
    },
  });

  return (
    <div>
      <p className="text-sm font-bold text-center text-white">
        Nifty 50 is down by 32 pts
      </p>
      <Chart options={chartData.options} series={chartData.series} type="donut" width={400} />
    </div>
  );
};

export default OptionDataDonutChart;
