// ------------------------ TMP CODE FOR LIVE MARKET FEED ------------------------

import connectDB from "./src/config/db.js";
import MarketDetailData from "./src/models/marketData.model.js";
import StocksDetail from "./src/models/stocksDetail.model.js";
import { fetchHistoricalDataforTenMin } from "./src/utils/fetchData.js";

// import WebSocket from "ws";
// import parseBinaryData from "../utils/parseBinaryData.js";
// import MarketData from "../models/marketData.model.js";
// import StocksDetail from "../models/stocksDetail.model.js";

// const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;
// const CLIENT_ID = process.env.DHAN_CLIENT_ID;
// const WS_URL = `wss://api-feed.dhan.co?version=2&token=${ACCESS_TOKEN}&clientId=${CLIENT_ID}&authType=2`;

// let securityIdList = [];
// const securityIdMap = new Map(); // Store batch index → Security IDs mapping

// // Fetch security IDs from database
// const fetchSecurityIds = async () => {
//   try {
//     const stocks = await StocksDetail.find();
//     securityIdList = stocks.map((stock) => stock.SECURITY_ID);
//   } catch (error) {
//     console.error("Error fetching security IDs:", error);
//     throw error;
//   }
// };

// // Function to split security IDs into batches of 100
// const splitIntoBatches = (array, batchSize) => {
//   const batches = [];
//   for (let i = 0; i < array.length; i += batchSize) {
//     batches.push(array.slice(i, i + batchSize));
//   }
//   return batches;
// };

// async function startWebSocket() {
//   console.log("🔄 Fetching security IDs...");

//   await fetchSecurityIds();

//   console.log("Fetched Security IDs:", securityIdList);

//   if (securityIdList.length === 0) {
//     console.error("❌ No security IDs found. WebSocket will not start.");
//     return;
//   }

//   // Split security IDs into batches of 100
//   const securityIdBatches = splitIntoBatches(securityIdList, 100);

//   const ws = new WebSocket(WS_URL, {
//     perMessageDeflate: false,
//     maxPayload: 1024 * 1024,
//   });

//   ws.on("open", () => {
//     console.log("✅ Connected to Dhan WebSocket");

//     // Send batches sequentially with a delay
//     securityIdBatches.forEach((batch, batchIndex) => {
//       setTimeout(() => {
//         securityIdMap.set(batchIndex, batch); // Store batch → Security IDs mapping

//         const subscriptionRequest = {
//           RequestCode: 21,
//           InstrumentCount: batch.length,
//           InstrumentList: batch.map((securityId) => ({
//             ExchangeSegment: "NSE_EQ",
//             SecurityId: securityId,
//           })),
//         };

//         ws.send(JSON.stringify(subscriptionRequest));
//         console.log(
//           `📩 Sent Subscription Request for Batch ${batchIndex + 1}:`,
//           subscriptionRequest
//         );
//       }, batchIndex * 5000); // Adding delay between batches (2 seconds)
//     });
//   });

//   ws.on("message", async (data) => {
//     console.log("🔹 Raw Binary Data Received");

//     try {
//       const marketData = parseBinaryData(data);
//       if (marketData) {
//         // const securityIds = [...securityIdMap.values()].flat();
//         // const assignedSecurityId = securityIds[0] || "UNKNOWN"; // Assign the first from the batch

//         console.log(`✅ Processed Data:`, marketData);

//         // Save with mapped Security ID
//         // await MarketData.create({
//         //   ...marketData,
//         //   SecurityId: assignedSecurityId,
//         // });

//         // console.log(
//         //   `💾 Data for Security ID  saved to MongoDB`
//         // );
//       } else {
//         console.warn("⚠️ No valid market data received.");
//       }
//     } catch (error) {
//       console.error("❌ Error processing market data:", error);
//     }
//   });

//   ws.on("error", (error) => {
//     console.error("❌ WebSocket Error:", error);
//   });

//   ws.on("close", () => {
//     console.log("❌ WebSocket Disconnected. Reconnecting...");
//     setTimeout(startWebSocket, 2000);
//   });
// }

// export default startWebSocket;

// ----------------- TMP CODE FOR DAILY RANGE BREAKOUT -----------------

// const DailyRangeBreakout = async (req, res) => {
//   try {
//     const latestEntry = await MarketDetailData.findOne()
//       .sort({ date: -1 })
//       .select("date")
//       .limit(1);

//     if (!latestEntry) {
//       return res.status(404).json({ message: "No stock data available" });
//     }

//     const latestDate = latestEntry.date;
//     const tomorrow = new Date(latestDate);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const previousDate = new Date(latestDate);
//     previousDate.setDate(previousDate.getDate() - 1);
//     const previousFormatted = previousDate.toISOString().split("T")[0];

//     const previousFiveDaysDate = new Date(latestDate);
//     previousFiveDaysDate.setDate(previousFiveDaysDate.getDate() - 30); // Fetch 30 days to ensure enough data

//     const previousFiveDaysDateFormatted = previousFiveDaysDate
//       .toISOString()
//       .split("T")[0];
//     const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

//     const data = await getDailyData(
//       previousFiveDaysDateFormatted,
//       tomorrowFormatted
//     );

//     if (!data || !(data instanceof Map)) {
//       return res.status(400).json({ message: "Invalid data format" });
//     }

//     const dataArray = Array.from(data.values());
//     if (dataArray.length === 0) {
//       return res.status(404).json({ message: "No data found" });
//     }
//     // Fetch stock details
//     const stocks = await StocksDetail.find(
//       {},
//       { SECURITY_ID: 1, SYMBOL_NAME: 1, UNDERLYING_SYMBOL: 1, _id: 0 }
//     );
//     if (!stocks || stocks.length === 0) {
//       return res.status(404).json({ message: "No stocks data found" });
//     }

//     const stockMap = new Map();
//     stocks.forEach((entry) => {
//       stockMap.set(entry.SECURITY_ID, {
//         UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL || "N/A",
//         SYMBOL_NAME: entry.SYMBOL_NAME || "N/A",
//       });
//     });

//     const latestData = await MarketDetailData.find(
//       { date: latestDate },
//       {
//         "data.latestTradedPrice": 1,
//         "data.dayOpen": 1,
//         "data.dayClose": 1,
//         "data.dayHigh": 1,
//         "data.dayLow": 1,
//         securityId: 1,
//         _id: 0,
//       }
//     );
//     if (latestData.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No stock data available for the latest date" });
//     }

//     const preDayClose = await MarketDetailData.find(
//       { date: previousFormatted },
//       {
//         "data.dayClose": 1,
//         securityId: 1,
//         _id: 0,
//       }
//     );

//     if (preDayClose.length === 0) {
//       return res.status(404).json({
//         message: `No stock data available for the previous date today ${latestDate} pre ${previousFormatted}`,
//       });
//     }

//     const latestDataMap = new Map();
//     latestData.forEach((entry) => {
//       latestDataMap.set(entry.securityId, {
//         latestTradedPrice: entry.data?.latestTradedPrice?.[0],
//         dayOpen: entry.data[0]?.dayOpen ?? 0,
//         dayClose: entry.data[0]?.dayClose ?? 0,
//         dayHigh: entry.data[0]?.dayHigh ?? 0,
//         dayLow: entry.data[0]?.dayLow ?? 0,
//       });
//     });
//     const prevDayCloseMap = new Map();
//     preDayClose.forEach((entry) => {
//       prevDayCloseMap.set(entry.securityId, {
//         dayClose: entry.data[0]?.dayClose ?? 0,
//       });
//     });

//     // Process data for range breakout
//     let breakoutStocks = [];
//     const results = dataArray.map((item) => {
//       const securityId = item.securityId;
//       const stock = stockMap.get(securityId);
//       const todayData = latestDataMap.get(securityId);
//       const preClosedata = prevDayCloseMap.get(securityId);
//       // Validate candle data (need at least 5 days: 1st + 3 range + today)
//       if (
//         !item.high ||
//         !item.low ||
//         item.high.length < 4 ||
//         item.low.length < 4 ||
//         !todayData
//       ) {
//         console.warn(`Skipping ${securityId} due to insufficient data`);
//         return [];
//       }

//       const firstDayCandleHigh = item.high[0];
//       const firstDayCandleLow = item.low[0];
//       if (securityId === "3045") {
//         console.log(
//           "firstDayCandleHigh",
//           firstDayCandleHigh,
//           "firstDayCandleLow",
//           firstDayCandleLow
//         );
//       }
//       // Check if the next 3 days (indices 1, 2, 3) are within the range
//       const inRange =
//         item.high.slice(1, 4).every((high) => high <= firstDayCandleHigh) &&
//         item.low.slice(1, 4).every((low) => low >= firstDayCandleLow);

//       if (inRange) {
//         // Check for breakout today (index 4 or todayData)
//         const todayHigh = todayData.dayHigh;
//         const todayLow = todayData.dayLow;
//         const todayClose = todayData.dayClose;
//         const todayOpen = todayData.dayOpen;
//         const latestTradedPrice = todayData.latestTradedPrice;

//         const preClose = preClosedata.preClosedata.preClose;
//         // Breakout conditions
//         const breakoutAbove = todayHigh > firstDayCandleHigh;
//         const breakoutBelow = todayLow < firstDayCandleLow;

//         if (breakoutAbove || breakoutBelow) {
//           const percentageChange = latestTradedPrice
//             ? ((latestTradedPrice - preClose) / preClose) * 100
//             : 0;

//           console.log(latestTradedPrice, "latestTradedPrice");
//           console.log(preClose, "preClose");
//           console.log(percentageChange, "percentageChange");

//           breakoutStocks.push({
//             type: breakoutAbove ? "Bullish" : " Bearish",
//             securityId,
//             stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
//             stockName: stock?.SYMBOL_NAME || "N/A",
//             lastTradePrice: latestTradedPrice,
//             previousClosePrice: preClose, // Last day before today
//             percentageChange,
//             rangeHigh: firstDayCandleHigh,
//             rangeLow: firstDayCandleLow,
//             todayHigh,
//             todayLow,
//           });
//         }
//       }
//     });

//     console.log(breakoutStocks, "breakoutStocks");
//     // Flatten and filter results
//     const finalResults = breakoutStocks
//       .flat()
//       .filter((signal) => signal.length !== 0);
//     // Log for debugging
//     console.log("Final Results:", finalResults);

//     // Save or update results in the database
//     if (finalResults.length > 0) {
//       const savePromises = finalResults.map(async (signal) => {
//         console.log("signal", signal);
//         try {
//           await DailyRangeBreakouts.findOneAndUpdate(
//             { securityId: signal.securityId },
//             {
//               $set: {
//                 type: signal.type,
//                 stockSymbol: signal.stockSymbol,
//                 stockName: signal.stockName,
//                 lastTradePrice: signal.lastTradePrice,
//                 previousClosePrice: signal.previousClosePrice,
//                 percentageChange: signal.percentageChange,
//                 timestamp: new Date(
//                   new Date().getTime() + 5.5 * 60 * 60 * 1000
//                 ), // IST
//               },
//             },
//             { upsert: true, new: true }
//           );
//         } catch (dbError) {
//           console.error(`Error saving/updating ${signal.securityId}:`, dbError);
//         }
//       });

//       await Promise.all(savePromises);
//       console.log("Breakout signals processed successfully");
//     }

//     const fullData = await DailyRangeBreakouts.find();
//     if (fullData.length === 0) {
//       return res.status(200).json({
//         message: "No breakout signals detected",
//         data: [],
//       });
//     }

//     return res.status(200).json({
//       message: "Breakout analysis complete",
//       data: fullData,
//     });
//   } catch (error) {
//     console.error("Error in DailyRangeBreakout:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };


const getDataForTenMin = async (fromDate, toDate) => {
  const stocks = await StocksDetail.find({}, { SECURITY_ID: 1, _id: 0 });
  // console.log("stock", stocks);
  const securityIds = stocks.map((stock) =>
    stock.SECURITY_ID.trim().toString()
  );

  function convertToIST(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  }

  const fiveMinCandelMap = new Map();
  try {
    for (let i = 0; i < securityIds.length; i++) {
      const data = await fetchHistoricalDataforTenMin(
        securityIds[i],
        fromDate,
        toDate,
        i
      );

      data.open = data.open.slice(-5);
      data.high = data.high.slice(-5);
      data.low = data.low.slice(-5);
      data.close = data.close.slice(-5);
      data.volume = data.volume.slice(-5);
      data.timestamp = convertToIST(data.timestamp.slice(-5)[4]);
      data.securityId = data.securityId || securityIds[i];
      fiveMinCandelMap.set(securityIds[i], data);

      await delay(200); // Adjust delay (1000ms = 1 sec) based on API rate limits
    }
    return fiveMinCandelMap;
  } catch (error) {
    console.error("Error in getData:", error.message);
  }
};



connectDB().then(() => {
  getDataForTenMin().then((data) => {
    console.log(data);
  });
});

