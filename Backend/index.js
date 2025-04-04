import dotenv from "dotenv";
// import WebSocket from "ws";
// import parseBinaryData from "./src/utils/parseBinaryData.js";
import connectDB from "./src/config/db.js";
import {
  getData,
  getDataForTenMin,
  startWebSocket,
} from "./src/controllers/liveMarketData.controller.js";

import cron from "node-cron";
import scrapeAndSaveFIIDIIData from "./src/jobs/scrapData_Two.js";

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

connectDB();
startWebSocket();
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
