import React, { useEffect, useState } from "react";
import StockCard from "../../Components/Dashboard/StockCard";
import meter from "../../assets/Images/Dashboard/marketdepthpage/meter.png";
import boost from "../../assets/Images/Dashboard/marketdepthpage/boost.png";
import dayHigh from "../../assets/Images/Dashboard/marketdepthpage/dayHigh.png";


import useFetchData from "../../utils/useFetchData";
import Loader from "../../Components/Loader";
import HighPowerStock from "../../Components/Dashboard/Cards/HighPowerStock";
import {
  fetchStockData,
  usefetchDayHighData,
  usefetchDayLowData,
} from "../../hooks/fetchStocksData";
import {
  TopGainers,
  TopLoosers,
} from "../../Components/Dashboard/Cards/TopGainersAndLoosers";

import { io } from "socket.io-client";
import { DayHigh, DayLow } from "../../Components/Dashboard/Cards/DayHighandLow";

const socket = io("http://localhost:3000");

const MarketDepthPage = () => {
  const stockDataList = [
    {
      title: "High Power Stocks",
      img: meter,
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
  ];
  // const stockDataList = [
  //   {
  //     title: "High Power Stocks",
  //     img: meter,
  //     price: "purchased",
  //     stocks: [
  //       {
  //         symbol: "KPITTECH",
  //         icon: "https://via.placeholder.com/20/00FF00",
  //         percent: 2.96,
  //         turnover: 332.89,
  //       },
  //       {
  //         symbol: "ZOMATO",
  //         icon: "https://via.placeholder.com/20/FF0000",
  //         percent: 6.72,
  //         turnover: 1.94,
  //       },
  //       {
  //         symbol: "TVS MOTOR",
  //         icon: "https://via.placeholder.com/20/FFA500",
  //         percent: 5.94,
  //         turnover: 0.77,
  //       },
  //       {
  //         symbol: "SUPER MEIND",
  //         icon: "https://via.placeholder.com/20/FF4500",
  //         percent: 5.64,
  //         turnover: 1.89,
  //       },
  //       {
  //         symbol: "SUPER MEIND",
  //         icon: "https://via.placeholder.com/20/FF4500",
  //         percent: 5.64,
  //         turnover: 1.89,
  //       },
  //       {
  //         symbol: "SUPER MEIND",
  //         icon: "https://via.placeholder.com/20/FF4500",
  //         percent: 5.64,
  //         turnover: 1.89,
  //       },
  //       {
  //         symbol: "SUPER MEIND",
  //         icon: "https://via.placeholder.com/20/FF4500",
  //         percent: 5.64,
  //         turnover: 1.89,
  //       },
  //       {
  //         symbol: "SUPER MEIND",
  //         icon: "https://via.placeholder.com/20/FF4500",
  //         percent: 5.64,
  //         turnover: 1.89,
  //       },
  //       {
  //         symbol: "SUPER MEIND",
  //         icon: "https://via.placeholder.com/20/FF4500",
  //         percent: 5.64,
  //         turnover: 1.89,
  //       },
  //     ],
  //   },
  //   {
  //     title: "Intraday Boost",
  //     img: boost,
  //     price: "purchased",
  //     stocks: [
  //       {
  //         symbol: "HDFC",
  //         icon: "https://via.placeholder.com/20/008000",
  //         percent: 1.23,
  //         turnover: 125.3,
  //       },
  //       {
  //         symbol: "ICICI",
  //         icon: "https://via.placeholder.com/20/FF4500",
  //         percent: 2.45,
  //         turnover: 76.5,
  //       },
  //       {
  //         symbol: "TATA STEEL",
  //         icon: "https://via.placeholder.com/20/0000FF",
  //         percent: 3.78,
  //         turnover: 56.1,
  //       },
  //     ],
  //   },
  //   {
  //     title: "Top Level Stocks",
  //     img: dayHigh,
  //     price: "no",
  //     stocks: [
  //       {
  //         symbol: "IRCTC",
  //         icon: "https://via.placeholder.com/20/800080",
  //         percent: 4.11,
  //         turnover: 98.2,
  //       },
  //       {
  //         symbol: "YES BANK",
  //         icon: "https://via.placeholder.com/20/FFD700",
  //         percent: 1.98,
  //         turnover: 23.4,
  //       },
  //       {
  //         symbol: "BIOCON",
  //         icon: "https://via.placeholder.com/20/FF69B4",
  //         percent: 3.22,
  //         turnover: 45.8,
  //       },
  //     ],
  //   },
  //   {
  //     title: "Low Level Stocks",
  //     img: dayLow,
  //     price: "no",
  //     stocks: [
  //       {
  //         symbol: "IRCTC",
  //         icon: "https://via.placeholder.com/20/800080",
  //         percent: 4.11,
  //         turnover: 98.2,
  //       },
  //       {
  //         symbol: "YES BANK",
  //         icon: "https://via.placeholder.com/20/FFD700",
  //         percent: 1.98,
  //         turnover: 23.4,
  //       },
  //       {
  //         symbol: "BIOCON",
  //         icon: "https://via.placeholder.com/20/FF69B4",
  //         percent: 3.22,
  //         turnover: 45.8,
  //       },
  //     ],
  //   },
  //   {
  //     title: "Top Gainers",
  //     img: topGainers,
  //     price: "no",
  //     stocks: [
  //       {
  //         symbol: "IRCTC",
  //         icon: "https://via.placeholder.com/20/800080",
  //         percent: 4.11,
  //         turnover: 98.2,
  //       },
  //       {
  //         symbol: "YES BANK",
  //         icon: "https://via.placeholder.com/20/FFD700",
  //         percent: 1.98,
  //         turnover: 23.4,
  //       },
  //       {
  //         symbol: "BIOCON",
  //         icon: "https://via.placeholder.com/20/FF69B4",
  //         percent: 3.22,
  //         turnover: 45.8,
  //       },
  //     ],
  //   },
  //   {
  //     title: "Top Loosers",
  //     img: topLoosers,
  //     price: "no",
  //     stocks: [
  //       {
  //         symbol: "IRCTC",
  //         icon: "https://via.placeholder.com/20/800080",
  //         percent: 4.11,
  //         turnover: 98.2,
  //       },
  //       {
  //         symbol: "YES BANK",
  //         icon: "https://via.placeholder.com/20/FFD700",
  //         percent: 1.98,
  //         turnover: 23.4,
  //       },
  //       {
  //         symbol: "BIOCON",
  //         icon: "https://via.placeholder.com/20/FF69B4",
  //         percent: 3.22,
  //         turnover: 45.8,
  //       },
  //     ],
  //   },
  // ];

  const [turnOverData, setdata] = useState([]);
  // const { data, loading, error, fetchData } = useFetchData();

  const { TnGData, TnGLoading, TnGError, topGainersAndLosers } =
    fetchStockData();

  const { DhData, DhLoading, DhError, fetchDayHigh } = usefetchDayHighData();

  const { DlData, DlLoading,  DlError, fetchDayLow } = usefetchDayLowData()

  const [loading, setloading] = useState(null);

  useEffect(() => {
    try {
      fetchDayHigh();
      topGainersAndLosers();
      fetchDayLow();
      socket.on("turnOver", (data) => {
        // console.log("live Data", data);
        setdata(data?.data);
      });
    } catch (error) {
      console.log("error", error);
    }

    return () => socket.off("turnOver");

    // fetchData("get-turnover", "GET");
  }, []);

  // if (DlLoading) {
  //   console.log("loading");

  //   return;
  // }

  // if (DlError) {
  //   console.log(TnGError, "eeeee");
  //   return;
  // }

  // console.log("day low data", DlData);

  return (
    <section>
      <h1 className="text-3xl font-medium mt-5">Market Depth</h1>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 w-full mt-10">
        <HighPowerStock data={turnOverData} loading={loading} />

        <DayHigh data={DhData?.data?.dayHighBreak} loading={DhLoading} error={DhError} />
        <DayLow data={DlData?.data?.dayLowBreak} loading={DhLoading} error={DhError} />

        <TopGainers
          data={TnGData?.data?.topGainers}  
          loading={TnGLoading}
          error={TnGError}
        />
        <TopLoosers
          data={TnGData?.data?.topLosers}
          loading={TnGLoading}
          error={TnGError}
        />
      </div>
    </section>
  );
};

export default MarketDepthPage;
