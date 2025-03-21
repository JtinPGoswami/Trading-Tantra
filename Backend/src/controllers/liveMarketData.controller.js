// import WebSocket from "ws";
// import MarketDetailData from "../models/marketData.model.js";
// import connectDB from "../config/db.js";
// import StocksDetail from "../models/stocksDetail.model.js";
// import parseBinaryData from "../utils/parseBinaryData.js";

// const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;
// const CLIENT_ID = process.env.DHAN_CLIENT_ID;
// const WS_URL = `wss://api-feed.dhan.co?version=2&token=${ACCESS_TOKEN}&clientId=${CLIENT_ID}&authType=2`;

// let securityIdList = [];
// const securityIdMap = new Map();
// let marketDataBuffer = new Map(); // Store batch data

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

// const calculateTurnover = (avgPrice, volume) => {
//   const turnover = Number(avgPrice * volume).toFixed(2);
//   // console.log("turnover", turnover, "avgPrice", avgPrice, "volume", volume);
//   return turnover;
// };

// const saveMarketData = async () => {
//   if (marketDataBuffer.size === 0) return;

//   const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

//   const savePromises = Array.from(marketDataBuffer.entries()).map(
//     async ([securityId, marketData]) => {
//       try {
//         const turnover = calculateTurnover(
//           marketData[0].avgTradePrice,
//           marketData[0].volume
//         );
//         console.log("turnover", turnover);
//         await MarketDetailData.findOneAndUpdate(
//           { date: todayDate, securityId: securityId },
//           { $set: { data: marketData, turnover } },
//           { upsert: true, new: true }
//         );
//       } catch (error) {
//         console.error(`❌ Error saving data for ${securityId}:`, error);
//       }
//     }
//   );

//   try {
//     await Promise.all(savePromises);
//     console.log(`💾 Successfully saved ${savePromises.length} records.`);
//   } catch (error) {
//     console.error("❌ Error in bulk save:", error);
//   }

//   marketDataBuffer.clear(); // Clear buffer after saving
// };

// async function startWebSocket() {
//   console.log("🔄 Fetching security IDs...");

//   await fetchSecurityIds();

//   console.log("Fetched Security IDs:", securityIdList);

//   if (securityIdList.length === 0) {
//     console.error("❌ No security IDs found. WebSocket will not start.");
//     return;
//   }

//   const securityIdBatches = splitIntoBatches(securityIdList, 100);

//   const ws = new WebSocket(WS_URL, {
//     perMessageDeflate: false,
//     maxPayload: 1024 * 1024,
//   });

//   ws.on("open", () => {
//     console.log("✅ Connected to Dhan WebSocket");

//     securityIdBatches.forEach((batch, batchIndex) => {
//       setTimeout(() => {
//         securityIdMap.set(batchIndex, batch);

//         const subscriptionRequest = {
//           RequestCode: 21,
//           InstrumentCount: batch.length,
//           InstrumentList: batch.map((securityId) => ({
//             ExchangeSegment: "NSE_EQ",
//             SecurityId: securityId,
//           })),
//         };

//         ws.send(JSON.stringify(subscriptionRequest));
//         console.log(`📩 Sent Subscription Request for Batch ${batchIndex + 1}`);
//       }, batchIndex * 5000);
//     });
//   });

//   ws.on("message", async (data) => {
//     console.log("🔹 Raw Binary Data Received");

//     try {
//       const marketData = parseBinaryData(data);
//       // console.log("🔎 Parsed Market Data:", marketData); // Debugging

//       if (marketData && marketData.securityId) {
//         const securityId = marketData.securityId;

//         if (!marketDataBuffer.has(securityId)) {
//           marketDataBuffer.set(securityId, []);
//         }
//         marketDataBuffer.get(securityId).push(marketData); // Append data instead of replacing
//         console.log(`📈 Data buffered for Security ID: ${securityId}`);
//       } else {
//         console.warn(
//           "⚠️ No valid market data received or Security ID missing."
//         );
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

//   // Save market data every 10 seconds (adjust as needed)
//   setInterval(saveMarketData, 10000);
// }

// export default startWebSocket;

import WebSocket from "ws";
import connectDB from "../config/db.js";
import StocksDetail from "../models/stocksDetail.model.js";
import parseBinaryData from "../utils/parseBinaryData.js";
import { stocksData } from "../f&o.js";
import {
  fetchDailyHistoricalData,
  fetchHistoricalData,
  fetchHistoricalDataforTenMin,
} from "../utils/fetchData.js";
import fiveMinMomentumSignal from "../models/fiveMInMomentumSignal.model.js";
import DailyMomentumSignal from "../models/dailyMomentumSignal.model.js";
import MarketDetailData from "../models/marketData.model.js";
import MomentumStockFiveMin from "../models/momentumStockFiveMin.model.js";
import MomentumStockTenMin from "../models/momentumStockTenMin.model.js";
import DailyRangeBreakouts from "../models/dailyRangeBreakout.model.js";
import { getDayHighBreak, getDayLowBreak } from "../utils/DayHighLow.js";
import HighLowReversal from "../models/highLowReversal.model.js";

const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;
const CLIENT_ID = process.env.DHAN_CLIENT_ID;
const WS_URL = `wss://api-feed.dhan.co?version=2&token=${ACCESS_TOKEN}&clientId=${CLIENT_ID}&authType=2`;

let securityIdList = [];
const securityIdMap = new Map();
let marketDataBuffer = new Map();
const batchSize = 216;
let isProcessingSave = false;
let batchCount = 0; // Track how many batches have been processed

const fetchSecurityIds = async () => {
  try {
    const stocks = await StocksDetail.find();
    securityIdList = stocks.map((stock) => stock.SECURITY_ID);
  } catch (error) {
    console.error("❌ Error fetching security IDs:", error);
    throw error;
  }
};

const splitIntoBatches = (array, batchSize) => {
  const batches = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
};

const calculateTurnover = (avgPrice, volume) => {
  return Number(avgPrice * volume).toFixed(2);
};

const saveMarketData = async () => {
  console.log("Starting to save market data");
  const todayDate = new Date().toISOString().split("T")[0];
  console.log(`Total records to save: ${marketDataBuffer.size}`);

  let successCount = 0;
  let errorCount = 0;

  for (const [securityId, marketData] of marketDataBuffer.entries()) {
    try {
      console.log(`Processing securityId: ${securityId}`);

      if (!marketData || !marketData.length || !marketData[0]) {
        console.error(`Invalid market data for ${securityId}`);
        errorCount++;
        continue;
      }

      const turnover = calculateTurnover(
        marketData[0].avgTradePrice,
        marketData[0].volume
      );

      try {
        // const filter = { date: todayDate, securityId: securityId };
        // const update = { $set: { data: marketData, turnover } };
        // const options = { upsert: true, new: true };

        await MarketDetailData.findOneAndUpdate(
          { date: todayDate, securityId: securityId },
          { $set: { data: marketData, turnover } },
          { upsert: true, new: true }
        );

        successCount++;
        console.log(`✅ DB operation complete for ${successCount}`);
      } catch (dbError) {
        console.error(`❌ DB error for ${securityId}:`, dbError.message);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Processing error for ${securityId}:`, error.message);
      errorCount++;
    }
  }

  console.log(
    `📊 Save operation completed. Success: ${successCount}, Errors: ${errorCount}`
  );

  // Clear the buffer after saving
  console.log(`🧹 Clearing market data buffer to start fresh cycle`);
  marketDataBuffer.clear();

  // Mark processing as complete
  isProcessingSave = false;
  console.log(`✅ Ready to collect data for next cycle`);
};

async function startWebSocket() {
  console.log("🔄 Fetching security IDs...");

  await fetchSecurityIds();

  if (securityIdList.length === 0) {
    console.error("❌ No security IDs found. WebSocket will not start.");
    return;
  }

  const securityIdBatches = splitIntoBatches(securityIdList, 100);

  const ws = new WebSocket(WS_URL, {
    perMessageDeflate: false,
    maxPayload: 1024 * 1024,
  });

  ws.on("open", () => {
    console.log("✅ Connected to Dhan WebSocket");

    securityIdBatches.forEach((batch, batchIndex) => {
      setTimeout(() => {
        securityIdMap.set(batchIndex, batch);

        const subscriptionRequest = {
          RequestCode: 21,
          InstrumentCount: batch.length,
          InstrumentList: batch.map((securityId) => ({
            ExchangeSegment: "NSE_EQ",
            SecurityId: securityId,
          })),
        };

        ws.send(JSON.stringify(subscriptionRequest));
        console.log(`📩 Sent Subscription Request for Batch ${batchIndex + 1}`);
      }, batchIndex * 5000);
    });
  });

  ws.on("message", async (data) => {
    if (isProcessingSave) return; // Skip if saving is in progress

    try {
      const marketData = parseBinaryData(data);

      if (marketData && marketData.securityId) {
        const securityId = marketData.securityId;

        if (!marketDataBuffer.has(securityId)) {
          marketDataBuffer.set(securityId, []);
        }

        marketDataBuffer.get(securityId).push(marketData);

        // Process data in batches of exactly 216
        if (marketDataBuffer.size === batchSize) {
          batchCount++;
          console.log(
            `✅ Batch ${batchCount} of ${batchSize} records received. Saving...`
          );

          isProcessingSave = true;
          await saveMarketData();

          console.log(`🕒 Waiting 20 seconds before the next cycle...`);
          await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait 5 seconds

          console.log(`✅ Ready for the next batch cycle.`);
        }
      } else {
        console.warn(
          "⚠️ No valid market data received or Security ID missing."
        );
      }
    } catch (error) {
      console.error("❌ Error processing market data:", error);
    }
  });

  ws.on("error", (error) => {
    console.error("❌ WebSocket Error:", error);
  });

  ws.on("close", () => {
    console.log("❌ WebSocket Disconnected. Reconnecting...");
    isProcessingSave = false; // Reset this flag in case of disconnection
    setTimeout(startWebSocket, 2000);
  });
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getData = async (fromDate, toDate) => {
  const stocks = await StocksDetail.find();
  // console.log("stock", stocks);
  const securityIds = stocks.map((stock) =>
    stock.SECURITY_ID.trim().toString()
  );

  // const today = new Date();
  // const formattedFromDate = new Date(today); // Today's date

  // const formattedToDate = new Date(today);
  // formattedToDate.setDate(formattedToDate.getDate() + 1); // Tomorrow's date

  // const fromDate = formattedFromDate.toISOString().split("T")[0];
  // const toDate = formattedToDate.toISOString().split("T")[0];

  const fiveMinCandelMap = new Map();
  try {
    for (let i = 0; i < securityIds.length; i++) {
      const data = await fetchHistoricalData(
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
      data.timestamp = data.timestamp.slice(-5);
      data.securityId = data.securityId || securityIds[i];
      fiveMinCandelMap.set(securityIds[i], data);

      await delay(200); // Adjust delay (1000ms = 1 sec) based on API rate limits
    }
    return fiveMinCandelMap;
    //   const turnover = calculateTurnover(data);
    //   console.log(`Total Turnover of SBIN (NSE) from ${fromDate} to ${toDate}: ₹${turnover.toFixed(2)}`);
  } catch (error) {
    console.error("Error in getData:", error.message);
  }
};

const getDailyData = async (fromDate, toDate) => {
  const stocks = await StocksDetail.find();
  console.log("stock", stocks);
  const securityIds = stocks.map((stock) =>
    stock.SECURITY_ID.trim().toString()
  );

  const fiveMinCandelMap = new Map();
  try {
    for (let i = 0; i < securityIds.length; i++) {
      const data = await fetchDailyHistoricalData(
        securityIds[i],
        fromDate,
        toDate,
        i
      );

      data.open = data.open.slice(-4);
      data.high = data.high.slice(-4);
      data.low = data.low.slice(-4);
      data.close = data.close.slice(-4);
      data.volume = data.volume.slice(-4);
      data.timestamp = data.timestamp.slice(-4);
      data.securityId = data.securityId || securityIds[i];
      fiveMinCandelMap.set(securityIds[i], data);

      await delay(200); // Adjust delay (1000ms = 1 sec) based on API rate limits
    }
    return fiveMinCandelMap;
    //   const turnover = calculateTurnover(data);
    //   console.log(`Total Turnover of SBIN (NSE) from ${fromDate} to ${toDate}: ₹${turnover.toFixed(2)}`);
  } catch (error) {
    console.error("Error in getData:", error.message);
  }
};
const getDataForTenMin = async (fromDate, toDate) => {
  const stocks = await StocksDetail.find();
  console.log("stock", stocks);
  const securityIds = stocks.map((stock) =>
    stock.SECURITY_ID.trim().toString()
  );

  // const today = new Date();
  // const formattedFromDate = new Date(today); // Today's date

  // const formattedToDate = new Date(today);
  // formattedToDate.setDate(formattedToDate.getDate() + 1); // Tomorrow's date

  // const fromDate = formattedFromDate.toISOString().split("T")[0];
  // const toDate = formattedToDate.toISOString().split("T")[0];

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
      data.timestamp = data.timestamp.slice(-5);
      data.securityId = data.securityId || securityIds[i];
      fiveMinCandelMap.set(securityIds[i], data);

      await delay(200); // Adjust delay (1000ms = 1 sec) based on API rate limits
    }
    return fiveMinCandelMap;
    //   const turnover = calculateTurnover(data);
    //   console.log(`Total Turnover of SBIN (NSE) from ${fromDate} to ${toDate}: ₹${turnover.toFixed(2)}`);
  } catch (error) {
    console.error("Error in getData:", error.message);
  }
};
// const  AIIntradayReversalFiveMin = async (req, res) => {
//   try {
//     const data = await getData();
//     if (!data) {
//       return res.status(400).json({ message: "No data found" });
//     }

// const stocks = StocksDetail.find();
// if (!stocks) {
//   return res.status(400).json({ message: "No stocks data found" });
// }
// const stockmap = new Map();
// stocks.forEach((entry) => {
//   stockmap.set(entry.SECURITY_ID, {
//     INDEX: entry.INDEX || [],
//     SECTOR: entry.SECTOR || [],
//     UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL,
//     SYMBOL_NAME: entry.SYMBOL_NAME,
//   });
// });

//    const res = data.map((item) => {
//       const bulls=[];
//       const bear=[];
//       const lastFourCandelHigh = item.high.slice(0, 4);
//       const lastFourCandelLow = item.low.slice(0, 4);
//       const maxHigh = Math.max(...lastFourCandelHigh);
//       const maxLow = Math.max(...lastFourCandelLow);
//       const leatestCandelHigh = item.high.slice(-1);
//       const leatestCandelLow = item.low.slice(-1);
//       const securityId = item.securityId;
//       const stock = stockmap.get(securityId);

// if(leatestCandelHigh>maxHigh){
// bulls.push({
//   securityId: securityId,
//   stockSymbol: stock.UNDERLYING_SYMBOL || "N/A",
//   stockName: stock.SYMBOL_NAME || "N/A",
//   lastTradePrice: leatestCandelHigh
// });
// }
// if(leatestCandelLow<maxLow){
// bear.push({
//   securityId: securityId,
//   stockSymbol: stock.UNDERLYING_SYMBOL || "N/A",
//   stockName: stock.SYMBOL_NAME || "N/A",
//   lastTradePrice: leatestCandelHigh
// });
// }
// if(leatestCandelLow<maxLow){
// bear.push({
//   securityId: securityId,
//   stockSymbol: stock.UNDERLYING_SYMBOL || "N/A",
//   stockName: stock.SYMBOL_NAME || "N/A",
//   lastTradePrice: leatestCandelLow,
//   previousClosePrice: maxLow,
//   percentageChange: ((leatestCandelLow[0] - maxLow) / maxLow) * 100,
// });
// }

// }

//       console.log("maxHigh", maxHigh, "maxLow", maxLow);

//     })

//   } catch (error) {
//     console.error("Error in  AIIntradayReversalFiveMin:", error.message);
//   }
// };

//  AIIntradayReversalFiveMin();

// const  AIIntradayReversalFiveMin = async (req, res) => {
//   try {
//     const data = await getData();

//     if (!data || !(data instanceof Map)) {
//       console.error("Invalid data format received from getData:", data);
//       return { message: "Invalid data format" };
//     }

//     // Convert Map to an array
//     const dataArray = Array.from(data.values());

//     if (dataArray.length === 0) {
//       return { message: "No data found" };
//     }

//     const stocks = await StocksDetail.find();
//     if (!stocks || stocks.length === 0) {
//       return { message: "No stocks data found" };
//     }

//     // Create a map for stock details
//     const stockmap = new Map();
//     stocks.forEach((entry) => {
//       stockmap.set(entry.SECURITY_ID, {
//         INDEX: entry.INDEX || [],
//         SECTOR: entry.SECTOR || [],
//         UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL,
//         SYMBOL_NAME: entry.SYMBOL_NAME,
//       });
//     });

//     // Process data to detect momentum signals
//     const results = dataArray.map((item) => {
//       const momentumSignals = [];
//       const securityId = item.securityId;
//       const stock = stockmap.get(securityId);

//       // Validate structure before processing
//       if (
//         !item.high ||
//         !item.low ||
//         item.high.length < 5 ||
//         item.low.length < 5
//       ) {
//         console.warn(`Skipping ${securityId} due to insufficient data`);
//         return [];
//       }

//       // Get last 5 candles (4 previous + latest)
//       const lastFiveHigh = item.high.slice(-5);
//       const lastFiveLow = item.low.slice(-5);

//       // Extract latest candle
//       const latestHigh = lastFiveHigh[4];
//       const latestLow = lastFiveLow[4];

//       // Get previous 4 candles
//       const prevFourHigh = lastFiveHigh.slice(0, 4);
//       const prevFourLow = lastFiveLow.slice(0, 4);

//       // Calculate percentage changes for previous 4 candles
//       const percentageChanges = prevFourLow
//         .map((low, i) =>
//           i > 0 ? ((low - prevFourLow[i - 1]) / prevFourLow[i - 1]) * 100 : 0
//         )
//         .slice(1); // Ignore first undefined entry

//       // Check bearish momentum loss (4 negative candles followed by positive)
//       const allBearish = percentageChanges.every((change) => change < 0);
//       const decreasingMomentum = percentageChanges.every(
//         (change, i) =>
//           i === 0 || Math.abs(change) < Math.abs(percentageChanges[i - 1])
//       );
//       const latestPositive = latestHigh > lastFiveHigh[3];

//       if (allBearish && decreasingMomentum && latestPositive) {
//         momentumSignals.push({
//           type: "Bullish Reversal",
//           securityId,
//           stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
//           stockName: stock?.SYMBOL_NAME || "N/A",
//           lastTradePrice: latestHigh,
//           previousClosePrice: lastFiveLow[3],
//           percentageChange:
//             ((latestHigh - lastFiveLow[3]) / lastFiveLow[3]) * 100,
//         });
//       }

//       // Check bullish momentum loss (4 positive candles followed by negative)
//       const allBullish = percentageChanges.every((change) => change > 0);
//       const decreasingBullMomentum = percentageChanges.every(
//         (change, i) => i === 0 || change < percentageChanges[i - 1]
//       );
//       const latestNegative = latestLow < lastFiveLow[3];

//       if (allBullish && decreasingBullMomentum && latestNegative) {
//         momentumSignals.push({
//           type: "Bearish Reversal",
//           securityId,
//           stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
//           stockName: stock?.SYMBOL_NAME || "N/A",
//           lastTradePrice: latestLow,
//           previousClosePrice: lastFiveHigh[3],
//           percentageChange:
//             ((latestLow - lastFiveHigh[3]) / lastFiveHigh[3]) * 100,
//         });
//       }

//       return momentumSignals;
//     });

//     // Flatten the results array and filter out empty entries
//     const finalResults = results.flat().filter((signal) => signal.length !== 0);

//     console.log("finalResults", finalResults);
//   } catch (error) {
//     console.error("Error in  AIIntradayReversalFiveMin:", error);
//     console.log("erreo", error.message);
//   }
// };
// AIIntradayReversalFiveMin
const AIIntradayReversalFiveMins = async (req, res) => {
  try {
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date");

    if (!latestEntry) {
      return res.status(404).json({ message: "No stock data available" });
    }

    const latestDate = latestEntry.date;

    const tomorrow = new Date(latestDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    const data = await getData(latestDate, tomorrowFormatted);

    // Check if data is valid and a Map
    if (!data || !(data instanceof Map)) {
      console.error("Invalid data format received from getData:", data);
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Convert Map to an array
    const dataArray = Array.from(data.values());

    if (dataArray.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // Fetch stock details
    const stocks = await StocksDetail.find();
    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ message: "No stocks data found" });
    }

    // Create a map for stock details
    const stockmap = new Map();
    stocks.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
        INDEX: entry.INDEX || [],
        SECTOR: entry.SECTOR || [],
        UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL,
        SYMBOL_NAME: entry.SYMBOL_NAME,
      });
    });

    // Process data to detect momentum signals
    const results = dataArray.map((item) => {
      const momentumSignals = [];
      const securityId = item.securityId;
      const stock = stockmap.get(securityId);

      // Validate candle data structure
      if (
        !item.high ||
        !item.low ||
        item.high.length < 5 ||
        item.low.length < 5
      ) {
        console.warn(`Skipping ${securityId} due to insufficient data`);
        return [];
      }

      // Get last 5 candles (4 previous + latest)
      const lastFiveHigh = item.high.slice(-5);
      const lastFiveLow = item.low.slice(-5);

      // Extract latest candle
      const latestHigh = lastFiveHigh[4];
      const latestLow = lastFiveLow[4];

      // Get previous 4 candles
      const prevFourHigh = lastFiveHigh.slice(0, 4);
      const prevFourLow = lastFiveLow.slice(0, 4);

      // Calculate percentage changes for previous 4 candles
      const percentageChanges = prevFourLow
        .map((low, i) =>
          i > 0 ? ((low - prevFourLow[i - 1]) / prevFourLow[i - 1]) * 100 : 0
        )
        .slice(1); // [change from 0->1, 1->2, 2->3]

      // Check bearish momentum loss (4 negative candles followed by positive)
      const allBearish = percentageChanges.every((change) => change < 0);
      const decreasingMomentum = percentageChanges.every(
        (change, i) =>
          i === 0 || Math.abs(change) < Math.abs(percentageChanges[i - 1])
      );
      const latestPositive = latestHigh > lastFiveHigh[3];

      // Debug logging for Bullish Reversal
      console.log(`${securityId} Bullish Check:`, {
        percentageChanges,
        allBearish,
        decreasingMomentum,
        latestPositive,
        lastFiveHigh,
        lastFiveLow,
      });

      if (allBearish && decreasingMomentum && latestPositive) {
        momentumSignals.push({
          type: "Bullish Reversal",
          securityId,
          stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
          stockName: stock?.SYMBOL_NAME || "N/A",
          lastTradePrice: latestHigh,
          previousClosePrice: lastFiveLow[3],
          percentageChange:
            ((latestHigh - lastFiveLow[3]) / lastFiveLow[3]) * 100,
        });
      }

      // Check bullish momentum loss (4 positive candles followed by negative)
      const allBullish = percentageChanges.every((change) => change > 0);
      const decreasingBullMomentum = percentageChanges.every(
        (change, i) => i === 0 || change < percentageChanges[i - 1]
      );
      const latestNegative = latestLow < lastFiveLow[3];

      // Debug logging for Bearish Reversal
      console.log(`${securityId} Bearish Check:`, {
        percentageChanges,
        allBullish,
        decreasingBullMomentum,
        latestNegative,
        lastFiveHigh,
        lastFiveLow,
      });

      if (allBullish && decreasingBullMomentum && latestNegative) {
        momentumSignals.push({
          type: "Bearish Reversal",
          securityId,
          stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
          stockName: stock?.SYMBOL_NAME || "N/A",
          lastTradePrice: latestLow,
          previousClosePrice: lastFiveHigh[3],
          percentageChange:
            ((latestLow - lastFiveHigh[3]) / lastFiveHigh[3]) * 100,
        });
      }

      return momentumSignals;
    });

    // Flatten the results array and filter out empty entries
    const finalResults = results.flat().filter((signal) => signal.length !== 0);

    // Log final results for debugging
    console.log("Final Results:", finalResults);

    // Save or update finalResults in the database
    if (finalResults.length > 0) {
      const savePromises = finalResults.map(async (signal) => {
        try {
          await fiveMinMomentumSignal.findOneAndUpdate(
            { securityId: signal.securityId }, // Find by securityId
            {
              $set: {
                type: signal.type,
                stockSymbol: signal.stockSymbol,
                stockName: signal.stockName,
                lastTradePrice: signal.lastTradePrice,
                previousClosePrice: signal.previousClosePrice,
                percentageChange: signal.percentageChange,
                timestamp: new Date(
                  new Date().getTime() + 5.5 * 60 * 60 * 1000
                ), // IST timestamp
              },
            },
            { upsert: true, new: true } // Upsert: insert if not found, update if found; return updated doc
          );
        } catch (dbError) {
          console.error(`Error saving/updating ${signal.securityId}:`, dbError);
        }
      });

      await Promise.all(savePromises);
      console.log("Momentum signals processed successfully");
    }
    const fullData = await fiveMinMomentumSignal.find();
    // Send response
    if (fullData.length === 0) {
      return res.status(200).json({
        message: "No momentum signals detected",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Momentum analysis complete",
      data: fullData,
    });
  } catch (error) {
    console.error("Error in  AIIntradayReversalFiveMin:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// AIMomentumCatcherFiveMins

// const AIIntradayReversalDaily = async (req, res) => {
//   try {
//     const allData = await MarketDetailData.find().sort({ date: -1 }); // Newest first

//     if (!allData || allData.length === 0) {
//       return res.status(404).json({ success: false, message: "No data found" });
//     }

//     const dataByDay = {};
//     allData.forEach((entry) => {
//       const day = new Date(entry.date).toISOString().split("T")[0]; // YYYY-MM-DD
//       if (!dataByDay[day]) {
//         dataByDay[day] = [];
//       }
//       dataByDay[day].push(entry);
//     });

//     // Get the latest 5 days with data
//     const days = Object.keys(dataByDay).sort().reverse(); // Sort descending (newest first)
//     const latestFiveDays = days.slice(0, 2); // Take the top 5

//     // Collect all entries from those 5 days
//     const result = [];
//     latestFiveDays.forEach((day) => {
//       result.push(...dataByDay[day]);
//     });

//     if (result.length === 0) {
//       return res.status(404).json({ success: false, message: "No data found" });
//     }

//   const sotcksData= new Map()

//     result.map((item) => {
// stocksData.set(item.securityId,{
//   securityId:item.securityId,

// })
//     });
//   } catch (error) {
//     console.log("error in ai", error);
//   }
// };

const AIIntradayReversalDaily = async (req, res) => {
  try {
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date");

    if (!latestEntry) {
      return res.status(404).json({ message: "No stock data available" });
    }

    const latestDate = latestEntry.date;

    const tomorrow = new Date(latestDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const previousFiveDaysDate = new Date(latestDate);
    previousFiveDaysDate.setDate(previousFiveDaysDate.getDate() - 30);

    const previousFiveDaysDateFormatted = previousFiveDaysDate
      .toISOString()
      .split("T")[0];
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    const data = await getDailyData(
      previousFiveDaysDateFormatted,
      tomorrowFormatted
    );

    if (!data || !(data instanceof Map)) {
      console.error("Invalid data format received from getData:", data);
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Convert Map to an array
    const dataArray = Array.from(data.values());

    if (dataArray.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // Fetch stock details
    const stocks = await StocksDetail.find();
    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ message: "No stocks data found" });
    }

    // Create a map for stock details
    const stockmap = new Map();
    stocks.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
        INDEX: entry.INDEX || [],
        SECTOR: entry.SECTOR || [],
        UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL,
        SYMBOL_NAME: entry.SYMBOL_NAME,
      });
    });

    const latestData = await MarketDetailData.find({ date: latestDate });

    if (latestData.length === 0) {
      return res
        .status(404)
        .json({ message: "No stock data available for the latest date" });
    }
    const latestDataMap = new Map();
    latestData.forEach((entry) => {
      latestDataMap.set(entry.securityId, {
        latestTradedPrice: entry.data?.latestTradedPrice?.[0] || 0,
        dayopen: entry.data?.dayOpen?.[0],
        dayClose: entry.data?.dayClose?.[0],
        dayHigh: entry.data?.dayHigh?.[0],
        dayLow: entry.data?.dayLow?.[0],
      });
    });

    const results = dataArray.map((item) => {
      const momentumSignals = [];
      const securityId = item.securityId;
      const stock = stockmap.get(securityId);
      const todayData = latestDataMap.get(securityId);
      // Validate candle data structure
      if (
        !item.high ||
        !item.low ||
        item.high.length < 4 ||
        item.low.length < 4
      ) {
        console.warn(`Skipping ${securityId} due to insufficient data`);
        return [];
      }

      const lastFourHigh = item.high.slice(-4);
      const lastFourLow = item.low.slice(-4);

      // Extract latest candle
      const latestHigh = todayData?.dayHigh;
      const latestLow = todayData?.dayLow;

      // Get previous 4 candles
      const prevFourHigh = lastFourHigh;
      const prevFourLow = lastFourLow;

      // Calculate percentage changes for previous 4 candles
      const percentageChanges = prevFourLow
        .map((low, i) =>
          i > 0 ? ((low - prevFourLow[i - 1]) / prevFourLow[i - 1]) * 100 : 0
        )
        .slice(1); // [change from 0->1, 1->2, 2->3]

      // Check bearish momentum loss (4 negative candles followed by positive)
      const allBearish = percentageChanges.every((change) => change < 0);
      const decreasingMomentum = percentageChanges.every(
        (change, i) =>
          i === 0 || Math.abs(change) < Math.abs(percentageChanges[i - 1])
      );
      const latestPositive = latestHigh > lastFourHigh[3];

      // Debug logging for Bullish Reversal
      console.log(`${securityId} Bullish Check:`, {
        percentageChanges,
        allBearish,
        decreasingMomentum,
        latestPositive,
        lastFourHigh,
        lastFourLow,
      });

      if (allBearish && decreasingMomentum && latestPositive) {
        momentumSignals.push({
          type: "Bullish Reversal",
          securityId,
          stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
          stockName: stock?.SYMBOL_NAME || "N/A",
          lastTradePrice: latestHigh,
          previousClosePrice: lastFourLow[3],
          percentageChange:
            ((latestHigh - lastFourLow[3]) / lastFourLow[3]) * 100,
        });
      }

      // Check bullish momentum loss (4 positive candles followed by negative)
      const allBullish = percentageChanges.every((change) => change > 0);
      const decreasingBullMomentum = percentageChanges.every(
        (change, i) => i === 0 || change < percentageChanges[i - 1]
      );
      const latestNegative = latestLow < lastFourLow[3];

      // Debug logging for Bearish Reversal
      console.log(`${securityId} Bearish Check:`, {
        percentageChanges,
        allBullish,
        decreasingBullMomentum,
        latestNegative,
        lastFourHigh,
        lastFourLow,
      });

      if (allBullish && decreasingBullMomentum && latestNegative) {
        momentumSignals.push({
          type: "Bearish Reversal",
          securityId,
          stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
          stockName: stock?.SYMBOL_NAME || "N/A",
          lastTradePrice: latestLow,
          previousClosePrice: lastFourHigh[3],
          percentageChange:
            ((latestLow - lastFourHigh[3]) / lastFourHigh[3]) * 100,
        });
      }

      return momentumSignals;
    });

    // Flatten the results array and filter out empty entries
    const finalResults = results.flat().filter((signal) => signal.length !== 0);

    // Log final results for debugging
    console.log("Final Results:", finalResults);

    // Save or update finalResults in the database
    if (finalResults.length > 0) {
      const savePromises = finalResults.map(async (signal) => {
        try {
          await DailyMomentumSignal.findOneAndUpdate(
            { securityId: signal.securityId }, // Find by securityId
            {
              $set: {
                type: signal.type,
                stockSymbol: signal.stockSymbol,
                stockName: signal.stockName,
                lastTradePrice: signal.lastTradePrice,
                previousClosePrice: signal.previousClosePrice,
                percentageChange: signal.percentageChange,
                timestamp: new Date(
                  new Date().getTime() + 5.5 * 60 * 60 * 1000
                ), // IST timestamp
              },
            },
            { upsert: true, new: true } // Upsert: insert if not found, update if found; return updated doc
          );
        } catch (dbError) {
          console.error(`Error saving/updating ${signal.securityId}:`, dbError);
        }
      });

      await Promise.all(savePromises);
      console.log("Momentum signals processed successfully");
    }
    const fullData = await DailyMomentumSignal.find();
    // Send response
    if (fullData.length === 0) {
      return res.status(200).json({
        message: "No momentum signals detected",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Momentum analysis complete",
      data: fullData,
    });
  } catch (error) {
    console.error("Error in  AIIntradayReversalFiveMin:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const AIMomentumCatcherFiveMins = async (req, res) => {
  try {
    const stocks = await StocksDetail.find();
    if (!stocks || stocks.length === 0) {
      return { message: "No stocks data found" };
    }

    const stockmap = new Map();
    stocks.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
        INDEX: entry.INDEX || [],
        SECTOR: entry.SECTOR || [],
        UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL,
        SYMBOL_NAME: entry.SYMBOL_NAME,
      });
    });

    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date");

    if (!latestEntry) {
      return res.status(404).json({ message: "No stock data available" });
    }

    const latestDate = latestEntry.date;
    const latestData = await MarketDetailData.find({ date: latestDate });

    if (latestData.length === 0) {
      return res
        .status(404)
        .json({ message: "No stock data available for the latest date" });
    }

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
    const yesterdayData = await MarketDetailData.find({
      date: previousDayDate,
    });

    const latestDataMap = new Map();
    latestData.forEach((entry) => {
      latestDataMap.set(
        entry.securityId,
        entry.data?.latestTradedPrice?.[0] || 0
      );
    });

    const yesterdayMap = new Map();
    yesterdayData.forEach((entry) => {
      yesterdayMap.set(entry.securityId, entry.data?.dayClose?.[0] || 0);
    });

    const tomorrow = new Date(latestDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    const data = await getData(latestDate, tomorrowFormatted);
    const dataArray = Array.from(data.values());

    if (dataArray.length === 0) {
      return { message: "No data found" };
    }

    const momentumStocks = dataArray
      .map((entry) => {
        const twocandelHigh = entry.high.slice(-2);
        const twocandelLow = entry.low.slice(-2);
        const [preHigh, crrHigh] = twocandelHigh;
        const [preLow, crrLow] = twocandelLow;

        const preHighLowDiff = preHigh - preLow;
        const currentDiff = crrHigh - crrLow;
        const hasMomentum = currentDiff >= preHighLowDiff * 1.5;

        const lastClose = entry.close.slice(-1)[0];
        const lastOpen = entry.open.slice(-1)[0];
        const isBullish = lastClose > lastOpen;
        const isBearish = lastClose < lastOpen;

        if (hasMomentum && (isBullish || isBearish)) {
          const stockDetails = stockmap.get(entry.securityId) || {};
          const dayClose = yesterdayMap.get(entry.securityId);
          const latestTradedPrice = latestDataMap.get(entry.securityId);

          const percentageChange =
            dayClose && !isNaN(dayClose) && !isNaN(latestTradedPrice)
              ? ((latestTradedPrice - dayClose) / dayClose) * 100
              : 0;

          return {
            securityId: entry.securityId,
            symbol_name: stockDetails.SYMBOL_NAME || "Unknown",
            symbol: stockDetails.UNDERLYING_SYMBOL || "Unknown",
            currentHigh: crrHigh,
            currentLow: crrLow,
            previousHigh: preHigh,
            previousLow: preLow,
            momentumType: isBullish ? "Bullish" : "Bearish",
            priceChange: currentDiff,
            percentageChange: percentageChange,
            sector: stockDetails.SECTOR,
            index: stockDetails.INDEX,
          };
        }
        return null;
      })
      .filter((stock) => stock !== null);

    momentumStocks.sort(
      (a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange)
    );

    console.log("momentumStocks", momentumStocks);

    // Save or update in MongoDB
    for (const stock of momentumStocks) {
      await MomentumStockFiveMin.findOneAndUpdate(
        { securityId: stock.securityId }, // Find by securityId
        { $set: stock }, // Update existing data
        { upsert: true, new: true } // Insert if not found
      );
    }

    return res.json({
      message: "Momentum stocks found and saved",
      count: momentumStocks.length,
      data: momentumStocks,
    })
  } catch (error) {
    console.error("Error in AIMomentumCatcherFiveMins:", error);
    return {
      message: "Internal server error",
      error: error.message,
    };
  }
};

const AIMomentumCatcherTenMins = async (req, res) => {
  try {
    const stocks = await StocksDetail.find();
    if (!stocks || stocks.length === 0) {
      return { message: "No stocks data found" };
    }

    const stockmap = new Map();
    stocks.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
        INDEX: entry.INDEX || [],
        SECTOR: entry.SECTOR || [],
        UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL,
        SYMBOL_NAME: entry.SYMBOL_NAME,
      });
    });

    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date");

    if (!latestEntry) {
      return res.status(404).json({ message: "No stock data available" });
    }

    const latestDate = latestEntry.date;

    console.log("Latest available date:", latestDate);

    const latestData = await MarketDetailData.find({ date: latestDate });

    if (latestData.length === 0) {
      return res
        .status(404)
        .json({ message: "No stock data available for the latest date" });
    }

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
    const yesterdayData = await MarketDetailData.find({
      date: previousDayDate,
    });

    const latestDataMap = new Map();
    latestData.forEach((entry) => {
      latestDataMap.set(
        entry.securityId,
        entry.data?.latestTradedPrice?.[0] || 0
      );
    });

    const yesterdayMap = new Map();
    yesterdayData.forEach((entry) => {
      yesterdayMap.set(entry.securityId, entry.data?.dayClose?.[0] || 0);
    });

    const tomorrow = new Date(latestDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    // console.log("Tomorrow's date (formatted):", tomorrowFormatted);

    const data = await getDataForTenMin(latestDate, tomorrowFormatted);
    const dataArray = Array.from(data.values());

    if (dataArray.length === 0) {
      return { message: "No data found" };
    }

    const momentumStocks = dataArray
      .map((entry) => {
        const twocandelHigh = entry.high.slice(-2);
        const twocandelLow = entry.low.slice(-2);
        const [preHigh, crrHigh] = twocandelHigh;
        const [preLow, crrLow] = twocandelLow;

        const preHighLowDiff = preHigh - preLow;
        const currentDiff = crrHigh - crrLow;
        const hasMomentum = currentDiff >= preHighLowDiff * 1.5;

        const lastClose = entry.close.slice(-1)[0];
        const lastOpen = entry.open.slice(-1)[0];
        const isBullish = lastClose > lastOpen;
        const isBearish = lastClose < lastOpen;

        if (hasMomentum && (isBullish || isBearish)) {
          const stockDetails = stockmap.get(entry.securityId) || {};
          const dayClose = yesterdayMap.get(entry.securityId);
          const latestTradedPrice = latestDataMap.get(entry.securityId);

          const percentageChange =
            dayClose && !isNaN(dayClose) && !isNaN(latestTradedPrice)
              ? ((latestTradedPrice - dayClose) / dayClose) * 100
              : 0;

          return {
            securityId: entry.securityId,
            symbol_name: stockDetails.SYMBOL_NAME || "Unknown",
            symbol: stockDetails.UNDERLYING_SYMBOL || "Unknown",
            currentHigh: crrHigh,
            currentLow: crrLow,
            previousHigh: preHigh,
            previousLow: preLow,
            momentumType: isBullish ? "Bullish" : "Bearish",
            priceChange: currentDiff,
            percentageChange: percentageChange,
            sector: stockDetails.SECTOR,
            index: stockDetails.INDEX,
          };
        }
        return null;
      })
      .filter((stock) => stock !== null);

    momentumStocks.sort(
      (a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange)
    );

    // console.log("momentumStocks", momentumStocks);

    // Save or update in MongoDB
    for (const stock of momentumStocks) {
      await MomentumStockTenMin.findOneAndUpdate(
        { securityId: stock.securityId }, // Find by securityId
        { $set: stock }, // Update existing data
        { upsert: true, new: true } // Insert if not found
      );
    }

    return res.json({
      message: "Momentum stocks found and saved",
      count: momentumStocks.length,
      data: momentumStocks,
    });
  } catch (error) {
    console.error("Error in AIMomentumCatcherFiveMins:", error);
    return {
      message: "Internal server error",
      error: error.message,
    };
  }
};

const DailyRangeBreakout = async (req, res) => {
  try {
    // Find the latest date in the database
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date");

    if (!latestEntry) {
      return res.status(404).json({ message: "No stock data available" });
    }

    const latestDate = latestEntry.date;
    const tomorrow = new Date(latestDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const previousFiveDaysDate = new Date(latestDate);
    previousFiveDaysDate.setDate(previousFiveDaysDate.getDate() - 30); // Fetch 30 days to ensure enough data

    const previousFiveDaysDateFormatted = previousFiveDaysDate
      .toISOString()
      .split("T")[0];
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    // Fetch daily data (assuming getDailyData returns a Map of aggregated daily data per stock)
    const data = await getDailyData(
      previousFiveDaysDateFormatted,
      tomorrowFormatted
    );

    if (!data || !(data instanceof Map)) {
      console.error("Invalid data format received from getDailyData:", data);
      return res.status(400).json({ message: "Invalid data format" });
    }

    const dataArray = Array.from(data.values());
    if (dataArray.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // Fetch stock details
    const stocks = await StocksDetail.find();
    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ message: "No stocks data found" });
    }

    const stockMap = new Map();
    stocks.forEach((entry) => {
      stockMap.set(entry.SECURITY_ID, {
        UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL || "N/A",
        SYMBOL_NAME: entry.SYMBOL_NAME || "N/A",
      });
    });

    // Fetch today's data from MarketDetailData
    const latestData = await MarketDetailData.find({ date: latestDate });
    if (latestData.length === 0) {
      return res
        .status(404)
        .json({ message: "No stock data available for the latest date" });
    }

    const latestDataMap = new Map();
    latestData.forEach((entry) => {
      latestDataMap.set(entry.securityId, {
        latestTradedPrice: entry.data?.latestTradedPrice?.[0],
        dayOpen: entry.data?.dayOpen ?? 0,
        dayClose: entry.data?.dayClose ?? 0,
        dayHigh: entry.data?.dayHigh ?? 0,
        dayLow: entry.data?.dayLow ?? 0,
      });
    });

    // Process data for range breakout
    const results = dataArray.map((item) => {
      const breakoutStocks = [];
      const securityId = item.securityId;
      const stock = stockMap.get(securityId);
      const todayData = latestDataMap.get(securityId);

      // Validate candle data (need at least 5 days: 1st + 3 range + today)
      if (
        !item.high ||
        !item.low ||
        item.high.length < 4 ||
        item.low.length < 4 ||
        !todayData
      ) {
        console.warn(`Skipping ${securityId} due to insufficient data`);
        return [];
      }

      const firstDayCandleHigh = item.high[0];
      const firstDayCandleLow = item.low[0];

      // Check if the next 3 days (indices 1, 2, 3) are within the range
      const inRange =
        item.high.slice(1, 4).every((high) => high <= firstDayCandleHigh) &&
        item.low.slice(1, 4).every((low) => low >= firstDayCandleLow);

      if (inRange) {
        // Check for breakout today (index 4 or todayData)
        const todayHigh = todayData.dayHigh;
        const todayLow = todayData.dayLow;
        const todayClose = todayData.dayClose;
        const todayOpen = todayData.dayOpen;
        const latestTradedPrice = todayData.latestTradedPrice?.[0];
        const preClose = item.close.slice(-1);
        // Breakout conditions
        const breakoutAbove = todayHigh > firstDayCandleHigh;
        const breakoutBelow = todayLow < firstDayCandleLow;

        if (breakoutAbove || breakoutBelow) {
          const percentageChange = latestTradedPrice
            ? ((latestTradedPrice - preClose) / preClose) * 100
            : 0;

          breakoutStocks.push({
            type: breakoutAbove ? "Breakout Bullish" : "Breakout Bearish",
            securityId,
            stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
            stockName: stock?.SYMBOL_NAME || "N/A",
            lastTradePrice: latestTradedPrice,
            previousClosePrice: item.dayClose?.[3] || 0, // Last day before today
            percentageChange,
            rangeHigh: firstDayCandleHigh,
            rangeLow: firstDayCandleLow,
            todayHigh,
            todayLow,
          });
        }
      }

      return res.json({breakoutStocks});
    });

    // Flatten and filter results
    const finalResults = results.flat().filter((signal) => signal.length !== 0);

    // Log for debugging
    console.log("Final Results:", finalResults);

    // Save or update results in the database
    if (finalResults.length > 0) {
      const savePromises = finalResults.map(async (signal) => {
        try {
          await DailyRangeBreakouts.findOneAndUpdate(
            { securityId: signal.securityId },
            {
              $set: {
                type: signal.type,
                stockSymbol: signal.stockSymbol,
                stockName: signal.stockName,
                lastTradePrice: signal.lastTradePrice,
                previousClosePrice: signal.previousClosePrice,
                percentageChange: signal.percentageChange,
                timestamp: new Date(
                  new Date().getTime() + 5.5 * 60 * 60 * 1000
                ), // IST
              },
            },
            { upsert: true, new: true }
          );
        } catch (dbError) {
          console.error(`Error saving/updating ${signal.securityId}:`, dbError);
        }
      });

      await Promise.all(savePromises);
      console.log("Breakout signals processed successfully");
    }

    const fullData = await DailyRangeBreakouts.find();
    if (fullData.length === 0) {
      return res.status(200).json({
        message: "No breakout signals detected",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Breakout analysis complete",
      data: fullData,
    });
  } catch (error) {
    console.error("Error in DailyRangeBreakout:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const DayHighLowReversal = async (req, res) => {
  try {
    const dayHighData = await getDayHighBreak();
    const dayLowData = await getDayLowBreak();

    if (!dayHighData && !dayLowData) {
      return res.status(404).json({
        success: false,
        message: "No data found for day high and low",
      });
    }

    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date");

    if (!latestEntry) {
      return res.status(404).json({ message: "No stock data available" });
    }

    const latestDate = latestEntry.date;
    const tomorrow = new Date(latestDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    const data = await getData(latestDate, tomorrowFormatted);
    const dataArray = Array.from(data.values());

    if (dataArray.length === 0) {
      return { message: "No data found" };
    }

    const dayHighBreakMap = new Map();
    const dayLowBreakMap = new Map();

    dayHighData?.dayHighBreak?.forEach((item) => {
      dayHighBreakMap.set(item.securityId, item);
    });

    dayLowData?.dayLowBreak?.forEach((item) => {
      dayLowBreakMap.set(item.securityId, item);
    });

    let highLowReversal = [];

    dataArray.forEach((item) => {
      const securityId = item.securityId;
      const High = item.high?.slice(-1);
      const Low = item.low?.slice(-1);
      const Open = item.open?.slice(-1);
      const Close = item.close?.slice(-1);

      const dayHighBreak = dayHighBreakMap.get(securityId);
      const dayLowBreak = dayLowBreakMap.get(securityId);

      const changePriceForHigh = dayHighBreak?.dayHigh * 0.01;
      const changePriceForLow = dayLowBreak?.dayLow * 0.01;

      let stockData = {
        securityId,
        stockSymbol: "N/A",
        stockName: "N/A",
        high: High,
        low: Low,
        open: Open,
        close: Close,
        type: "",
        percentageChange: "",
        timestamp: new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000),
      };

      if (dayHighBreak) {
        stockData.stockSymbol = dayHighBreak?.stock?.UNDERLYING_SYMBOL;
        stockData.stockName = dayHighBreak?.stock?.SYMBOL_NAME;
      } else if (dayLowBreak) {
        stockData.stockSymbol = dayLowBreak?.stock?.UNDERLYING_SYMBOL;
        stockData.stockName = dayLowBreak?.stock?.SYMBOL_NAME;
      }

      if (
        dayHighBreak &&
        Close <= dayHighBreak.dayHigh &&
        Open > Close &&
        Close > dayHighBreak.dayHigh - changePriceForHigh
      ) {
        stockData.type = "Bearish";
        stockData.dayHigh = dayHighBreak.dayHigh;
        stockData.percentageChange = dayHighBreak.percentageChange;
      }

      if (
        dayLowBreak &&
        Low <= dayLowBreak.dayLow &&
        Open < Close &&
        Close < dayLowBreak.dayLow + changePriceForLow
      ) {
        stockData.type = "Bullish";
        stockData.dayLow = dayLowBreak.dayLow;
        stockData.percentageChange = dayLowBreak.percentageChange;
      }

      if (stockData.type) {
        highLowReversal.push(stockData);
      }
    });

    if (highLowReversal.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No reversal data found.",
      });
    }

    // **Bulk upsert to save or update data**
    const bulkOps = highLowReversal.map((item) => ({
      updateOne: {
        filter: { securityId: item.securityId },
        update: { $set: item },
        upsert: true,
      },
    }));

    await HighLowReversal.bulkWrite(bulkOps);

    const highLowReversalData = await HighLowReversal.find();

    if (!highLowReversalData) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "High-Low Reversal data updated successfully.",
      data: highLowReversalData,
    });
  } catch (error) {
    console.log("Error in DayHighLowReversal:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const twoDayHLBreak = async (req, res) => {
  try {
    // Step 1: Find the last two unique trading days
    const uniqueTradingDays = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } }, // Group by date to get unique trading days
      { $sort: { _id: -1 } }, // Sort by date in descending order (latest first)
      { $limit: 3 }, // Get the latest three unique dates
    ]);

    if (!uniqueTradingDays || uniqueTradingDays.length < 3) {
      return res
        .status(404)
        .json({ message: "Not enough historical data found" });
    }

    const latestDate = uniqueTradingDays[0]._id;

    const tomorrow = new Date(latestDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    console.log("Latest available date:", latestDate);
    console.log("Tomorrow's date:", tomorrowFormatted);

    const fiveMinCandelData = await getData(latestDate, tomorrowFormatted);

    if (!fiveMinCandelData || !(fiveMinCandelData instanceof Map)) {
      console.error("Invalid data format received from getDailyData:", data);
      return res.status(400).json({ message: "Invalid data format" });
    }

    const dataArray = Array.from(fiveMinCandelData.values());
    if (dataArray.length === 0) {
      return { message: "No data found" };
    }

    const firstPrevTargetDate = uniqueTradingDays[1]._id;
    const secondPrevTargetDate = uniqueTradingDays[2]._id;

    const firstPrevStockData = await MarketDetailData.find({
      date: firstPrevTargetDate,
    });
    if (!firstPrevStockData || firstPrevStockData.length === 0) {
      return { message: "No stock data found for the selected dates" };
    }
    const secondPrevStockData = await MarketDetailData.find({
      date: secondPrevTargetDate,
    });

    if (!secondPrevStockData || secondPrevStockData.length === 0) {
      return { message: "No stock data found for the selected dates" };
    }

    // console.log("firstPrevStockData", firstPrevStockData);
    // console.log("secondPrevStockData", secondPrevStockData);

    const firstPrevStockDataMap = new Map();

    firstPrevStockData.forEach((item) => {
      // const stockData = item.data;
      // console.log(stockData)

      firstPrevStockDataMap.set(item.securityId, {
        securityId: item.securityId,
        dayOpen: item.data?.dayOpen?.[0],
        dayClose: item.data?.dayClose?.[0],
        dayHigh: item.data?.dayHigh?.[0],
        dayLow: item.data?.dayLow?.[0],
        date: item.date,
      });
    });
    const secondPrevStockDataMap = new Map();

    secondPrevStockData.forEach((item) => {
      secondPrevStockDataMap.set(item.securityId, {
        securityId: item.securityId,
        dayOpen: item.data?.dayOpen?.[0],
        dayClose: item.data?.dayClose?.[0],
        dayHigh: item.data?.dayHigh?.[0],
        dayLow: item.data?.dayLow?.[0],
        date: item.date,
      });
    });

    const stockDetails = await StocksDetail.find();

    if (!stockDetails) {
      return res.status(404).json({
        success: false,
        message: "No stocks info found",
      });
    }

    const stockDetailsMap = new Map();

    stockDetails.forEach((item) => {
      stockDetailsMap.set(item.SECURITY_ID, {
        symbolName: item.SYMBOL_NAME,
        underlyingSymbol: item.UNDERLYING_SYMBOL,
      });
    });

     let responseData = [];

    // the main logic
     dataArray.map((item) => {
      const securityId = item.securityId;
      const firstPrevDayData = firstPrevStockDataMap.get(securityId);
      const secondPrevDayData = secondPrevStockDataMap.get(securityId);
      const stocksDetail = stockDetailsMap.get(securityId);
      const fiveMinHigh = item?.high?.slice(-1);
      const fiveMinLow = item?.low?.slice(-1);
      const fiveMinOpen = item?.open?.slice(-1);
      const fiveMinClose = item?.close?.slice(-1);
      const firstPrevDayHigh = firstPrevDayData?.dayHigh;
      const firstPrevDayLow = firstPrevDayData?.dayLow;
      const secondPrevDayHigh = secondPrevDayData?.dayHigh;
      const secondPrevDayLow = secondPrevDayData?.dayLow;

      if (
        (firstPrevDayHigh <= secondPrevDayHigh + secondPrevDayHigh * 0.01 &&
          firstPrevDayHigh >= secondPrevDayHigh) ||
        (secondPrevDayHigh <= firstPrevDayHigh + firstPrevDayHigh * 0.01 &&
          secondPrevDayHigh >= firstPrevDayHigh)
      ) {

        const maxHigh = Math.max(firstPrevDayHigh,secondPrevDayHigh)
        
        if(fiveMinHigh > maxHigh){
          responseData.push({
            securityId,
            ...stocksDetail,
            fiveMinHigh,
            type:"Bullish",
            maxHigh,


          })

        }



      }


      if (
        (firstPrevDayLow >= secondPrevDayLow - secondPrevDayLow * 0.01 &&
          firstPrevDayLow <= secondPrevDayLow) ||
        (secondPrevDayLow >= firstPrevDayLow - firstPrevDayLow * 0.01 &&
          secondPrevDayLow <= firstPrevDayLow)
      ) {

        const minLow = Math.min(firstPrevDayLow,secondPrevDayLow)
        
        if(fiveMinLow < minLow){
          responseData.push({
            securityId,
            ...stocksDetail,
            fiveMinHigh,
            type:"Bearish",
            minLow,


          })

        }



      }





    });

    res.status(200).json({
      message: "Two Day High Low Break analysis complete",
      responseData,
    });
  } catch (error) {
    console.log("Error fetching stock data:", error.message);
  }
};

export {
  startWebSocket,
  getData,
  AIIntradayReversalFiveMins,
  AIMomentumCatcherFiveMins,
  AIMomentumCatcherTenMins,
  AIIntradayReversalDaily,
  DailyRangeBreakout,
  DayHighLowReversal,
  twoDayHLBreak,
};
