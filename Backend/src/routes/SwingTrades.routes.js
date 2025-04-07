import express from "express";
import { AICandleBreakers, AICandleReversal, AIContraction, FiveDayBO, TenDayBO } from "../controllers/AIswingTrades.controller.js";


const router = express.Router();



router.get('/five-days-bo',FiveDayBO)
router.get('/ten-days-bo',TenDayBO)
router.get('/ai-candle-reversal',AICandleReversal)
router.get('/ai-candle-breakers',AICandleBreakers)
router.get('/ai-contraction',AIContraction)

export default router
