import WebSocket from "ws";
import MarketDetailData from "../models/marketData.model.js";
import connectDB from "../config/db.js";
import StocksDetail from "../models/stocksDetail.model.js";
import parseBinaryData from "../utils/parseBinaryData.js";

const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;
const CLIENT_ID = process.env.DHAN_CLIENT_ID;
const WS_URL = `wss://api-feed.dhan.co?version=2&token=${ACCESS_TOKEN}&clientId=${CLIENT_ID}&authType=2`;

let securityIdList = [];
const securityIdMap = new Map();
let marketDataBuffer = new Map(); // Store batch data

// Fetch security IDs from database
const fetchSecurityIds = async () => {
  try {
    const stocks = await StocksDetail.find();
    securityIdList = stocks.map((stock) => stock.SECURITY_ID);
  } catch (error) {
    console.error("Error fetching security IDs:", error);
    throw error;
  }
};

// Function to split security IDs into batches of 100
const splitIntoBatches = (array, batchSize) => {
  const batches = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
};

const calculateTurnover = (avgPrice, volume) => {
  const turnover = Number(avgPrice * volume).toFixed(2);
  // console.log("turnover", turnover, "avgPrice", avgPrice, "volume", volume);
  return turnover;
};

const saveMarketData = async () => {
  if (marketDataBuffer.size === 0) return;

  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const savePromises = Array.from(marketDataBuffer.entries()).map(
    async ([securityId, marketData]) => {
      try {
        const turnover = calculateTurnover(
          marketData[0].avgTradePrice,
          marketData[0].volume
        );
        console.log("turnover", turnover);
        await MarketDetailData.findOneAndUpdate(
          { date: todayDate, securityId: securityId },
          { $set: { data: marketData, turnover } },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(`❌ Error saving data for ${securityId}:`, error);
      }
    }
  );

  try {
    await Promise.all(savePromises);
    console.log(`💾 Successfully saved ${savePromises.length} records.`);
  } catch (error) {
    console.error("❌ Error in bulk save:", error);
  }

  marketDataBuffer.clear(); // Clear buffer after saving
};

async function startWebSocket() {
  console.log("🔄 Fetching security IDs...");

  await fetchSecurityIds();

  console.log("Fetched Security IDs:", securityIdList);

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
    console.log("🔹 Raw Binary Data Received");

    try {
      const marketData = parseBinaryData(data);
      // console.log("🔎 Parsed Market Data:", marketData); // Debugging

      if (marketData && marketData.securityId) {
        const securityId = marketData.securityId;

        if (!marketDataBuffer.has(securityId)) {
          marketDataBuffer.set(securityId, []);
        }
        marketDataBuffer.get(securityId).push(marketData); // Append data instead of replacing
        console.log(`📈 Data buffered for Security ID: ${securityId}`);
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
    setTimeout(startWebSocket, 2000);
  });

  // Save market data every 10 seconds (adjust as needed)
  setInterval(saveMarketData, 10000);
}

export default startWebSocket;
