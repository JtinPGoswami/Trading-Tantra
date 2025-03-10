import dotenv from "dotenv";
// import WebSocket from "ws";
// import parseBinaryData from "./src/utils/parseBinaryData.js";
import connectDB from "./src/config/db.js";
import startWebSocket from "./src/controllers/liveMarketData.controller.js";

dotenv.config();

// const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;
// const CLIENT_ID = process.env.DHAN_CLIENT_ID;

// const WS_URL = `wss://api-feed.dhan.co?version=2&token=${ACCESS_TOKEN}&clientId=${CLIENT_ID}&authType=2`;

connectDB();
startWebSocket();
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




