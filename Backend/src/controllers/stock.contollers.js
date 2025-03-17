import MarketDetailData from "../models/marketData.model.js";
import StocksDetail from "../models/stocksDetail.model.js";

const getStocks = async (req, res) => {
  try {
    const stocks = await StocksDetail.find();

    if (!stocks) {
      return res.status(404).json({ message: "No stocks found" });
    }
    res.status(200).json(stocks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// // const fetchAndStoreFNOData = async (req,res) => {

// //     try {
// //         const fnoStocks = await StocksDetail.find()
// //         let allstocks = []

// //         for(const stocks of fnoStocks){
// //           const stocksHistoricData = await getHistoricalData(stocks.SECURITY_ID);

// //           if(!stocksHistoricData){
// //              console.log("No historic data found",stocks.SECURITY_ID);
// //              continue
// //           }

// //           allstocks.push({
// //             securityId: stocks.SECURITY_ID,
// //             historicaldata: stocksHistoricData
// //           })

// //           console.log("historic data found",stocks.SECURITY_ID);

// //         }

// //         console.log('allstock length',allstocks.length)
// //         res.status(200).json(allstocks);

// //     } catch (error) {

// //         console.log('error in get fno stocks',error.message)

// //         res.status(500).json({message:"Internal server error in get fno stocks",error:error.message});

// //     }

// // }

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// const batchSize = 5; // Fetch 5 stocks at a time
// // const fetchAndStoreFNOData = async () => {
// //   try {
// //     const fnoStocks = await StocksDetail.find();
// //     for (let i = 0; i < fnoStocks.length; i += batchSize) {
// //       const batch = fnoStocks.slice(i, i + batchSize);

// //       const promises = batch.map((stock) =>
// //         getHistoricalData(stock.SECURITY_ID)
// //       );

// //       const results = await Promise.allSettled(promises);

// //       results.forEach((result, index) => {
// //         if (result.status === "fulfilled") {
// //           console.log(`Data for ${batch[index].SECURITY_ID}:`, result.value);
// //         } else {
// //           console.log(
// //             `Error fetching ${batch[index].SECURITY_ID}:`,
// //             result.reason
// //           );
// //         }
// //       });

// //       await delay(2000); // 2-second delay between batches
// //     }
// //   } catch (error) {
// //     console.log("Error fetching stocks:", error.message);
// //   }
// // };

// const getStocksData = async (req, res) => {
//   try {
//     const yesterdayDate = new Date();
//     yesterdayDate.setDate(yesterdayDate.getDate() - 1);
//     const formattedYesterday = yesterdayDate.toISOString().split("T")[0];

//     const todayDate = new Date().toISOString().split("T")[0];

//     // Fetch today's stock data
//     const stocksData = await MarketDetailData.find({ date: todayDate });

//     // Fetch yesterday's stock data
//     const previousDayData = await MarketDetailData.find({ date: formattedYesterday });

//     if (stocksData.length === 0) {
//       return res.status(404).json({ success: false, message: "No stocks found for today" });
//     }

//     if (previousDayData.length === 0) {
//       return res.status(404).json({ success: false, message: "No stocks found for yesterday" });
//     }

//     // Convert previous day's data into a map for quick lookup by SECURITY_ID
//     const previousDayMap = new Map();
//     previousDayData.forEach((stock) => {
//       previousDayMap.set(stock.securityId, stock); // Key = SECURITY_ID, Value = Stock Object
//     });

//     // Process today's stocks
//     const response = await Promise.all(
//       stocksData.map(async (stock) => {
//         const shares = await StocksDetail.find(
//           { SECURITY_ID: stock.securityId },
//           {
//             _id: 0,
//             SECURITY_ID: 1,
//             UNDERLYING_SYMBOL: 1,
//             SYMBOL_NAME: 1,
//             DISPLAY_NAME: 1,
//           }
//         );

//         if (!shares || shares.length === 0) return null;

//         // Get yesterday's stock data (if available)
//         const previousStock = previousDayMap.get(stock.securityId);
//         const dayClose = previousStock ? previousStock?.data?.dayClose[0] : null; // Get yesterday's close price
//         const latestTradePrice = stock?.data?.latestTradedPrice[0];

//         // Calculate change percentage
//         let changePercentage = 0;
//         if (dayClose !== null && dayClose !== 0) {
//           changePercentage = (((latestTradePrice - dayClose) / dayClose) * 100).toFixed(2);
//         }

//         return shares.map((share) => ({
//           SECURITY_ID: share.SECURITY_ID,
//           UNDERLYING_SYMBOL: share.UNDERLYING_SYMBOL,
//           SYMBOL_NAME: share.SYMBOL_NAME,
//           DISPLAY_NAME: share.DISPLAY_NAME,
//           turnover: stock.turnover,
//           changePercentage: parseFloat(changePercentage),
//         }));
//       })
//     );

//     // Flatten & sort response
//     const finalResponse = response.flat().filter(Boolean);
//     const sortedData = finalResponse
//       .sort((a, b) => b.turnover - a.turnover) // Sort by turnover (descending)
//       .slice(0, 30); // Limit to top 30

//     res.status(200).json({ success: true, data: sortedData });
//   } catch (error) {
//     console.error("Error fetching stocks data:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// correct stable logic for turnover
// const getStocksData = async (req, res) => {
//   try {
//     const yesterdayDate = new Date();
//     yesterdayDate.setDate(yesterdayDate.getDate() - 1);
//     const formattedYesterday = yesterdayDate.toISOString().split("T")[0];

//     const todayDate = new Date().toISOString().split("T")[0];

//     // Fetch today's and yesterday's stock data
//     const [stocksData, previousDayData] = await Promise.all([
//       MarketDetailData.find({ date: todayDate }),
//       MarketDetailData.find({ date: formattedYesterday }),
//     ]);

//     if (!stocksData.length) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No stocks found for today" });
//     }

//     if (!previousDayData.length) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No stocks found for yesterday" });
//     }

//     // Convert previous day's data into a Map for quick lookup by SECURITY_ID
//     const previousDayMap = new Map(
//       previousDayData.map((stock) => [stock.securityId, stock])
//     );

//     const response = await Promise.all(
//       stocksData.map(async (stock) => {
//         const shares = await StocksDetail.find(
//           { SECURITY_ID: stock.securityId },
//           {
//             _id: 0,
//             SECURITY_ID: 1,
//             UNDERLYING_SYMBOL: 1,
//             SYMBOL_NAME: 1,
//             DISPLAY_NAME: 1,
//           }
//         );

//         if (!shares.length) return [];

//         // Get yesterday's stock data (if available)
//         const previousStock = previousDayMap.get(stock.securityId);
//         const dayClose = previousStock?.data?.dayClose?.[0] ?? null;
//         const latestTradePrice = stock?.data?.latestTradedPrice?.[0];

//         let changePercentage = 0;
//         if (dayClose !== null && dayClose !== 0) {
//           changePercentage = (
//             ((latestTradePrice - dayClose) / dayClose) *
//             100
//           ).toFixed(2);
//         }

//         return shares.map((share) => ({
//           SECURITY_ID: share.SECURITY_ID,
//           UNDERLYING_SYMBOL: share.UNDERLYING_SYMBOL,
//           SYMBOL_NAME: share.SYMBOL_NAME,
//           DISPLAY_NAME: share.DISPLAY_NAME,
//           turnover: stock.turnover,
//           changePercentage: parseFloat(changePercentage),
//         }));
//       })
//     );

//     const sortedData = response
//       .flat()
//       .sort((a, b) => b.changePercentage - a.changePercentage)
//       .slice(0, 30);

//     res.status(200).json({ success: true, data: sortedData });
//   } catch (error) {
//     console.error("Error fetching stocks data:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// new logic that return previous data if today data not avail
const getStocksData = async (req, res) => {
  try {
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date");

    if (!latestEntry) {
      return { success: false, message: "No stock data available" };
      // return res.status(404).json({ success: false, message: "No stock data available" });
    }

    const latestDate = latestEntry.date;
    // console.log("Latest available date:", latestDate);

    // Step 2: Fetch all stock data for the latest available date
    const stocksData = await MarketDetailData.find({ date: latestDate });

    if (!stocksData.length) {
      return res.status(404).json({
        success: false,
        message: "No stock data available for the latest date",
      });
    }

    // console.log("Total entries found for latest date:", stocksData.length);

    // Step 3: Find the most recent previous available date
    const previousDayEntry = await MarketDetailData.findOne(
      { date: { $lt: latestDate } },
      { date: 1 }
    ).sort({ date: -1 });

    if (!previousDayEntry) {
      return { success: false, message: "No previous stock data available" };
      // return res.status(404).json({ success: false, message: "No previous stock data available" });
    }

    const previousDayDate = previousDayEntry.date;
    // console.log("Previous available date:", previousDayDate);

    // Fetch previous day's stock data
    const previousDayData = await MarketDetailData.find({
      date: previousDayDate,
    });
    const previousDayMap = new Map(
      previousDayData.map((stock) => [stock.securityId, stock])
    );

    // Step 4: Fetch stock details
    const stockIds = stocksData.map((entry) => entry.securityId);
    const stockDetailsMap = new Map();

    const stockDetails = await StocksDetail.find(
      { SECURITY_ID: { $in: stockIds } },
      {
        _id: 0,
        SECURITY_ID: 1,
        UNDERLYING_SYMBOL: 1,
        SYMBOL_NAME: 1,
        DISPLAY_NAME: 1,
        INDEX: 1,
        SECTOR: 1,
      }
    );

    stockDetails.forEach((stock) => {
      stockDetailsMap.set(stock.SECURITY_ID, stock);
    });

    // Step 5: Compute stock data with changes
    const response = stocksData.map((stock) => {
      const stockDetail = stockDetailsMap.get(stock.securityId) || {};
      const previousStock = previousDayMap.get(stock.securityId);
      const dayClose = previousStock?.data?.dayClose?.[0] ?? null;
      const latestTradePrice = stock?.data?.latestTradedPrice?.[0];

      //change Percentage logic

      let changePercentage = 0;
      if (dayClose !== null && dayClose !== 0) {
        changePercentage = (
          ((latestTradePrice - dayClose) / dayClose) *
          100
        ).toFixed(2);
      }

      return {
        SECURITY_ID: stock.securityId,
        INDEX: stockDetail.INDEX || "N/A",
        SECTOR: stockDetail.SECTOR || "N/A",
        UNDERLYING_SYMBOL: stockDetail.UNDERLYING_SYMBOL || "N/A",
        SYMBOL_NAME: stockDetail.SYMBOL_NAME || "N/A",
        DISPLAY_NAME: stockDetail.DISPLAY_NAME || "N/A",
        turnover: stock.turnover,
        changePercentage: parseFloat(changePercentage),
      };
    });

    // Sort by turnover and return top 30 stocks
    const sortedData = response
      .sort((a, b) => b.turnover - a.turnover)
      .slice(0, 30);

    return { success: true, message: "Stock data retrieved", data: sortedData };

    // res.status(200).json();
  } catch (error) {
    console.error("Error fetching stocks data:", error);
    return {
      success: false,
      message: "Internal server error",
      erro: error.message,
    };
    // res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// not give yesterday data
// const getTopGainersAndLosers = async (req, res) => {
//   try {
//     const todayDate = new Date().toISOString().split("T")[0];
//     const yesterdayDate = new Date();
//     yesterdayDate.setDate(yesterdayDate.getDate() - 1);
//     const formattedYesterday = yesterdayDate.toISOString().split("T")[0];

//     const todayData = await MarketDetailData.find({ date: todayDate });
//     const yesterdayData = await MarketDetailData.find({
//       date: formattedYesterday,
//     });

//     if (todayData.length === 0 || yesterdayData.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "Not enough data to calculate gainers & losers" });
//     }

//     const yesterdayMap = new Map();
//     yesterdayData.forEach((entry) => {
//       yesterdayMap.set(entry.securityId, entry.data?.dayClose || 0);
//     });

//     const gainers = [];
//     const losers = [];

//     const stockIds = todayData.map((entry) => entry.securityId);
//     const stockDetailsMap = new Map();

//     const stockDetails = await StocksDetail.find(
//       { SECURITY_ID: { $in: stockIds } },
//       { UNDERLYING_SYMBOL: 1, SYMBOL_NAME: 1, SECURITY_ID: 1 }
//     );

//     stockDetails.forEach((stock) => {
//       stockDetailsMap.set(stock.SECURITY_ID, stock);
//     });

//     todayData.forEach((todayEntry) => {
//       const prevClose = yesterdayMap.get(todayEntry.securityId);
//       if (!prevClose || prevClose === 0) return;

//       const latestPrice = todayEntry.data?.latestTradedPrice || 0;
//       if (latestPrice === 0) return;

//       const percentageChange = ((latestPrice[0] - prevClose) / prevClose) * 100;
//       const stockDetail = stockDetailsMap.get(todayEntry.securityId) || {};

//       const result = {
//         securityId: todayEntry.securityId,
//         stockSymbol: stockDetail.UNDERLYING_SYMBOL || "N/A",
//         stockName: stockDetail.SYMBOL_NAME || "N/A",
//         lastTradePrice: latestPrice,
//         previousClosePrice: prevClose,
//         percentageChange: percentageChange.toFixed(2),
//       };

//       if (percentageChange > 0) {
//         gainers.push(result);
//       } else {
//         losers.push(result);
//       }
//     });

//     gainers.sort((a, b) => b.percentageChange - a.percentageChange);
//     losers.sort((a, b) => a.percentageChange - b.percentageChange);

//     res.status(200).json({
//       topGainers: gainers.slice(0, 10),
//       topLosers: losers.slice(0, 10),
//     });
//   } catch (error) {
//     console.error("Error fetching top gainers & losers:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

//this controller give data if today data not avail it return yesterday data
const getTopGainersAndLosers = async (req, res) => {
  try {
    // Step 1: Find the most recent available date
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 }) // Get the latest date
      .select("date");

    if (!latestEntry) {
      return res.status(404).json({ message: "No stock data available" });
    }

    const latestDate = latestEntry.date;
    console.log("Latest available date:", latestDate);

    // Step 2: Fetch all data for the latest available date
    const latestData = await MarketDetailData.find({ date: latestDate });

    if (latestData.length === 0) {
      return res
        .status(404)
        .json({ message: "No stock data available for the latest date" });
    }

    console.log("Total entries found for latest date:", latestData.length);

    // Step 3: Find the most recent previous available date
    const previousDayEntry = await MarketDetailData.findOne(
      { date: { $lt: latestDate } },
      { date: 1 }
    ).sort({ date: -1 });

    if (!previousDayEntry) {
      return res
        .status(404)
        .json({ message: "No previous stock data available" });
    }

    const previousDayDate = previousDayEntry.date;
    console.log("Previous available date:", previousDayDate);

    // Fetch previous day's stock data
    const yesterdayData = await MarketDetailData.find({
      date: previousDayDate,
    });

    // Step 4: Map previous day's closing prices
    const yesterdayMap = new Map();
    yesterdayData.forEach((entry) => {
      yesterdayMap.set(entry.securityId, entry.data?.dayClose || 0);
    });

    const gainers = [];
    const losers = [];

    // Step 5: Get stock details
    const stockIds = latestData.map((entry) => entry.securityId);
    const stockDetailsMap = new Map();

    const stockDetails = await StocksDetail.find(
      { SECURITY_ID: { $in: stockIds } },
      {
        UNDERLYING_SYMBOL: 1,
        SYMBOL_NAME: 1,
        SECURITY_ID: 1,
        INDEX: 1,
        SECTOR: 1,
      }
    );

    stockDetails.forEach((stock) => {
      stockDetailsMap.set(stock.SECURITY_ID, stock);
    });

    // Step 6: Compute gainers & losers
    latestData.forEach((todayEntry) => {
      const prevClose = yesterdayMap.get(todayEntry.securityId);
      if (!prevClose || prevClose === 0) return;

      const latestPrice = todayEntry.data?.latestTradedPrice || 0;
      if (latestPrice === 0) return;

      const percentageChange = ((latestPrice[0] - prevClose) / prevClose) * 100;
      const stockDetail = stockDetailsMap.get(todayEntry.securityId) || {};

      const result = {
        securityId: todayEntry.securityId,
        stockSymbol: stockDetail.UNDERLYING_SYMBOL || "N/A",
        stockName: stockDetail.SYMBOL_NAME || "N/A",
        sector: stockDetail.SECTOR || "N/A",
        index: stockDetail.INDEX || "N/A",
        lastTradePrice: latestPrice,
        previousClosePrice: prevClose,
        percentageChange: percentageChange.toFixed(2),
        turnover: todayEntry.turnover,
        xElement: todayEntry.xelement,
      };

      if (percentageChange > 0) {
        gainers.push(result);
      } else {
        losers.push(result);
      }
    });

    gainers.sort((a, b) => b.percentageChange - a.percentageChange);
    losers.sort((a, b) => a.percentageChange - b.percentageChange);

    res.status(200).json({
      topGainers: gainers.slice(0, 30),
      topLosers: losers.slice(0, 30),
    });
  } catch (error) {
    console.error("Error fetching top gainers & losers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// not give previous data if not avail
// const getDayHighBreak = async (req, res) => {
//   try {
//     const todayDate = new Date().toISOString().split("T")[0];

//     const todayData = await MarketDetailData.find({ date: todayDate });
//     const stocksDetail = await StocksDetail.find();

//     if (todayData.length === 0 || !stocksDetail) {
//       return res
//         .status(404)
//         .json({ message: "Not enough data to calculate day high break" });
//     }

//     let filteredData = todayData.map((data) => ({
//       latestPrice: parseFloat(data.data.latestTradedPrice[0].toFixed(2)),
//       dayHigh: parseFloat(data.data.dayHigh[0].toFixed(2)),
//       securityId: data.securityId,
//     }));

//     const dayHighBreak = filteredData
//       .map((data) => {
//         const changePrice = data.dayHigh * 0.005;
//         const latestPrice = data.latestPrice;
//         const dayHigh = data.dayHigh;

//         if (latestPrice >= dayHigh - changePrice) {
//           const stock = stocksDetail.find(
//             (stock) => stock.SECURITY_ID === data.securityId
//           );

//           if (stock) {
//             const {
//               _id,
//               createdAt,
//               updatedAt,
//               SECURITY_ID,
//               __v,
//               ...filteredStock
//             } = stock.toObject();

//             const percentageDifference = (
//               ((latestPrice - dayHigh) / dayHigh) *
//               100
//             ).toFixed(2);

//             return { ...data, stock: filteredStock, percentageDifference };
//           }
//         }
//         return null;
//       })
//       .filter(Boolean)
//       .sort((a, b) => b.percentageDifference - a.percentageDifference);

//     console.log("dayHighBreak : ", dayHighBreak);
//     res.status(200).json({ dayHighBreak });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// give the previous data if today data not avail
const getDayHighBreak = async (req, res) => {
  try {
    // Step 1: Find the most recent date available in the database
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 }) // Get the latest date
      .select("date");

    if (!latestEntry) {
      return res
        .status(404)
        .json({ message: "Not enough data to calculate day high break" });
    }

    const latestDate = latestEntry.date;
    // console.log("Latest available date:", latestDate);

    // Step 2: Fetch all entries that match this date
    const todayData = await MarketDetailData.find({ date: latestDate });

    if (todayData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data available for the latest saved date" });
    }

    // console.log("Total entries found for latest date:", todayData.length);

    const stocksDetail = await StocksDetail.find();

    if (!stocksDetail) {
      return res
        .status(404)
        .json({ message: "Not enough data to calculate day high break" });
    }

    let filteredData = todayData.map((data) => ({
      latestPrice: parseFloat(data.data.latestTradedPrice[0].toFixed(2)),
      dayHigh: parseFloat(data.data.dayHigh[0].toFixed(2)),
      securityId: data.securityId,
      turnover: data.turnover,
      xElement: data.xelement,
    }));
    console.log("today data", todayData);
    const dayHighBreak = filteredData
      .map((data) => {
        const changePrice = data.dayHigh * 0.005;
        const latestPrice = data.latestPrice;
        const dayHigh = data.dayHigh;

        if (latestPrice >= dayHigh - changePrice) {
          const stock = stocksDetail.find(
            (stock) => stock.SECURITY_ID === data.securityId
          );

          if (stock) {
            const {
              _id,
              createdAt,
              updatedAt,
              SECURITY_ID,
              __v,
              ...filteredStock
            } = stock.toObject();

            const percentageDifference = (
              ((latestPrice - dayHigh) / dayHigh) *
              100
            ).toFixed(2);

            return { ...data, stock: filteredStock, percentageDifference };
          }
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.percentageDifference - a.percentageDifference);

    // console.log("dayHighBreak:", dayHighBreak);
    res.status(200).json({ dayHighBreak });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// not give previous data if not avail
// const getDayLowBreak = async (req, res) => {
//   try {
//     const todayDate = new Date().toISOString().split("T")[0];
//     const todayData = await MarketDetailData.find({ date: todayDate });
//     const stocksDetail = await StocksDetail.find();

//     if (todayData.length === 0 || !stocksDetail) {
//       return res
//         .status(404)
//         .json({ message: "Not enough data to calculate day low break" });
//     }

//     let filteredData = todayData.map((data) => ({
//       latestPrice: parseFloat(data.data.latestTradedPrice[0].toFixed(2)),
//       dayLow: parseFloat(data.data.dayLow[0].toFixed(2)),
//       securityId: data.securityId,
//     }));

//     const dayLowBreak = filteredData
//       .map((data) => {
//         const changePrice = data.dayLow * 0.005; // 0.5% of dayLow
//         const latestPrice = data.latestPrice;
//         const dayLow = data.dayLow;

//         if (latestPrice <= dayLow + changePrice) {
//           const stock = stocksDetail.find(
//             (stock) => stock.SECURITY_ID === data.securityId
//           );

//           if (stock) {
//             const {
//               _id,
//               createdAt,
//               updatedAt,
//               SECURITY_ID,
//               __v,
//               ...filteredStock
//             } = stock.toObject();

//             const percentageDifference = (
//               ((latestPrice - dayLow) / dayLow) *
//               100
//             ).toFixed(2);

//             // This check is redundant now, but you can keep it for clarity
//             if (percentageDifference <= 0.5) {
//               return { ...data, stock: filteredStock, percentageDifference };
//             }
//           }
//         }
//         return null;
//       })
//       .filter(Boolean)
//       .sort((a, b) => a.percentageDifference - b.percentageDifference);

//     console.log("dayLowBreak : ", dayLowBreak);
//     res.status(200).json({ dayLowBreak });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// give the previous data if today data not avail
const getDayLowBreak = async (req, res) => {
  try {
    // Step 1: Find the most recent date available in the database
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 }) // Get the latest date
      .select("date");

    if (!latestEntry) {
      return res
        .status(404)
        .json({ message: "Not enough data to calculate day low break" });
    }

    const latestDate = latestEntry.date;
    // console.log("Latest available date:", latestDate);

    // Step 2: Fetch all entries that match this date
    const todayData = await MarketDetailData.find({ date: latestDate });

    if (todayData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data available for the latest saved date" });
    }

    // console.log("Total entries found for latest date:", todayData.length);

    const stocksDetail = await StocksDetail.find();

    if (!stocksDetail) {
      return res
        .status(404)
        .json({ message: "Not enough data to calculate day low break" });
    }

    let filteredData = todayData.map((data) => ({
      latestPrice: parseFloat(data.data.latestTradedPrice[0].toFixed(2)),
      dayLow: parseFloat(data.data.dayLow[0].toFixed(2)),
      securityId: data.securityId,
      turnover: data.turnover,
      xElement: data.xelement,
    }));

    const dayLowBreak = filteredData
      .map((data) => {
        const changePrice = data.dayLow * 0.005; // 0.5% of dayLow
        const latestPrice = data.latestPrice;
        const dayLow = data.dayLow;

        if (latestPrice <= dayLow + changePrice) {
          const stock = stocksDetail.find(
            (stock) => stock.SECURITY_ID === data.securityId
          );

          if (stock) {
            const {
              _id,
              createdAt,
              updatedAt,
              SECURITY_ID,
              __v,
              ...filteredStock
            } = stock.toObject();

            const percentageDifference = (
              ((latestPrice - dayLow) / dayLow) *
              100
            ).toFixed(2);

            return { ...data, stock: filteredStock, percentageDifference };
          }
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.percentageDifference - b.percentageDifference);

    // console.log("dayLowBreak:", dayLowBreak);
    res.status(200).json({ dayLowBreak });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// not give previous data if not avail
// const previousDaysVolume = async (req, res) => {
//   try {
//     const todayDate = new Date().toISOString().split("T")[0];
//     const todayData = await MarketDetailData.find({ date: todayDate });
//     const previousData = await MarketDetailData.find({
//       date: { $lt: todayDate },
//     });
//     const stocksDetail = await StocksDetail.find();

//     if (!todayData || !previousData) {
//       return res.status(404).json({ success: false, message: "no data found" });
//     }

//     // Build a lookup map for previous volumes by securityId.
//     // Each key will have an array of volumes from the last 10 days.
//     let previousVolumesMap = {};

//     previousData.forEach((data) => {
//       const securityId = data.securityId;
//       const volume = data.data.volume;

//       if (!previousVolumesMap[securityId]) {
//         previousVolumesMap[securityId] = [];
//       }
//       previousVolumesMap[securityId].push(volume);
//     });

//     // Combine today's data with previous volumes.
//     // For each stock in todayData (190 entries), we create an object that contains:
//     // - securityId
//     // - todayVolume (from today's data)
//     // - volumeHistory (array of previous volumes for that stock)
//     const combinedData = todayData.map((data) => {
//       const securityId = data.securityId;
//       const todayVolume = data.data.volume[0];
//       const volumeHistory = previousVolumesMap[securityId] || [];
//       let add = 0;
//       volumeHistory.map((volume) => {
//         add = add + volume[0];
//       });
//       const avragePreviousVolume = add / volumeHistory.length;
//       const xElement = todayVolume / avragePreviousVolume;
//       const stock = stocksDetail.find(
//         (stock) => stock.SECURITY_ID === data.securityId
//       );

//       return {
//         securityId,
//         todayVolume,
//         volumeHistory,
//         stock,
//         avragePreviousVolume,
//         xElement,
//       };
//     });
//     res.status(200).json({ success: true, combinedData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// give the previous data if today data not avail
const previousDaysVolume = async (req, res) => {
  try {
    // Get the most recent available stock data date
    const latestEntry = await MarketDetailData.findOne({}, { date: 1 }).sort({
      date: -1,
    });

    if (!latestEntry) {
      return res
        .status(404)
        .json({ success: false, message: "No stock data available" });
    }

    const latestDate = latestEntry.date;

    // Fetch today's data (latest available)
    const todayData = await MarketDetailData.find({ date: latestDate });

    // Fetch all previous stock data (before latest date)
    const previousData = await MarketDetailData.find({
      date: { $lt: latestDate },
    });

    if (!previousData.length) {
      return res
        .status(404)
        .json({ success: false, message: "No previous stock data available" });
    }

    // Fetch stock details once
    const stocksDetail = await StocksDetail.find();

    // Build a lookup map for previous volumes by securityId
    let previousVolumesMap = {};
    previousData.forEach(({ securityId, data }) => {
      const volume = data?.volume?.[0] || 0;
      if (!previousVolumesMap[securityId]) {
        previousVolumesMap[securityId] = [];
      }
      previousVolumesMap[securityId].push(volume);
    });

    let bulkUpdates = [];
    const combinedData = todayData.map(({ securityId, data }) => {
      const todayVolume = data?.volume?.[0] || 0;
      const volumeHistory = previousVolumesMap[securityId] || [];
      const todayopen = data?.dayOpen;
      const latestTradedPrice = data?.latestTradedPrice;

      const percentageChange = todayopen
        ? ((latestTradedPrice - todayopen) / todayopen) * 100
        : 0;

      const totalPreviousVolume = volumeHistory.reduce(
        (sum, vol) => sum + vol,
        0
      );
      const averagePreviousVolume = volumeHistory.length
        ? totalPreviousVolume / volumeHistory.length
        : 0;

      // Calculate xElement (today's volume divided by average previous volume)
      const xElement =
        averagePreviousVolume > 0 ? todayVolume / averagePreviousVolume : 0;

      bulkUpdates.push({
        updateOne: {
          filter: { securityId, date: latestDate },
          update: { $set: { xelement: xElement } },
        },
      });

      const stock = stocksDetail.find(
        (stock) => stock.SECURITY_ID === securityId
      );

      return {
        securityId,
        todayVolume,
        volumeHistory,
        stock,
        totalPreviousVolume,
        averagePreviousVolume,
        xElement,
        percentageChange,
      };
    });

    // Perform batch update in a single query
    if (bulkUpdates.length > 0) {
      await MarketDetailData.bulkWrite(bulkUpdates);
    }

    res.status(200).json({ success: true, combinedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const sectorStockData = async (req, res) => {
  try {
    // 1️⃣ Find the latest stock entry date
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date");
    if (!latestEntry)
      return res.status(404).json({ message: "No stock data available" });

    const latestDate = latestEntry.date;
    console.log("Latest available date:", latestDate);

    // 2️⃣ Get latest stock data for the latest date
    const latestData = await MarketDetailData.find({ date: latestDate });
    if (latestData.length === 0) {
      return res
        .status(404)
        .json({ message: "No stock data available for the latest date" });
    }
    console.log("Total entries found for latest date:", latestData.length);

    // 3️⃣ Find previous day's stock data
    const previousDayEntry = await MarketDetailData.findOne({
      date: { $lt: latestDate },
    }).sort({ date: -1 });
    if (!previousDayEntry)
      return res
        .status(404)
        .json({ message: "No previous stock data available" });

    const previousDayDate = previousDayEntry.date;
    console.log("Previous available date:", previousDayDate);

    const yesterdayData = await MarketDetailData.find({
      date: previousDayDate,
    });

    // 4️⃣ Create a map of yesterday's closing prices
    const yesterdayMap = new Map();
    yesterdayData.forEach((entry) => {
      yesterdayMap.set(entry.securityId, entry.data?.dayClose || 0);
    });

    // 5️⃣ Fetch stock details (sector, index, etc.)
    const stocksDetail = await StocksDetail.find();
    if (!stocksDetail) {
      return res.status(404).json({ message: "No stock details available" });
    }

    // 6️⃣ Create a stock details map
    const stockmap = new Map();
    stocksDetail.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
        INDEX: entry.INDEX || [],
        SECTOR: entry.SECTOR || [],
        UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL,
      });
    });

    // 7️⃣ Process stock data
    const combinedData = latestData.map((entry) => {
      const { securityId, data, xelement } = entry;
      const todayopen = data?.dayOpen || 0;
      const latestTradedPrice = data?.latestTradedPrice || 0;
      const yesterdayClose = yesterdayMap.get(securityId) || 0;
      const stockdata = stockmap.get(securityId) || { INDEX: [], SECTOR: [] };
      console.log("stockdata:", stockdata);
      // Ensure INDEX and SECTOR are always arrays
      const sectors = Array.isArray(stockdata.SECTOR)
        ? stockdata.SECTOR
        : [stockdata.SECTOR];
      const indices = Array.isArray(stockdata.INDEX)
        ? stockdata.INDEX
        : [stockdata.INDEX];

      // Calculate percentage change
      const percentageChange = todayopen
        ? ((latestTradedPrice - todayopen) / todayopen) * 100
        : 0;

      return {
        securityId,
        yesterdayClose,
        percentageChange,
        xelement,
        ...stockdata,
        SECTOR: sectors.filter(Boolean), // Remove null/undefined values
        INDEX: indices.filter(Boolean), // Remove null/undefined values
      };
    });

    // 8️⃣ Organize data sector-wise and index-wise
    const sectorWiseData = {};
    const indexWiseData = {};

    combinedData.forEach((stock) => {
      // Categorize by SECTOR
      stock.SECTOR.forEach((sector) => {
        if (!sectorWiseData[sector]) sectorWiseData[sector] = [];
        sectorWiseData[sector].push(stock);
      });

      // Categorize by INDEX
      stock.INDEX.forEach((index) => {
        if (!indexWiseData[index]) indexWiseData[index] = [];
        indexWiseData[index].push(stock);
      });

      // Handle stocks with no sector
      if (stock.SECTOR.length === 0) {
        if (!sectorWiseData["Uncategorized"])
          sectorWiseData["Uncategorized"] = [];
        sectorWiseData["Uncategorized"].push(stock);
      }

      // Handle stocks with no index
      if (stock.INDEX.length === 0) {
        if (!indexWiseData["Uncategorized"])
          indexWiseData["Uncategorized"] = [];
        indexWiseData["Uncategorized"].push(stock);
      }
    });

    // 9️⃣ Send response
    res.status(200).json({
      success: true,
      latestDate,
      previousDayDate,
      sectorWiseData,
      indexWiseData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  getStocks,
  getStocksData,
  getTopGainersAndLosers,
  getDayHighBreak,
  getDayLowBreak,
  previousDaysVolume,
  sectorStockData,
};
