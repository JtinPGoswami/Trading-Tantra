import React from "react";
import { Treemap, ResponsiveContainer } from "recharts";

// Example data (Replace with real stock data)
const stockData = [
  { name: "Stock A", volume: 10000, change: 2.5 }, 
  { name: "Stock B", volume: 3000, change: -1.2 },
  { name: "Stock C", volume: 8000, change: 4.8 }, 
  { name: "Stock D", volume: 6000, change: -3.0 }, 
  { name: "Stock e", volume: 8000, change: 3.0 }, 
  { name: "Stock f", volume: 9000, change: -6.0 }, 
  { name: "Stock g", volume: 3000, change: 8.0 }, 
  { name: "Stock h", volume: 1000, change: 3.0 }, 
  { name: "Stock i", volume: 2000, change: 3.0 }, 
  { name: "Stock j", volume: 8000, change: 1.0 }, 
  { name: "Stock k", volume: 4000, change: 9.0 }, 
  { name: "Stock l", volume: 2000, change: 1.0 }, 
  { name: "Stock m", volume: 1000, change: 4.0 }, 
  { name: "Stock n", volume: 4000, change: 1.0 }, 
];

// Function to determine color based on change percentage
const getColor = (change) => {
  if (change > 0) return `rgba(0, 255, 0, ${change / 10})`; // Green shades
  if (change < 0) return `rgba(255, 0, 0, ${Math.abs(change) / 10})`; // Red shades
  return "gray"; // Neutral
};

const TreemapChart = () => {
  return (
    <div className="w-full h-full bg-[#01071C]  rounded-lg">
     
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={stockData}
          dataKey="volume"
          stroke="#333"
          fill="#8884d8"
          content={({ root, depth, x, y, width, height, index }) => {
            if (!root) return null;
            const stock = stockData[index];
            return (
              <g>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={getColor(stock.change)}
                />
                <text
                  x={x + width / 2}
                  y={y + height / 2}
                  textAnchor="middle"
                  fill="white"
                >
                  {stock.name}
                </text>
              </g>
            );
          }}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default TreemapChart;
