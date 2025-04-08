import dotenv from "dotenv";
// import WebSocket from "ws";
// import parseBinaryData from "./src/utils/parseBinaryData.js";
import connectDB from "./src/config/db.js";
import {
  AIIntradayReversalFiveMins,
  getDataForTenMin,
  startWebSocket,
} from "./src/controllers/liveMarketData.controller.js";
import MarketDetailData from "./src/models/marketData.model.js";
import StocksDetail from "./src/models/stocksDetail.model.js";
import {
  fetchHistoricalData,
  fetchHistoricalDataforTenMin,
} from "./src/utils/fetchData.js";

// import cron from "node-cron";
// import scrapeAndSaveFIIDIIData from "./src/jobs/scrapData_Two.js";

dotenv.config();

// const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;
// const CLIENT_ID = process.env.DHAN_CLIENT_ID;

// const WS_URL = `wss://api-feed.dhan.co?version=2&token=${ACCESS_TOKEN}&clientId=${CLIENT_ID}&authType=2`;

// const runTasks = async () => {
//   try {
//     console.log("Running scheduled task...");
//     await connectDB(); // Connect to the database
//     await startWebSocket(); // Start WebSocket
//   } catch (error) {
//     console.error("Error in scheduled task:", error);
//   }
// };

// // Schedule the job to run every 2 minutes
// cron.schedule("*/2 * * * *", async () => {
//   console.log("Cron job running...");
//   await runTasks();
//   console.log("⏳ Waiting 20 seconds before next execution...");
//   await new Promise((resolve) => setTimeout(resolve, 20000));
// });

// console.log("Cron job scheduled to run every 2 minutes.");
// import redis from "./src/config/redisClient.js";
// import { previousDaysVolume } from "./src/controllers/stock.contollers.js";
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// const getFiveMinDataInRedis = async (
//   fromDate = "2025-04-04",
//   toDate = "2025-04-05"
// ) => {
//   const stocks = await StocksDetail.find({}, { SECURITY_ID: 1, _id: 0 });
//   const securityIds = stocks.map((stock) =>
//     stock.SECURITY_ID.trim().toString()
//   );

//   function convertToIST(unixTimestamp) {
//     const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
//     return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   }

//   try {
//     const updatedData = [];
//     let data;
//     for (let i = 0; i < securityIds.length; i++) {
//       // const data = await fetchHistoricalData(
//       //   securityIds[i],
//       //   fromDate,
//       //   toDate,
//       //   i
//       // );
//       const redisKey = `stockFiveMinCandle:${securityIds[i]}:${fromDate}-${toDate}`;

//       // Check Redis cache
//       const cachedData = await redis.get(redisKey);
//       if (cachedData) {
//         console.log(`Fetched from Redis: ${securityIds[i]}`);
//         data = JSON.parse(cachedData);
//       } else {
//         data = await fetchHistoricalData(securityIds[i], fromDate, toDate, i);

//         if (data) {
//           await redis.set(redisKey, JSON.stringify(data));
//           console.log(`Fetched from API and cached: ${securityIds[i]}`);
//         }
//       }

//       if (!data) {
//         console.warn(`No data found for Security ID: ${securityIds[i]}`);
//         continue; // Skip if data is missing
//       }

//       // Prepare the updated data
//       updatedData.push({
//         securityId: securityIds[i],
//         timestamp: data.timestamp.slice(-5).map(convertToIST), // Convert all timestamps
//         open: data.open.slice(-5),
//         high: data.high.slice(-5),
//         low: data.low.slice(-5),
//         close: data.close.slice(-5),
//         volume: data.volume.slice(-5),
//       });

//       // Add update operation to bulkWrite array
//       // bulkOperations.push({
//       //   updateOne: {
//       //     filter: { securityId: securityIds[i] }, // Find by securityId
//       //     update: { $set: updatedData }, // Update fields
//       //     upsert: true, // Insert if not found
//       //   },
//       // });
//       await delay(200);
//     }

//     if (updatedData.length > 0) {
//       // await FiveMinCandles.bulkWrite(bulkOperations);
//       console.log(
//         `Bulk operation completed for ${updatedData.length} records.`
//       );
//       console.log("data", updatedData);
//     } else {
//       console.log("No valid data found to update.");
//     }
//   } catch (error) {
//     console.error("Error in getData:", error.message);
//   }
// };

//get data in redis for  ten min candles

// const getTenMinDataInRedis = async (
//   fromDate = "2025-04-04",
//   toDate = "2025-04-05"
// ) => {
//   const stocks = await StocksDetail.find({}, { SECURITY_ID: 1, _id: 0 });
//   const securityIds = stocks.map((stock) =>
//     stock.SECURITY_ID.trim().toString()
//   );

//   function convertToIST(unixTimestamp) {
//     const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
//     return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   }

//   try {
//     const updatedData = [];
//     let data;
//     for (let i = 0; i < securityIds.length; i++) {
//       // const data = await fetchHistoricalData(
//       //   securityIds[i],
//       //   fromDate,
//       //   toDate,
//       //   i
//       // );
//       const redisKey = `stockTenMinCandle:${securityIds[i]}:${fromDate}-${toDate}`;

//       // Check Redis cache
//       const cachedData = await redis.get(redisKey);
//       if (cachedData) {
//         console.log(`Fetched from Redis: ${securityIds[i]}`);
//         data = JSON.parse(cachedData);
//       } else {
//         data = await fetchHistoricalDataforTenMin(
//           securityIds[i],
//           fromDate,
//           toDate,
//           i
//         );

//         if (data) {
//           await redis.set(redisKey, JSON.stringify(data));
//           console.log(`Fetched from API and cached: ${securityIds[i]}`);
//         }
//       }

//       if (!data) {
//         console.warn(`No data found for Security ID: ${securityIds[i]}`);
//         continue; // Skip if data is missing
//       }

//       // Prepare the updated data
//       updatedData.push({
//         securityId: securityIds[i],
//         timestamp: data.timestamp.slice(-5).map(convertToIST), // Convert all timestamps
//         open: data.open.slice(-5),
//         high: data.high.slice(-5),
//         low: data.low.slice(-5),
//         close: data.close.slice(-5),
//         volume: data.volume.slice(-5),
//       });

//       // Add update operation to bulkWrite array
//       // bulkOperations.push({
//       //   updateOne: {
//       //     filter: { securityId: securityIds[i] }, // Find by securityId
//       //     update: { $set: updatedData }, // Update fields
//       //     upsert: true, // Insert if not found
//       //   },
//       // });
//       await delay(200);
//     }

//     if (updatedData.length > 0) {
//       // await FiveMinCandles.bulkWrite(bulkOperations);
//       console.log(
//         `Bulk operation completed for ${updatedData.length} records.`
//       );
//       console.log("data for ten min", updatedData);
//     } else {
//       console.log("No valid data found to update.");
//     }
//   } catch (error) {
//     console.error("Error in getData:", error.message);
//   }
// };







const previousDaysVolume = async (socket) => {
  try {
    const uniqueTradingDaysDates = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } },
      { $sort: { _id: -1 } },
      { $limit: 2 },
    ]);

    // console.log(uniqueTradingDaysDates,'unique')
    if (!uniqueTradingDaysDates || uniqueTradingDaysDates.length < 2) {
      return { success: false, message: "No stock data available" };
    }

    const latestDate = uniqueTradingDaysDates[0]._id;
    const previousDayDate = uniqueTradingDaysDates[1]._id;

    const todayData = await MarketDetailData.find(
      { date: latestDate },
      {
        securityId: 1,
        data: 1,
        _id: 0,
      }
    );

    // console.log('todatdata',todayData)

    const previousData = await MarketDetailData.aggregate([
      { $match: { date: { $lt: latestDate } } },
      { $sort: { date: -1 } },
      { $limit: 1000 },
      {
        $project: {
          securityId: 1,
          data: 1,
          date: 1,
          _id: 0,
        },
      },
    ]);

     

    if (!previousData.length) {
      return { success: false, message: "No previous stock data available" };
    }

    const yesterdayData = await MarketDetailData.find(
      { date: previousDayDate },
      {
        securityId: 1,
        data: 1,
        _id: 0,
      }
    );

    const prevDayDataMap = new Map();
    yesterdayData.forEach((data) => {
      prevDayDataMap.set(data.securityId, data);
    });

    const stocksDetail = await StocksDetail.find(
      {},
      {
        SECURITY_ID: 1,
        UNDERLYING_SYMBOL: 1,
        SYMBOL_NAME: 1,
        DISPLAY_NAME: 1,
        _id: 0,
      }
    );

    const stocksDetailsMap = new Map();
    stocksDetail.forEach((stock) => {
      stocksDetailsMap.set(stock.SECURITY_ID, {
        UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
        SYMBOL_NAME: stock.SYMBOL_NAME,
        DISPLAY_NAME: stock.DISPLAY_NAME,
      });
    });

    let previousVolumesMap = {};
    previousData.forEach(({ securityId, data }) => {
      const volume = data?.[0]?.volume || 0;
      // console.log('volume',volume)
      
      if (!previousVolumesMap[securityId]) {
        previousVolumesMap[securityId] = [];
      }
      previousVolumesMap[securityId].push(volume);
    });

    let bulkUpdates = [];
// console.log(todayData,'today')
    const combinedData = todayData.map(({ securityId, data }) => {
      const todayVolume = data?.volume?.[0] || 0;
      // console.log(todayVolume,'today')
      const latestTradedPrice = data?.latestTradedPrice?.[0] || 0;
      const todayOpen = data?.dayOpen?.[0] || 0;

      const stock = stocksDetailsMap.get(securityId);
      const previousDayData = prevDayDataMap.get(securityId);
      const previousDayClose = previousDayData?.data?.dayClose?.[0] || 0;

      const percentageChange = previousDayClose
        ? ((latestTradedPrice - previousDayClose) / previousDayClose) * 100
        : 0;

      const volumeHistory = previousVolumesMap[securityId] || [];
      const totalPreviousVolume = volumeHistory.reduce(
        (sum, vol) => sum + vol,
        0
      );
      const averagePreviousVolume = volumeHistory.length
        ? totalPreviousVolume / volumeHistory.length
        : 0;

      const xElement =
        averagePreviousVolume > 0 ? todayVolume / averagePreviousVolume : 0;

      bulkUpdates.push({
        updateOne: {
          filter: { securityId, date: latestDate },
          update: { $set: { xelement: xElement } },
        },
      });

      return {
        securityId,
        todayVolume,
        stock,
        totalPreviousVolume,
        averagePreviousVolume,
        xElement,
        percentageChange,
      };
    });

    if (bulkUpdates.length > 0) {
      await MarketDetailData.bulkWrite(bulkUpdates);
    }
console.log(combinedData,'dedee')
    return { success: true, combinedData };
  } catch (error) {
    console.error(error, 'pd reeoe');
    return { success: false, message: "Error in calculating volume data" };
  }
};



connectDB();
startWebSocket()
// previousDaysVolume()
// getTenMinDataInRedis();
// getFiveMinDataInRedis()

 



// const getData = async () => {
//   const data = await getDataForTenMin()
//   console.log('data',data)
// }
//  getData()

// startWebSocket();

// scrapeAndSaveFIIDIIData();

// getDataForTenMin("2025-03-27", "2025-03-28")

//  getData("2025-03-27", "2025-03-28");

// setInterval(getData, 150000);

// function startWebSocket() {
//   const ws = new WebSocket(WS_URL, {
//     perMessageDeflate: false,
//     maxPayload: 1024 * 1024, // Increase WebSocket buffer size to handle large messages
//   });

//   ws.on("open", () => {
//     console.log("✅ Connected to Dhan WebSocket");

//     setTimeout(() => {
//       const subscribeMessage = {
//         RequestCode: 21,
//         InstrumentCount: 1,
//         InstrumentList: [
//           { ExchangeSegment: "NSE_EQ", SecurityId: "100" }, // Ensure this is a valid ID
//         ],
//       };

//       ws.send(JSON.stringify(subscribeMessage));
//       console.log("📩 Sent Subscription Request:", subscribeMessage);
//     }, 2000); // Delay to prevent throttling
//   });

//   ws.on("message", async (data) => {
//     console.log("🔹 Raw Binary Data:", data);

//     try {
//       const parsedData = parseBinaryData(data); // Convert binary data to readable format
//       if (parsedData) {
//         console.log("✅ Processed Data:", parsedData);
//       } else {
//         console.warn("⚠️ No data parsed from the response.");
//       }
//     } catch (error) {
//       console.error("❌ Error processing message:", error);
//     }
//   });

//   ws.on("error", (error) => {
//     console.error("❌ WebSocket Error:", error);
//   });

//   ws.on("close", () => {
//     console.log("❌ WebSocket Disconnected. Reconnecting...");
//     setTimeout(() => startWebSocket(), 5000); // Reconnect after 5 sec
//   });
// }

// // Start WebSocket connection
// startWebSocket();
