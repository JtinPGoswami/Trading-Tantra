// ------------------------ TMP CODE FOR LIVE MARKET FEED ------------------------

import connectDB from "./src/config/db.js";
import MarketDetailData from "./src/models/marketData.model.js";
import StocksDetail from "./src/models/stocksDetail.model.js";

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