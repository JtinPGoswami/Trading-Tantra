import connectDB from "./src/config/db.js";
import { fetchAndStoreFNOData } from "./src/controllers/stock.contollers.js";

// const getData = async () => {

//  connectDB();
//          let data = await fetchAndStoreFNOData();
//          console.log('data',data)
// }

// getData();
import dotenv from "dotenv";
import WebSocket from "ws";
import parseBinaryData from "./src/utils/parseBinaryData.js";

const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN;
const CLIENT_ID = process.env.DHAN_CLIENT_ID;

dotenv.config();

const WS_URL = `wss://api-feed.dhan.co?version=2&token=${ACCESS_TOKEN}&clientId=${CLIENT_ID}&authType=2`;

// Connect to MongoDB
connectDB();

const ws = new WebSocket(WS_URL);


ws.on("open", () => {
  console.log("✅ Connected to Dhan WebSocket");

  setTimeout(() => {
        const subscribeMessage = {
                RequestCode: 15,
                InstrumentCount: 2,
                InstrumentList: [
                    {
                        ExchangeSegment: "NSE_EQ",
                        SecurityId: "1333"
                    },
                    {
                        ExchangeSegment: "BSE_EQ",
                        SecurityId: "532540"
                    }
                ]
            };

    ws.send(JSON.stringify(subscribeMessage));
    console.log("Sent Subscription Request:", subscribeMessage);
  }, 1000);
});

ws.on("message", async (data) => {
  console.log("raw data", data);
  try {
    const parsedData = parseBinaryData(data); // Convert binary to readable format

    if (parsedData) {
      //       await saveStockData(parsedData);
      console.log("prssed data", parsedData);
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
});

// WebSocket Error Handling
ws.on("error", (error) => {
  console.error("❌ WebSocket Error:", error);
});

// WebSocket Close Event
ws.on("close", () => {
  console.log("❌ WebSocket Disconnected. Reconnecting...");
  setTimeout(() => startWebSocket(), 5000); // Reconnect after 5 sec
});
