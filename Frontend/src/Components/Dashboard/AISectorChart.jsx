import React from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";

const data = [
  { name: "Reliance", value: 1.8 },
  { name: "TCS", value: 1.5 },
  { name: "Infosys", value: 1.3 },
  { name: "HDFC", value: 1.2 },
  { name: "ICICI ", value: 1.1 },
  { name: "SBI", value: 1.0 },
  { name: "Tata Motors", value: 0.9 },
  { name: "Bajaj Finance", value: 0.8 },
  { name: "Axis Bank", value: 0.6 },
  { name: "HUL", value: 0.5 },
  { name: "ITC", value: 0.3 },
  { name: "L&T", value: -0.2 },
  { name: "Adani", value: -0.5 },
  { name: "Power Grid", value: -0.8 },
  { name: "PNB", value: -1.0 }
];

const AISectorChart = () => {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div className="p-4 dark:bg-db-secondary bg-db-secondary-light  rounded-lg shadow-md w-full">
    
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" stroke={theme==="dark"?"#fff":"#000"} />
          <YAxis stroke={theme==="dark"?"#fff":"#000"} />
          <Tooltip cursor={{ fill: "rgba(255,255,255,0.1)" }}
           contentStyle={{ backgroundColor: "#000A2D", borderRadius: "5px", borderColor: theme==="dark"?"#fff":"#000" }} 
           itemStyle={{ color: "#fff" }} 
          />
          <ReferenceLine y={0} stroke={theme==="dark"?"#fff":"#000"} strokeWidth={2} />
          <Bar dataKey="value" barSize={30} radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value >= 0 ? "#0256F5" : "#95025A"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AISectorChart;
