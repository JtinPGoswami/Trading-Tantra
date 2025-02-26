import React from "react";
import TreemapChart from "../../Components/Dashboard/TreemapChart";
import candles from "../../assets/Images/Dashboard/marketdepthpage/candles.png";
import { FaPlayCircle } from "react-icons/fa";
import { FcCandleSticks } from "react-icons/fc";
import StockCard from "../../Components/Dashboard/StockCard";
import LomShortTerm from "../../assets/Images/Dashboard/monryActionPage/LomShortTerm.png";
import LomLongTerm from "../../assets/Images/Dashboard/monryActionPage/LomLongTerm.png";
import contraction from "../../assets/Images/Dashboard/monryActionPage/Contraction.png";
import OneDayHL from "../../assets/Images/Dashboard/monryActionPage/oneDayHL.png";
import twoDayHL from "../../assets/Images/Dashboard/monryActionPage/twoDayHL.png";

const MonryActionPage = () => {
  const stockDataList = [
    {
      title: "AI Intraday Reversal (TF - 5 min)",
      img: LomShortTerm,
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
      title: "AI Swing Reversal (TF - Daily)",
      img: LomLongTerm,
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
      title: "AI Swing Reversal (TF - Daily)",
      img: LomLongTerm,
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
      title: "AI Swing Reversal (TF - Daily)",
      img: LomLongTerm,
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
      title: "AI Range Breakout (TF - Daily)",
      img: contraction,
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
      title: "Day H/L Reversal",
      img: OneDayHL,
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
      title: "2 Day H/L BO",
      img: twoDayHL,
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
      {/* // 5 MIN MOMENTUM SPIKE card  */}
      {/* <section className="dark:bg-gradient-to-br from-[#0009B2] to-[#02000E] p-px rounded-2xl mt-10">
        <div className="dark:bg-db-primary bg-db-primary-light p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <img src={candles} alt="candle" className="w-15 object-contain" />
            <div>
              <h2 className=" text-xl font-semibold flex items-center gap-2">
                5 MIN MOMENTUM SPIKE <FcCandleSticks />
              </h2>
              <p className="dark:text-gray-400  text-sm flex items-center gap-2">
                How to use <FaPlayCircle className="text-[#0256F5]" />{" "}
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  Live
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl">
            <TreemapChart />
          </div>
        </div>
      </section> */}
      {/* 
// 10 MIN MOMENTUM SPIKE card */}

      {/* <section className="dark:bg-gradient-to-br from-[#0009B2] to-[#02000E] p-px rounded-2xl mt-10">
        <div className="dark:bg-db-primary bg-db-primary-light p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <img src={candles} alt="candle" className="w-15 object-contain" />
            <div>
              <h2 className=" text-xl font-semibold flex items-center gap-2">
                10 MIN MOMENTUM SPIKE <FcCandleSticks />
              </h2>
              <p className="dark:text-gray-400 text-sm flex items-center gap-2">
                How to use <FaPlayCircle className="text-[#0256F5]" />{" "}
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  Live
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl">
            <TreemapChart />
          </div>
        </div>
      </section> */}

      {/* stock cards section */}

      <section className="grid lg:grid-cols-2 grid-col-1 gap-8 mt-10">
        {stockDataList.map((item, index) => (
          <StockCard
            key={index}
            title={item.title}
            stocks={item.stocks}
            img={item.img}
            price={item.price}
          />
        ))}
      </section>
    </>
  );
};

export default MonryActionPage;
