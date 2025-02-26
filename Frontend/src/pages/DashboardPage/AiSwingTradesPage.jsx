import React from "react";
import tendays from "../../assets/Images/Dashboard/AiSwingTradesPAge/tenDays.png";
import fiftydays from "../../assets/Images/Dashboard/AiSwingTradesPAge/fiftyDays.png";
import reversalRadar from "../../assets/Images/Dashboard/AiSwingTradesPAge/reversalRadar.png";
import channel from "../../assets/Images/Dashboard/AiSwingTradesPAge/channel.png";
import nrseven from "../../assets/Images/Dashboard/AiSwingTradesPAge/nr7.png";
import StockCard from "../../Components/Dashboard/StockCard";
import TreemapChart from "../../Components/Dashboard/TreemapChart";
import { FcCandleSticks } from "react-icons/fc";
import candles from "../../assets/Images/Dashboard/marketdepthpage/candles.png";
import { FaPlayCircle } from "react-icons/fa";
import topGainers from "../../assets/Images/Dashboard/marketdepthpage/topGainers.png";

const AiSwingTradesPage = () => {
  const stockDataList = [
    {
      title: "10 Days BO",
      img: tendays,
      price: "purchased",
      stocks: [
        {
          symbol: "KPITTECH",
          icon: "https://via.placeholder.com/20/00FF00",
          percent: 2.96,
          turnover: 332.89,
        },
        {
          symbol: "ZOMATO",
          icon: "https://via.placeholder.com/20/FF0000",
          percent: 6.72,
          turnover: 1.94,
        },
        {
          symbol: "TVS MOTOR",
          icon: "https://via.placeholder.com/20/FFA500",
          percent: 5.94,
          turnover: 0.77,
        },
        {
          symbol: "SUPER MEIND",
          icon: "https://via.placeholder.com/20/FF4500",
          percent: 5.64,
          turnover: 1.89,
        },
        {
          symbol: "SUPER MEIND",
          icon: "https://via.placeholder.com/20/FF4500",
          percent: 5.64,
          turnover: 1.89,
        },
        {
          symbol: "SUPER MEIND",
          icon: "https://via.placeholder.com/20/FF4500",
          percent: 5.64,
          turnover: 1.89,
        },
        {
          symbol: "SUPER MEIND",
          icon: "https://via.placeholder.com/20/FF4500",
          percent: 5.64,
          turnover: 1.89,
        },
        {
          symbol: "SUPER MEIND",
          icon: "https://via.placeholder.com/20/FF4500",
          percent: 5.64,
          turnover: 1.89,
        },
        {
          symbol: "SUPER MEIND",
          icon: "https://via.placeholder.com/20/FF4500",
          percent: 5.64,
          turnover: 1.89,
        },
      ],
    },
    {
      title: "50 Days BO",
      img: fiftydays,
      price: "purchased",
      stocks: [
        {
          symbol: "HDFC",
          icon: "https://via.placeholder.com/20/008000",
          percent: 1.23,
          turnover: 125.3,
        },
        {
          symbol: "ICICI",
          icon: "https://via.placeholder.com/20/FF4500",
          percent: 2.45,
          turnover: 76.5,
        },
        {
          symbol: "TATA STEEL",
          icon: "https://via.placeholder.com/20/0000FF",
          percent: 3.78,
          turnover: 56.1,
        },
      ],
    },
    {
      title: "Reversal Radar",
      img: reversalRadar,
      price: "no",
      stocks: [
        {
          symbol: "IRCTC",
          icon: "https://via.placeholder.com/20/800080",
          percent: 4.11,
          turnover: 98.2,
        },
        {
          symbol: "YES BANK",
          icon: "https://via.placeholder.com/20/FFD700",
          percent: 1.98,
          turnover: 23.4,
        },
        {
          symbol: "BIOCON",
          icon: "https://via.placeholder.com/20/FF69B4",
          percent: 3.22,
          turnover: 45.8,
        },
      ],
    },
    {
      title: "Channel BO",
      img: channel,
      price: "no",
      stocks: [
        {
          symbol: "IRCTC",
          icon: "https://via.placeholder.com/20/800080",
          percent: 4.11,
          turnover: 98.2,
        },
        {
          symbol: "YES BANK",
          icon: "https://via.placeholder.com/20/FFD700",
          percent: 1.98,
          turnover: 23.4,
        },
        {
          symbol: "BIOCON",
          icon: "https://via.placeholder.com/20/FF69B4",
          percent: 3.22,
          turnover: 45.8,
        },
      ],
    },
    {
      title: "NR7",
      img: nrseven,
      price: "no",
      stocks: [
        {
          symbol: "IRCTC",
          icon: "https://via.placeholder.com/20/800080",
          percent: 4.11,
          turnover: 98.2,
        },
        {
          symbol: "YES BANK",
          icon: "https://via.placeholder.com/20/FFD700",
          percent: 1.98,
          turnover: 23.4,
        },
        {
          symbol: "BIOCON",
          icon: "https://via.placeholder.com/20/FF69B4",
          percent: 3.22,
          turnover: 45.8,
        },
      ],
    },
  ];
  return (
    <>
      <section className="mt-10">
        <h2 className="text-3xl font-bold ">AI Swing Trades</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {stockDataList.map((item, index) => (
            <StockCard
              key={index}
              title={item.title}
              stocks={item.stocks}
              img={item.img}
              price={item.price}
            />
          ))}
        </div>
      </section>

      {/* section weekly watch */}
      <section className="dark:bg-gradient-to-br from-[#0009B2] to-[#02000E] p-px rounded-2xl mt-10">
        <div className="dark:bg-db-primary bg-db-primary-light p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <img src={candles} alt="candle" className="w-15 object-contain" />
            <div>
              <h2 className=" text-xl font-semibold flex items-center gap-2">
                Weekly Watch <FcCandleSticks />
              </h2>
              <p className="dark:text-gray-400 text-gray-800 text-sm flex items-center gap-2">
                How to use <FaPlayCircle className="text-[#0256F5]" />{" "}
                <span className="bg-[#0256F5] text-white px-2 py-1 rounded-full text-xs">
                  Live
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl h-[400px]">
            <TreemapChart />
          </div>
        </div>
      </section>

      {/* delivery scanner section */}
      <section className="mt-10 dark:bg-gradient-to-br from-[#0009B2] to-[#02000E] p-px rounded-xl">
  <div className="p-3 dark:bg-db-primary bg-db-primary-light rounded-xl">
    <div className="flex flex-wrap justify-between items-center mb-8">
      <div className="flex gap-2 items-center">
        <img src={topGainers} alt="icon" />
        <h2 className=" text-4xl font-bold mb-4">Delivery Scanner</h2>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col">
          <label className="text-2xl font-semibold mb-2">Scan Type</label>
          <select className="text-xs px-2 w-fit py-1 border dark:border-white rounded outline-none bg-[#01071C] text-white">
            <option value="">Highest Delivery</option>
            <option value="">Highest Delivery</option>
            <option value="">Highest Delivery</option>
            <option value="">Highest Delivery</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-2xl font-semibold mb-2">Segment</label>
          <select className="text-xs w-fit border px-2 py-1 dark:border-white rounded outline-none bg-[#01071C] text-white">
            <option value="">F&O</option>
            <option value="">Highest Delivery</option>
            <option value="">Highest Delivery</option>
            <option value="">Highest Delivery</option>
          </select>
        </div>
      </div>
    </div>

    <div className="p-px rounded-lg dark:bg-gradient-to-br from-[#0009B2] to-[#02000E]">
      <div className="rounded-lg p-4 dark:bg-db-secondary bg-db-secondary-light  overflow-x-auto">
        <table className="w-full  text-left min-w-[600px]">
          <thead className="relative text-xl">
            <tr>
              <th className="whitespace-nowrap">Name</th>
              <th className="whitespace-nowrap">Volume</th>
              <th className="whitespace-nowrap">Avg. Del%</th>
              <th className="whitespace-nowrap">Delivery (%)</th>
            </tr>
            <tr className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-[#000A2D] via-[#002ED0] to-[#000A2D]" />
          </thead>
          <tbody>
            {[
              { name: "KPITTECH", volume: 3319808, avgDel: 55.55, del: 55.55 },
              { name: "ZOMATO", volume: 10138270, avgDel: 63.04, del: 63.04 },
              { name: "TVS MOTOR", volume: 1075095, avgDel: 54.53, del: 54.53 },
              { name: "SUPER MEIND", volume: 6077580, avgDel: 51.19, del: 51.19 },
            ].map((stock, index) => (
              <tr key={index} className="text-xl">
                <td className="pt-3">{stock.name}</td>
                <td className="pt-3">{stock.volume.toLocaleString()}</td>
                <td className="pt-3">{stock.avgDel.toFixed(2)}</td>
                <td className="flex items-center gap-2 pt-3 whitespace-nowrap">
                  {stock.del.toFixed(2)}
                  <div className="w-24 h-2 bg-gray-50 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${stock.del}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>


      <section className="mt-12">
        <div >
          <h4 className="text-2xl font-semibold">Highest Delivery:</h4>
          <p className="text-lg dark:text-[#D6D6D6] text-gray-800">
            Stocks which has the highest delivery in last 15 days comes here.
          </p>

          <h4 className="text-2xl font-semibold mt-7.5">Delivery Spike:</h4>
          <p className="text-lg dark:text-[#D6D6D6] text-gray-800">
            Stocks which has seen a significant increase in delivery % compared
            to yesterday comes under this section.
          </p>

          <p className="font-medium mt-10">
            Don't worry we will make a video on this soon on how to use this in
            practical trading.
          </p>
        </div>
      </section>
    </>
  );
};

export default AiSwingTradesPage;
