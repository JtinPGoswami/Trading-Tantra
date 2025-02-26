import React from "react";
import { FcCandleSticks } from "react-icons/fc";

const data = Array(10).fill({
  date: "07-02-2025",
  fiiBuy: "1248.21",
  fiiSell: "12952.6",
  fiiNet: "-470.39",
  inMarket: "-16.19",
  diiNet: "454.3",
  diiBuy: "12185.62",
  diiSell: "11731.62",
});

const FiiDiiTable = () => {
  return (
    <div className="bg-[#01071C] rounded-lg p-2">
    <h2 className="text-white text-2xl font-semibold p-2 flex items-center gap-2">
      FII / DII <FcCandleSticks />
    </h2>
  
    <div className="bg-gradient-to-br from-[#00078F] to-[#01071C] p-px rounded-lg">
      <div className="bg-[#000A2D] rounded-lg p-4 w-full overflow-x-auto">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] text-white text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                {[
                  "Date",
                  "FII BUY",
                  "FII Sell",
                  "FII Net",
                  "In Market",
                  "DII Net",
                  "DII Buy",
                  "DII Sell",
                ].map((header) => (
                  <th key={header} className="p-3 text-left whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-3 whitespace-nowrap">{row.date}</td>
                  <td className="p-3 whitespace-nowrap">{row.fiiBuy}</td>
                  <td className="p-3 whitespace-nowrap">{row.fiiSell}</td>
                  <td
                    className={`p-3 whitespace-nowrap ${
                      parseFloat(row.fiiNet) < 0 ? "text-[#C0313F]" : ""
                    }`}
                  >
                    {row.fiiNet}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="bg-[#0357F5] px-3 py-1 rounded-full">
                      {row.inMarket}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">{row.diiNet}</td>
                  <td className="p-3 whitespace-nowrap">{row.diiBuy}</td>
                  <td className="p-3 whitespace-nowrap">{row.diiSell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default FiiDiiTable;
