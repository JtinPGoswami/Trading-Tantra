import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import http from "http";
import "./src/config/passport.js";

import stocksRoutes from "./src/routes/stock.routes.js";
import feedbackRoute from "./src/routes/feedback.route.js";
import {
  getDayLowBreak,
  getDayHighBreak,
  getStocksData,
  getTopGainersAndLosers,
  previousDaysVolume,
  sectorStockData,
} from "./src/controllers/stock.contollers.js";
import { getSocketInstance, initializeServer } from "./src/config/socket.js";
import holidayJob from "./src/jobs/holiday.job.js";
//  import scheduleMarketJob from "./jobs/liveMarket.job.js";
import { send } from "process";
import {
  AIIntradayReversalFiveMins,
  AIMomentumCatcherFiveMins,
  AIMomentumCatcherTenMins,
  DailyRangeBreakout,
  DayHighLowReversal,
  twoDayHLBreak,
} from "./src/controllers/liveMarketData.controller.js";
import paymentRoutes from "./src/routes/payment.routes.js";

import {
  AIContraction,
  dailyCandleReversal,
  fiveDayRangeBreakers,
  tenDayRangeBreakers,
} from "./src/controllers/swingAnalysis.controllers.js";
import isSubscribedRoute from "./src/routes/isSubscribed.js";

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
      origin: "*", // This allows all origins
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", stocksRoutes);
app.use("/api", feedbackRoute);
app.use("/api", isSubscribedRoute);

// async function sendData() {
//   try {
//     if (!socket) {
//       console.error("Socket instance is not available.");
//       return;
//     }

//     console.log("Fetching and sending stock data...");
//     console.log('-----------------------------------')

//     const [
//       response,
//       dayHighBreakResponse,
//       getTopGainersAndLosersResponse,
//       dayLowBreakResponse,
//       previousDaysVolumeResponse,
//     ] = await Promise.allSettled([
//       getStocksData(),
//       getDayHighBreak(),
//       getTopGainersAndLosers(),
//       getDayLowBreak(),
//       previousDaysVolume(),
//     ]);

//     if (response.status === "fulfilled")
//       socket.emit("turnOver", response.value);

//     if (dayHighBreakResponse.status === "fulfilled")
//       socket.emit("dayHighBreak", dayHighBreakResponse.value);
//     if (getTopGainersAndLosersResponse.status === "fulfilled")
//       socket.emit(
//         "getTopGainersAndLosers",
//         getTopGainersAndLosersResponse.value
//       );
//     if (dayLowBreakResponse.status === "fulfilled")
//       socket.emit("dayLowBreak", dayLowBreakResponse.value);
//     if (previousDaysVolumeResponse.status === "fulfilled")
//       socket.emit("previousDaysVolume", previousDaysVolumeResponse.value);

//     console.log("Data sent successfully... 👍");
//   } catch (error) {
//     console.error("Error sending data:", error);
//   }
// }

// let isSent = false;

// if (isSent) {
//   setInterval(sendData, 20000);
// } else {
//   sendData();
//   isSent = true;
// }

// async function sendSectorData() {
//   try {
//     const socket = getSocketInstance();
//     if (!socket) {
//       console.error("Socket instance is not available.");
//       return;
//     }

//     console.log("Fetching and sending sector stock data...");

//     const [response] = await Promise.allSettled([sectorStockData()]);

//     if (response.status === "fulfilled")
//       socket.emit("sectorScope", response.value);

//     console.log("Data sector sent successfully... 👍");
//   } catch (error) {
//     console.error("Error sending data:", error);
//   }
// }

// ✅ **Run `sendData()` immediately**
// sendSectorData();

// setInterval(sendSectorData, 20000);

// async function sendSmartMoneyActionData() {
//   try {
//     const socket = getSocketInstance();
//     if (!socket) {
//       console.error("Socket instance is not available.");
//       return;
//     }

//     console.log("Fetching and sending smart money action data stock...");

//     const [
//       twoDayHLBreakResponse,
//       DayHighLowReversalResponse,
//       DailyRangeBreakoutResponse,
//       AIMomentumCatcherTenMinsResponse,
//       AIMomentumCatcherFiveMinsResponse,
//       AIIntradayReversalFiveMinsResponse,
//     ] = await Promise.allSettled([
//       twoDayHLBreak(),
//       DayHighLowReversal(),
//       DailyRangeBreakout(),
//       AIMomentumCatcherTenMins(),
//       AIMomentumCatcherFiveMins(),
//       AIIntradayReversalFiveMins(),
//     ]);

//     if (twoDayHLBreakResponse.status === "fulfilled")
//       socket.emit("twoDayHLBreak", twoDayHLBreakResponse.value);

//     if (DayHighLowReversalResponse.status === "fulfilled")
//       socket.emit("DayHighLowReversal", DayHighLowReversalResponse.value);

//     if (DailyRangeBreakoutResponse.status === "fulfilled")
//       socket.emit("DailyRangeBreakout", DailyRangeBreakoutResponse.value);

//     if (AIMomentumCatcherTenMinsResponse.status === "fulfilled")
//       socket.emit(
//         "AIMomentumCatcherTenMins",
//         AIMomentumCatcherTenMinsResponse.value
//       );

//     if (AIMomentumCatcherFiveMinsResponse.status === "fulfilled")
//       socket.emit(
//         "AIMomentumCatcherFiveMins",
//         AIMomentumCatcherFiveMinsResponse.value
//       );

//     if (AIIntradayReversalFiveMinsResponse.status === "fulfilled")
//       socket.emit(
//         "AIIntradayReversalFiveMins",
//         AIIntradayReversalFiveMinsResponse.value
//       );

//     console.log("Data sent successfully... 👍");
//   } catch (error) {
//     console.error("Error sending data:", error);
//   }
// }

// ✅ **Run `sendData()` immediately**
// sendSmartMoneyActionData();

// setInterval(sendSectorDat, 20000);

// async function sendSwingData() {
//   try {
//     const socket = getSocketInstance();
//     if (!socket) {
//       console.error("Socket instance is not available.");
//       return;
//     }

//     console.log("Fetching and sending sector stock data...");

//     const [
//       fiveDayRangeBreakersResponse,
//       tenDayRangeBreakersResponse,
//       dailyCandleReversalResponse,
//       AIContractionResponse,
//       DailyRangeBreakoutResponse,
//     ] = await Promise.allSettled([
//       fiveDayRangeBreakers(),
//       tenDayRangeBreakers(),
//       dailyCandleReversal(),
//       AIContraction(),
//       DailyRangeBreakout(),
//     ]);

//     if (fiveDayRangeBreakersResponse.status === "fulfilled")
//       socket.emit("fiveDayRangeBreakers", fiveDayRangeBreakersResponse.value);
//     if (tenDayRangeBreakersResponse.status === "fulfilled")
//       socket.emit("tenDayRangeBreakers", tenDayRangeBreakersResponse.value);
//     if (dailyCandleReversalResponse.status === "fulfilled")
//       socket.emit("setDailyCandleReversal", dailyCandleReversalResponse.value);
//     if (AIContractionResponse.status === "fulfilled")
//       socket.emit("AIContraction", AIContractionResponse.value);
//     if (DailyRangeBreakoutResponse.status === "fulfilled")
//       socket.emit("DailyRangeBreakout", DailyRangeBreakoutResponse.value);

//     console.log("Swing Data  successfully... 👍");
//   } catch (error) {
//     console.error("Error sending data:", error);
//   }
// }

// ✅ **Run `sendData()` immediately**
// sendSwingData();

// setInterval(sendSwingData, 20000);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server started on port ", PORT);
    });
  })
  .catch((error) => {
    console.log("Failed to connect ", error);
  });

export { app, server };
