import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import { FcCandleSticks } from "react-icons/fc";
import { GoDotFill } from "react-icons/go";
import TreemapChart from "../../Components/Dashboard/TreemapChart";
import AISectorChart from "../../Components/Dashboard/AISectorChart";
import StockCard from "../../Components/Dashboard/StockCard";

const AiSectorDepthPage = () => {
  const stockDataList = [
    {
      title: "Nifty 50",
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
      ],
    },
    {
      title: "Bank",
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
      title: "Auto",
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
      title: "Fin Services",
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
      title: "FMCG",
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
      title: "IT",
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
      title: "Media",
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
      title: "Metal",
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
      title: "Pharma",
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
      title: "PSu Bank",
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
      title: "Pvt Bank",
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
      title: "Reality",
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
      title: "Energy",
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
      title: "Cement",
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
      title: "Nifty Mid Select",
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
      title: "Sensex",
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
      <section className="mt-8 bg-gradient-to-br from-[#00078F] to-[#01071C] p-px rounded-lg h-auto">
        <div className="bg-[#01071C] rounded-lg p-2 h-auto">
          <div className="flex gap-4 items-center">
            <h1 className="text-3xl font-bold">AI Sector Depth</h1>
            <span className="text-xl">
              <FcCandleSticks />
            </span>
            <span className="flex items-center gap-1">
              How to use <FaPlayCircle className="text-[#0256F5]" />
            </span>
            <span className="flex items-center px-2 py-px rounded-full w-fit bg-[#0256F5] text-xs">
              <GoDotFill />
              Live
            </span>
          </div>

          {/* graphs */}
          <div className="grid grid-cols-3 gap-8 w-full auto-rows-min mt-8">
            {[
              "Energy",
              "Auto",
              "Nifty 50",
              "IT",
              "Reality",
              "Nifty Mid Select",
              "Cement",
              "Pharma",
              "FMCG",
              "PSU Bank",
              "Bank",
              "Sensex",
              "Metal",
              "Media",
              "Pvt Bank",
              "Fin Service",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#00078F] to-[#01071C] p-px rounded-lg "
              >
                <div className="bg-[#000A2D] rounded-lg p-2">
                  <p className="text-xl font-semibold mb-2">{item}</p>
                  <div className="h-[350px] rounded">
                    <TreemapChart />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 bg-gradient-to-br from-[#00078F] to-[#01071C] p-px rounded-lg">
        <div className="bg-[#000517] rounded-lg p-2">
          <div className="flex gap-4 items-center mb-4">
            <h2 className="text-2xl font-semibold mb-2">AI Sector Depth</h2>
            <span className="flex items-center gap-1">
              {" "}
              <GoDotFill className="text-[#0256F5]" /> Active
            </span>
            <span className="flex items-center gap-1">
              How to use <FaPlayCircle className="text-[#0256F5]" />
            </span>
          </div>
          <div className="w-fullbg-gradient-to-br from-[#00078F] to-[#01071C] p-px rounded-lg">
            <AISectorChart />
          </div>
        </div>
      </section>

      {/* shares card */}

      <section className="mt-8">
        <div className="grid grid-cols-2 gap-4">
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
    </>
  );
};

export default AiSectorDepthPage;
