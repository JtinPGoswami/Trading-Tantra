import express from "express";
import {
  getDayHighBreak,
  getDayLowBreak,
  getStocks,
  getStocksData,
  getTopGainersAndLosers,
  previousDaysVolume,
  sectorStockData,
} from "../controllers/stock.contollers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import {
  AIIntradayReversalDaily,
  AIIntradayReversalFiveMins,
  DailyRangeBreakout,
  startWebSocket,
} from "../controllers/liveMarketData.controller.js";
const router = express.Router();
router.get("/get-stocks", verifyUser, getStocks);
// router.get('/get-fno-stocks', fetchAndStoreFNOData );
router.get("/get-turnover", getStocksData);
router.get("/get-top-gainers-and-losers", getTopGainersAndLosers);
router.get("/get-day-high-break", getDayHighBreak);
router.get("/get-day-low-break", getDayLowBreak);
router.get("/previous-volume", previousDaysVolume);
router.get("/sector-data", sectorStockData);

router.get("/live-feed", startWebSocket);
router.get("/five-candel", AIIntradayReversalFiveMins);
router.get("/daily-candel", AIIntradayReversalDaily);
router.get("/daily-range-breakout", DailyRangeBreakout);

export default router;
