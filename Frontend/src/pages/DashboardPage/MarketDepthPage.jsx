import React, { useEffect, useState } from "react";
import StockCard from "../../Components/Dashboard/StockCard";
import meter from "../../assets/Images/Dashboard/marketdepthpage/meter.png";

import dayHigh from "../../assets/Images/Dashboard/marketdepthpage/dayHigh.png";

import useFetchData from "../../utils/useFetchData";
import Loader from "../../Components/Loader";
import HighPowerStock from "../../Components/Dashboard/Cards/HighPowerStock";
import {
  fetchStockData,
  usefetchDayHighData,
  usefetchDayLowData,
  usefetchPreviousVolume,
} from "../../hooks/fetchStocksData";
import {
  TopGainers,
  TopLoosers,
} from "../../Components/Dashboard/Cards/TopGainersAndLoosers";

import { io } from "socket.io-client";
import {
  DayHigh,
  DayLow,
} from "../../Components/Dashboard/Cards/DayHighandLow";
import { PreviousVolume } from "../../Components/Dashboard/Cards/PreviousVolume";

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

  const [turnOverData, setTurnOverdata] = useState([]);
  // const { data, loading, error, fetchData } = useFetchData();
  const [dayHighBreakResponse, setDayHighBreakResponse] = useState([]);

  const [dayLowBreakResponse, setDayLowBreakResponse] = useState([]);

  const [getTopGainersAndLosersResponse, setGetTopGainersAndLosersResponse] =
    useState([]);

  const [previousDaysVolumeResponse, setPreviousDaysVolumeResponse] = useState(
    []
  );
  const [sectorStockDataResponse, setSectorStockDataResponse] = useState([]);

  // const { TnGData, TnGLoading, TnGError, topGainersAndLosers } =
  //   fetchStockData();

  // const { DhData, DhLoading, DhError, fetchDayHigh } = usefetchDayHighData();

  // const { DlData, DlLoading,  DlError, fetchDayLow } = usefetchDayLowData()

  // const { PVData, PvLoading,  PvError, fetchPreviousVolume } = usefetchPreviousVolume();

  const [loading, setLoading] = useState(null);
  const [error, seterror] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setLoading(true);

    //trigger socket

    let interval;

    // socket.emit("getData");


    if (!isFetching) {
      socket.emit("getMarketDepthData");
      setIsFetching(true)

    } else {
     interval =  setInterval(() => {
        socket.emit("getMarketDepthData");
      }, 50000);
    }

    let hasDataArrived = false;

    const handleTurnOver = (data) => {
      setTurnOverdata(data?.data);
      hasDataArrived = true;
      setLoading(false);
    };

    const handleDayLowBreak = (data) => {
      setDayLowBreakResponse(data?.dayLowBreak);
      hasDataArrived = true;
      setLoading(false);
    };

    const handleDayHighBreak = (data) => {
      setDayHighBreakResponse(data?.dayHighBreak);
      hasDataArrived = true;
      setLoading(false);
    };

    const handleTopGainersAndLosers = (data) => {
      setGetTopGainersAndLosersResponse(data);
      hasDataArrived = true;
      setLoading(false);
    };

    const handlePreviousDaysVolume = (data) => {
      console.log("boommmm", data);
      setPreviousDaysVolumeResponse(data?.combinedData);
      hasDataArrived = true;
      setLoading(false);
    };

    // Attach event listeners
    socket.on("turnOver", handleTurnOver);
    socket.on("dayLowBreak", handleDayLowBreak);
    socket.on("dayHighBreak", handleDayHighBreak);
    socket.on("getTopGainersAndLosers", handleTopGainersAndLosers);
    socket.on("previousDaysVolume", handlePreviousDaysVolume);

    // Set a timeout to stop loading if no data arrives
    // const timeout = setTimeout(() => {
    //   if (!hasDataArrived) {
    //     setLoading(false);
    //     console.log("No data received within the expected time.");
    //   }
    // }, 20000); // Adjust timeout duration as needed

    // Cleanup function
    return () => {
      socket.off("turnOver", handleTurnOver);
      socket.off("dayLowBreak", handleDayLowBreak);
      socket.off("dayHighBreak", handleDayHighBreak);
      socket.off("getTopGainersAndLosers", handleTopGainersAndLosers);
      socket.off("previousDaysVolume", handlePreviousDaysVolume);
      clearInterval(interval);
    };
  }, [isFetching]);

  return (
    <section>
      <h1 className="text-3xl font-medium mt-5">Market Depth</h1>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 w-full mt-10">
        <HighPowerStock data={turnOverData} loading={loading} />

        <PreviousVolume
          data={previousDaysVolumeResponse}
          loading={loading}
          error={error}
        />

        <DayHigh data={dayHighBreakResponse} loading={loading} error={error} />
        <DayLow data={dayLowBreakResponse} loading={loading} error={error} />

        <TopGainers
          data={getTopGainersAndLosersResponse?.topGainers}
          loading={loading}
          error={error}
        />
        <TopLoosers
          data={getTopGainersAndLosersResponse?.topLosers}
          loading={loading}
          error={error}
        />
      </div>
    </section>
  );
};

export default MarketDepthPage;
