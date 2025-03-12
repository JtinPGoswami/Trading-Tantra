import express from "express";
import {
  getDayHighBreak,
  getDayLowBreak,
  getStocks,
  getStocksData,
  getTopGainersAndLosers,
} from "../controllers/stock.contollers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import startWebSocket from "../controllers/liveMarketData.controller.js";

const router = express.Router();

router.get("/get-stocks", verifyUser, getStocks);
// router.get('/get-fno-stocks', fetchAndStoreFNOData );
router.get("/get-turnover", getStocksData);
router.get("/get-top-gainers-and-losers", getTopGainersAndLosers);
router.get("/get-day-high-break", getDayHighBreak);
router.get("/get-day-low-break", getDayLowBreak);

router.get('/live-feed',startWebSocket)

export default router;
