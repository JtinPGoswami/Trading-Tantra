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
import TwoDayHighLowBreak from "../models/twoDayHighLowBreak.model.js";

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
    const stocks = await StocksDetail.find({}, { SECURITY_ID: 1, _id: 0 });
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
  const stocks = await StocksDetail.find({}, { SECURITY_ID: 1, _id: 0 });
  // console.log("stock", stocks);
  const securityIds = stocks.map((stock) =>
    stock.SECURITY_ID.trim().toString()
  );

  // const formattedFromDate = new Date(today); // Today's date

  // const formattedToDate = new Date(today);
  // formattedToDate.setDate(formattedToDate.getDate() + 1); // Tomorrow's date

  // const fromDate = formattedFromDate.toISOString().split("T")[0];
  // const toDate = formattedToDate.toISOString().split("T")[0];

  const fiveMinCandelMap = new Map();
  try {
    function convertToIST(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
      return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    }

    // Example usage:
    // Outp

    for (let i = 0; i < securityIds.length; i++) {
      const data = await fetchHistoricalData(
        securityIds[i],
        fromDate,
        toDate,
        i
      );
      // console.log(data.timestamp,'timestamps');

      data.open = data?.open.slice(-5);
      data.high = data?.high.slice(-5);
      data.low = data?.low.slice(-5);
      data.close = data?.close.slice(-5);
      data.volume = data?.volume.slice(-5);
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

const getDailyData = async (fromDate, toDate) => {
  const stocks = await StocksDetail.find();
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
      data.timestamp = convertToIST(data.timestamp.slice(-4)[3]);
      data.securityId = data.securityId || securityIds[i];
      fiveMinCandelMap.set(securityIds[i], data);

      await delay(200); // Adjust delay (1000ms = 1 sec) based on API rate limits
    }
    return fiveMinCandelMap;
  } catch (error) {
    console.error("Error in getData:", error.message);
  }
};
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

const AIIntradayReversalFiveMins = async (req, res) => {
  try {
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date")
      .limit(1);

    if (!latestEntry) {
      return res.status(404).json({ message: "No stock data available" });
    }

    const latestDate = latestEntry.date;

    const tomorrow = new Date(latestDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    const previousEntry = await MarketDetailData.findOne({
      date: { $lt: latestDate },
    })
      .sort({ date: -1 })
      .limit(1);

    if (!previousEntry || previousEntry.length === 0) {
      return res
        .status(404)
        .json({ message: "Can't get data because date is not available" });
    }

    const latestData = await MarketDetailData.find(
      { date: latestDate },
      {
        securityId: 1,
        data: 1,
        _id: 0,
      }
    );

    if (!latestData || latestData.length === 0) {
      return res
        .status(404)
        .json({ message: "No latest stock data available" });
    }

    const latestDataMap = new Map();

    latestData.forEach((entry) => {
      latestDataMap.set(
        entry.securityId,
        entry.data?.latestTradedPrice?.[0] || 0
      );
    });

    const previousDate = previousEntry.date;

    const previousData = await MarketDetailData.find(
      { date: previousDate },
      {
        securityId: 1,
        data: 1,
        _id: 0,
      }
    );

    if (!previousData || previousData.length === 0) {
      return res
        .status(404)
        .json({ message: "No previous stock data available" });
    }

    const previousDayDataMap = new Map();

    previousData.forEach((entry) => {
      // console.log('entry',entry.data.dayClose?.[0]);
      previousDayDataMap.set(entry.securityId, entry.data?.dayClose?.[0] || 0);
    });

    const data = await getData(latestDate, tomorrowFormatted);

    // Check if data is valid and a Map
    if (!data || !(data instanceof Map)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Convert Map to an array
    const dataArray = Array.from(data.values());

    if (dataArray.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // Fetch stock details
    const stocks = await StocksDetail.find(
      {},
      { SYMBOL_NAME: 1, UNDERLYING_SYMBOL: 1, SECURITY_ID: 1, _id: 0 }
    );
    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ message: "No stocks data found" });
    }

    // Create a map for stock details
    const stockmap = new Map();
    stocks.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
        UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL,
        SYMBOL_NAME: entry.SYMBOL_NAME,
      });
    });

    // Process data to detect momentum signals
    const results = dataArray.map((item) => {
      const momentumSignals = [];
      const securityId = item.securityId;
      const stock = stockmap.get(securityId);
      const latestTradedPrice = latestDataMap.get(securityId);
      const previousDayClose = previousDayDataMap.get(securityId);
      const latestTimestamp = item.timestamp;
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

      const overAllPercentageChange =
        ((latestTradedPrice - previousDayClose) / previousDayClose) * 100; //this compare with prev day close and today latest price

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

      if (allBearish && decreasingMomentum && latestPositive) {
        momentumSignals.push({
          type: "Bullish Reversal",
          securityId,
          stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
          stockName: stock?.SYMBOL_NAME || "N/A",
          lastTradePrice: latestHigh,
          previousClosePrice: lastFiveLow[3],
          overAllPercentageChange,
          timestamp: latestTimestamp,
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

      if (allBullish && decreasingBullMomentum && latestNegative) {
        momentumSignals.push({
          type: "Bearish Reversal",
          securityId,
          stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
          stockName: stock?.SYMBOL_NAME || "N/A",
          lastTradePrice: latestLow,
          previousClosePrice: lastFiveHigh[3],
          overAllPercentageChange,
          timestamp: latestTimestamp,
          percentageChange:
            ((latestLow - lastFiveHigh[3]) / lastFiveHigh[3]) * 100,
        });
      }

      return momentumSignals;
    });

    // Flatten the results array and filter out empty entries
    const finalResults = results.flat().filter((signal) => signal.length !== 0);

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
                overAllPercentageChange: signal.overAllPercentageChange,
                timestamp: signal.timestamp,
              },
            },
            { upsert: true, new: true } // Upsert: insert if not found, update if found; return updated doc
          );
        } catch (dbError) {
          console.error(`Error saving/updating ${signal.securityId}:`, dbError);
        }
      });

      await Promise.all(savePromises);
    }
    const fullData = await fiveMinMomentumSignal
      .find(
        {},
        {
          _id: 0,
          __v: 0,
          lastTradePrice: 0,
          previousClosePrice: 0,
          updatedAt: 0,
        }
      )
      .sort({ timestamp: -1 })
      .lean();
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
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

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
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Convert Map to an array
    const dataArray = Array.from(data.values());

    if (dataArray.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // Fetch stock details
    const stocks = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, SYMBOL_NAME: 1, UNDERLYING_SYMBOL: 1, _id: 0 }
    );
    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ message: "No stocks data found" });
    }

    const previousEntry = await MarketDetailData.findOne({
      date: { $lt: latestDate },
    })
      .sort({ date: -1 })
      .limit(1);

    if (!previousEntry || previousEntry.length === 0) {
      return res
        .status(404)
        .json({ message: "Can't get data because date is not available" });
    }

    const previousDate = previousEntry.date;

    const previousData = await MarketDetailData.find(
      { date: previousDate },
      {
        securityId: 1,
        data: 1,
        _id: 0,
      }
    );

    if (!previousData || previousData.length === 0) {
      return res
        .status(404)
        .json({ message: "No previous stock data available" });
    }

    const previousDayDataMap = new Map();

    previousData.forEach((entry) => {
      // console.log('entry',entry.data.dayClose?.[0]);
      previousDayDataMap.set(entry.securityId, entry.data?.dayClose?.[0] || 0);
    });

    // Create a map for stock details
    const stockmap = new Map();
    stocks.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
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
      const latestTimestamp = item.timestamp;
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
      const latestTradedPrice =
        latestDataMap.get(securityId)?.latestTradedPrice;

      const previousDayClose = previousDayDataMap.get(securityId);

      const overALlPercentageChange =
        (latestTradedPrice - previousDayClose - previousDayClose) * 100;

      const lastFourHigh = item.high.slice(-4);
      const lastFourLow = item.low.slice(-4);

      // Extract latest candle
      const latestHigh = todayData?.dayHigh;
      const latestLow = todayData?.dayLow;

      // Get previous 4 candles
      // const prevFourHigh = lastFourHigh;
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

      if (allBearish && decreasingMomentum && latestPositive) {
        momentumSignals.push({
          type: "Bullish Reversal",
          securityId,
          stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
          stockName: stock?.SYMBOL_NAME || "N/A",
          lastTradePrice: latestHigh,
          previousClosePrice: lastFourLow[3],
          timestamp: latestTimestamp,
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

      if (allBullish && decreasingBullMomentum && latestNegative) {
        momentumSignals.push({
          type: "Bearish Reversal",
          securityId,
          stockSymbol: stock?.UNDERLYING_SYMBOL || "N/A",
          stockName: stock?.SYMBOL_NAME || "N/A",
          lastTradePrice: latestLow,
          previousClosePrice: lastFourHigh[3],
          timestamp: latestTimestamp,
          percentageChange:
            ((latestLow - lastFourHigh[3]) / lastFourHigh[3]) * 100,
        });
      }

      return momentumSignals;
    });

    // Flatten the results array and filter out empty entries
    const finalResults = results.flat().filter((signal) => signal.length !== 0);

    // Log final results for debugging

    // Save or update finalResults in the database
    if (finalResults?.length > 0) {
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
                overAllPercentageChange: signal.overAllPercentageChange,
                timestamp: signal.timestamp,
              },
            },
            { upsert: true, new: true } // Upsert: insert if not found, update if found; return updated doc
          );
        } catch (dbError) {
          console.error(`Error saving/updating ${signal.securityId}:`, dbError);
        }
      });

      await Promise.all(savePromises);
    }
    const fullData = await DailyMomentumSignal.find(
      {},
      {
        _id: 0,
        __v: 0,
        lastTradePrice: 0,
        previousClosePrice: 0,
        updatedAt: 0,
      }
    );
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
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const AIMomentumCatcherFiveMins = async (req, res) => {
  try {
    const stocks = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, SYMBOL_NAME: 1, UNDERLYING_SYMBOL: 1, _id: 0 }
    );
    if (!stocks || stocks.length === 0) {
      return { message: "No stocks data found" };
    }

    const stockmap = new Map();
    stocks.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
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
        const latestTimestamp = entry.timestamp;

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
            timestamp: latestTimestamp,
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
    // for (const stock of momentumStocks) {

    //  await MomentumStockFiveMin.findOneAndUpdate(
    //     { securityId: stock.securityId }, // Find by securityId
    //     { $set: stock }, // Update existing data
    //     { upsert: true, new: true } // Insert if not found
    //   );
    // }

    const bulkUpdates = momentumStocks.map((stock) => ({
      updateOne: {
        filter: { securityId: stock.securityId }, // Find by securityId
        update: { $set: stock }, // Update existing data
        upsert: true, // Insert if not found
      },
    }));
    if (bulkUpdates.length > 0) {
      await MomentumStockFiveMin.bulkWrite(bulkUpdates);
    }

    const updatedData = await MomentumStockFiveMin.find(
      {},
      {
        securityId: 1,
        symbol_name: 1,
        symbol: 1,
        _id: 0,
        momentumType: 1,
        timestamp: 1,
        percentageChange: 1,
      }
    );

    return res.json({
      message: "Momentum stocks found and saved",
      count: momentumStocks.length,
      updatedData,
    });
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
    const stocks = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, SYMBOL_NAME: 1, UNDERLYING_SYMBOL: 1, _id: 0 }
    );
    if (!stocks || stocks.length === 0) {
      return { message: "No stocks data found" };
    }

    const stockmap = new Map();
    stocks.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
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

    // console.log("Latest available date:", latestDate);

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
        const latestTimestamp = entry.timestamp;

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
            timestamp: latestTimestamp,
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
    // Step 1: Get the 5 most recent unique trading days
    const uniqueTradingDays = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } },
      { $sort: { _id: -1 } },
      { $limit: 5 }, // 5 days: today + 4 previous
    ]);

    if (uniqueTradingDays.length < 5) {
      return res
        .status(404)
        .json({ message: "Not enough historical data found" });
    }

    const targetDates = uniqueTradingDays.map(
      (day) => new Date(day._id).toISOString().split("T")[0]
    ); // Ensure Date objects

    const latestDate = targetDates[0]; // Most recent day
    const previousFormatted = targetDates[1]; // Previous day

    // Step 2: Fetch all data for these 5 days in one query
    const historicalData = await MarketDetailData.find(
      { date: { $in: targetDates } },
      {
        securityId: 1,
        "data.dayOpen": 1,
        "data.dayClose": 1,
        "data.dayHigh": 1,
        "data.dayLow": 1,
        "data.latestTradedPrice": 1,
        date: 1,
        _id: 0,
      }
    ).lean();

    if (!historicalData || historicalData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the target dates" });
    }

    // Step 3: Group data by date (normalize dates to strings for comparison)
    const groupedData = targetDates.reduce((acc, date) => {
      const dateStr = date; // Compare by YYYY-MM-DD
      acc[dateStr] = historicalData.filter((entry) => {
        const entryDateStr = new Date(entry.date).toISOString().split("T")[0];
        return entryDateStr === dateStr;
      });
      return acc;
    }, {});

    // Step 4: Prepare latest day and previous day data
    const latestDataMap = new Map();
    const prevDayCloseMap = new Map();

    const latestDateStr = latestDate;
    groupedData[latestDateStr].forEach((entry) => {
      latestDataMap.set(entry.securityId, {
        latestTradedPrice: entry.data?.[0]?.latestTradedPrice ?? 0,
        dayOpen: entry.data?.[0]?.dayOpen ?? 0,
        dayClose: entry.data?.[0]?.dayClose ?? 0,
        dayHigh: entry.data?.[0]?.dayHigh ?? 0,
        dayLow: entry.data?.[0]?.dayLow ?? 0,
      });
    });

    groupedData[previousFormatted].forEach((entry) => {
      prevDayCloseMap.set(entry.securityId, {
        dayClose: entry.data?.[0]?.dayClose ?? 0,
      });
    });

    // Step 5: Fetch stock details
    const stocks = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, SYMBOL_NAME: 1, UNDERLYING_SYMBOL: 1, _id: 0 }
    );
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

    // Step 6: Process data for range breakout
    let breakoutStocks = [];
    const securityIds = [
      ...new Set(historicalData.map((item) => item.securityId)),
    ];

    for (const securityId of securityIds) {
      const stockData = targetDates.map((date) => {
        const dateStr = date;
        return groupedData[dateStr].find(
          (entry) => entry.securityId === securityId
        );
      });

      // Ensure we have 5 days of data
      if (stockData.length < 5 || stockData.some((day) => !day)) {
        console.warn(`Skipping ${securityId} due to insufficient data`);
        continue;
      }

      const todayData = latestDataMap.get(securityId);
      const preCloseData = prevDayCloseMap.get(securityId);

      if (!todayData || !preCloseData) {
        console.warn(
          `Skipping ${securityId} due to missing today or previous data`
        );
        continue;
      }

      // Extract high/low for each day (reverse order: oldest to newest)
      const highs = stockData
        .map((day) => day.data?.[0]?.dayHigh ?? 0)
        .reverse();
      const lows = stockData.map((day) => day.data?.[0]?.dayLow ?? 0).reverse();

      const firstDayCandleHigh = highs[0];
      const firstDayCandleLow = lows[0];

      if (securityId === "3045") {
        console.log(
          "firstDayCandleHigh",
          firstDayCandleHigh,
          "firstDayCandleLow",
          firstDayCandleLow
        );
      }

      // Check if next 3 days are within the first day's range
      const inRange =
        highs.slice(1, 4).every((high) => high <= firstDayCandleHigh) &&
        lows.slice(1, 4).every((low) => low >= firstDayCandleLow);

      if (inRange) {
        const todayHigh = todayData.dayHigh;
        const todayLow = todayData.dayLow;
        const todayClose = todayData.dayClose;
        const todayOpen = todayData.dayOpen;
        const latestTradedPrice = todayData.latestTradedPrice;
        const preClose = preCloseData.dayClose;

        const breakoutAbove = todayHigh > firstDayCandleHigh;
        const breakoutBelow = todayLow < firstDayCandleLow;

        if (breakoutAbove || breakoutBelow) {
          const percentageChange = latestTradedPrice
            ? ((latestTradedPrice - preClose) / preClose) * 100
            : 0;

          breakoutStocks.push({
            type: breakoutAbove ? "Bullish" : "Bearish",
            securityId,
            stockSymbol: stockMap.get(securityId)?.UNDERLYING_SYMBOL || "N/A",
            stockName: stockMap.get(securityId)?.SYMBOL_NAME || "N/A",
            lastTradePrice: latestTradedPrice,
            previousClosePrice: preClose,
            percentageChange,
            rangeHigh: firstDayCandleHigh,
            rangeLow: firstDayCandleLow,
            todayHigh,
            todayLow,
          });
        }
      }
    }

    // console.log(breakoutStocks, "breakoutStocks");

    // Step 7: Save or update results
    if (breakoutStocks.length > 0) {
      const savePromises = breakoutStocks.map(async (signal) => {
        try {
          await DailyRangeBreakouts.findOneAndUpdate(
            { securityId: signal.securityId },
            {
              $set: {
                type: signal.type,
                stockSymbol: signal.stockSymbol,
                stockName: signal.stockName,
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

    const fullData = await DailyRangeBreakouts.find(
      {},
      {
        _id: 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0,
        lastTradePrice: 0,
        previousClosePrice: 0,
      }
    )
      .sort({ timestamp: -1 })
      .lean();
    if (fullData.length === 0) {
      return {
        message: "No breakout signals detected",
        data: [],
      };
    }

    return {
      message: "Breakout analysis complete",
      data: fullData,
    };
  } catch (error) {
    console.error("Error in DailyRangeBreakout:", error);
    return {
      message: "Internal server error",
      error: error.message,
    };
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
      const latestTimestamp = item.timestamp;

      // console.log('itemmmmm',latestTimestamp)

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
        timestamp: "",
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
        stockData.timestamp = latestTimestamp;
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
        stockData.timestamp = latestTimestamp;
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

    const fiveMinCandelData = await getData(latestDate, tomorrowFormatted);

    if (!fiveMinCandelData || !(fiveMinCandelData instanceof Map)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const dataArray = Array.from(fiveMinCandelData.values());
    if (dataArray.length === 0) {
      return { message: "No data found" };
    }

    const firstPrevTargetDate = uniqueTradingDays[1]._id;
    const secondPrevTargetDate = uniqueTradingDays[2]._id;

    const firstPrevStockData = await MarketDetailData.find(
      {
        date: firstPrevTargetDate,
      },
      {
        securityId: 1,
        "data.dayOpen": 1,
        date: 1,
        "data.dayClose": 1,
        "data.dayHigh": 1,
        "data.dayLow": 1,
        "data.latestTradedPrice": 1,
        _id: 0,
      }
    );
    if (!firstPrevStockData || firstPrevStockData.length === 0) {
      return { message: "No stock data found for the selected dates" };
    }
    const secondPrevStockData = await MarketDetailData.find(
      {
        date: secondPrevTargetDate,
      },
      {
        securityId: 1,
        "data.dayOpen": 1,
        date: 1,
        "data.dayClose": 1,
        "data.dayHigh": 1,
        "data.dayLow": 1,
        _id: 0,
      }
    );

    if (!secondPrevStockData || secondPrevStockData.length === 0) {
      return { message: "No stock data found for the selected dates" };
    }

    const firstPrevStockDataMap = new Map();

    firstPrevStockData.forEach((item) => {
      firstPrevStockDataMap.set(item.securityId, {
        securityId: item.securityId,
        dayOpen: item.data?.dayOpen?.[0],
        dayClose: item.data?.dayClose?.[0],
        dayHigh: item.data?.dayHigh?.[0],
        dayLow: item.data?.dayLow?.[0],
        date: item.date,
        latestTradedPrice: item.data?.latestTradedPrice?.[0],
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

    const stockDetails = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, SYMBOL_NAME: 1, UNDERLYING_SYMBOL: 1 }
    );

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
      const fiveMinHigh = item?.high?.slice(-1)[0];
      const fiveMinLow = item?.low?.slice(-1);
      const fiveMinOpen = item?.open?.slice(-1);
      const fiveMinClose = item?.close?.slice(-1);
      const firstPrevDayHigh = firstPrevDayData?.dayHigh;
      const firstPrevDayLow = firstPrevDayData?.dayLow;
      const secondPrevDayHigh = secondPrevDayData?.dayHigh;
      const secondPrevDayLow = secondPrevDayData?.dayLow;
      const secondPrevDayClose = secondPrevDayData?.dayClose;
      const latestTradedPrice = firstPrevDayData?.latestTradedPrice;
      const latestTimestamp = item.timestamp;
      const percentageChange =
        ((latestTradedPrice - secondPrevDayClose) / secondPrevDayClose) * 100;
      console.log("percentageChange", percentageChange);

      if (
        (firstPrevDayHigh <= secondPrevDayHigh + secondPrevDayHigh * 0.01 &&
          firstPrevDayHigh >= secondPrevDayHigh) ||
        (secondPrevDayHigh <= firstPrevDayHigh + firstPrevDayHigh * 0.01 &&
          secondPrevDayHigh >= firstPrevDayHigh)
      ) {
        const maxHigh = Math.max(firstPrevDayHigh, secondPrevDayHigh);

        if (fiveMinHigh > maxHigh) {
          responseData.push({
            securityId,
            ...stocksDetail,
            fiveMinHigh,
            type: "Bullish",
            maxHigh,
            timestamp: latestTimestamp,
            percentageChange,
          });
        }
      }

      if (
        (firstPrevDayLow >= secondPrevDayLow - secondPrevDayLow * 0.01 &&
          firstPrevDayLow <= secondPrevDayLow) ||
        (secondPrevDayLow >= firstPrevDayLow - firstPrevDayLow * 0.01 &&
          secondPrevDayLow <= firstPrevDayLow)
      ) {
        const minLow = Math.min(firstPrevDayLow, secondPrevDayLow);

        if (fiveMinLow < minLow) {
          responseData.push({
            securityId,
            ...stocksDetail,
            fiveMinHigh,
            type: "Bearish",
            minLow,
            timestamp: latestTimestamp,
            percentageChange,
          });
        }
      }
    });

    const bulkOps = responseData.map((item) => ({
      updateOne: {
        filter: { securityId: item.securityId },
        update: { $set: item },
        upsert: true,
      },
    }));

    await TwoDayHighLowBreak.bulkWrite(bulkOps);

    const data = await TwoDayHighLowBreak.find(
      {},
      {
        securityId: 1,
        symbolName: 1,
        underlyingSymbol: 1,
        type: 1,
        timestamp: 1,
        percentageChange: 1,
        _id: 0,
      }
    );

    res.status(200).json({
      message: "Two Day High Low Break analysis complete",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
