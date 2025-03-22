import express from "express";
import {
  getDayHighBreak,
  getDayLowBreak,
  getStocksData,
  getTopGainersAndLosers,
  previousDaysVolume,
  sectorStockData,
} from "../controllers/stock.contollers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import {
  AIIntradayReversalDaily,
  AIIntradayReversalFiveMins,
  AIMomentumCatcherFiveMins,
  AIMomentumCatcherTenMins,
  DailyRangeBreakout,
  DayHighLowReversal,
  startWebSocket,
  twoDayHLBreak,
} from "../controllers/liveMarketData.controller.js";
import fiveMinMomentumSignal from "../models/fiveMInMomentumSignal.model.js";
import {
  AIContraction,
  dailyCandleReversal,
  fiveDayRangeBreakers,
  tenDayRangeBreakers,
} from "../controllers/swingAnalysis.controllers.js";
const router = express.Router();
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
router.get("/high-low-reversal", DayHighLowReversal);
router.get("/two-day-hl-break", twoDayHLBreak);
router.get("/five-min-momentum", AIMomentumCatcherFiveMins);
router.get("/tem-min-momentum", AIMomentumCatcherTenMins);

router.get("/five-day-break", fiveDayRangeBreakers);
router.get("/ten-day-break", tenDayRangeBreakers);
router.get("/daily-candel-revarsal", dailyCandleReversal);
router.get("/ai-contraction", AIContraction);

export default router;
