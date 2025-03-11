import express from "express";
import {
  getStocks,
  getStocksData,
  getTopGainersAndLosers,
} from "../controllers/stock.contollers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";

const router = express.Router();

router.get("/get-stocks", verifyUser, getStocks);
// router.get('/get-fno-stocks', fetchAndStoreFNOData );
router.get("/get-turnover", getStocksData);
router.get("/get-top-gainers-and-losers", getTopGainersAndLosers);

export default router;
