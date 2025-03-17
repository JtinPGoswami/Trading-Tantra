import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import http, { get } from "http";
import "./config/passport.js";
import paymentRoutes from "./routes/payment.routes.js";
import subscriptionPlanRoutes from "./routes/subscriptionPlan.routes.js";
import stocksRoutes from "./routes/stock.routes.js";
import startWebSocket from "./controllers/liveMarketData.controller.js";
import { getStocksData } from "./controllers/stock.contollers.js";
import { getSocketInstance, initializeServer } from "./config/socket.js";
import { fetchHistoricalData } from "./utils/fetchData.js";
import StocksDetail from "./models/stocksDetail.model.js";
import { stocksData } from "./f&o.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(passport.initialize());
initializeServer(server);
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api", subscriptionPlanRoutes);
app.use("/api", stocksRoutes);

// getOhlcData();

// const getHistoricalData = async () => {

//   // const stockList = await StocksDetail.find();

//   // let securityId = stockList.map((stock) => stock.SECURITY_ID);

//   const requestBody = {

//       // "NSE_EQ":[100,1099,1023,10243,10440,10447,10599,10604,10666,10726],

//     securityId: ['100','1099'],
//     exchangeSegment: "NSE_EQ",
//     instrument: "EQUITY",
//     expiryCode: 0,
//     fromDate: "2025-03-07",
//     toDate: "2025-03-08",
//   };
//   const response = await fetchData("/charts/historical", "POST",requestBody);

//   console.log("Final Response for OHLC:", response.data);

//   // const averagePrice =  (  response.data.open[0] + response.data.high[0] + response.data.low[0] + response.data.close[0]) / 4;
//   //   const turnover = averagePrice * response.data.volume[0];
//   //   console.log('turnover',turnover)

// };

// getHistoricalData();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const getData = async () => {

  const stocks = stocksData
  // console.log('stock',stocks)
  const securityIds = stocks.map((stock) => stock.SECURITY_ID);
  const fromDate = "2025-03-01";
  const toDate = "2025-03-17";

console.log('security is', securityIds)
 
    try {
      for (let i = 0; i < securityIds.length; i++) {
       const data = await fetchHistoricalData(securityIds[i],fromDate,toDate );
       console.log(`data for security id ${securityIds[i]}`,data?.open)
        await delay(500); // Adjust delay (1000ms = 1 sec) based on API rate limits
    }

  
    //   const turnover = calculateTurnover(data);
    //   console.log(`Total Turnover of SBIN (NSE) from ${fromDate} to ${toDate}: ₹${turnover.toFixed(2)}`);
    } catch (error) {
      console.error("Error in getData:", error.message);
    }

  }
getData();

// const API_URL = 'https://api.dhan.co/market/instruments?segment=FO';

// const ACCESS_TOKEN = process.env.DHAN_ACCESS_TOKEN; // Replace with your actual token
// const CLIENT_ID = process.env.DHAN_CLIENT_ID; // Replace with your actual client ID

// async function fetchFOInstruments() {
//     try {
//         const response = await axios.get(API_URL, {
//             headers: {
//                 "Accept": "application/json",
//                 "access-token": ACCESS_TOKEN,
//                 "client-id": CLIENT_ID
//             }
//         });

//         const instruments = response.data;

//         // Filtering only Futures & Options instruments
//         const foInstruments = instruments.filter(instr =>
//             ["FUTSTK", "OPTSTK", "FUTIDX", "OPTIDX"].includes(instr.instrumentType)
//         );

//         const securityIds = foInstruments.map(instr => ({
//             symbol: instr.tradingSymbol,
//             securityId: instr.securityId,
//             instrumentType: instr.instrumentType
//         }));

//         console.log(securityIds);
//     } catch (error) {
//         console.error("Error fetching instruments:", error.response?.data || error.message);
//     }
// }

// fetchFOInstruments();

async function getTurnover() {
  try {
    const response = await getStocksData();
    getSocketInstance().emit("turnOver", response);
    console.log('start.....👍')
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(getTurnover, 20000);
  }
}

getTurnover();

const PORT = process.env.PORT || 3000;

// startWebSocket();
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server started on port ", PORT);

      // startWebSocket();
    });
  })
  .catch((error) => {
    console.log("Failed to connect ", error);
  });

export { app, server };
