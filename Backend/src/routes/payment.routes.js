import express from "express";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import { createOrder, verifyPayment } from "../controllers/payment.controllers.js";
import { razporpayWebhook } from "../controllers/webhook.controller.js";


const router = express.Router();


router.post('/createorder',createOrder);
router.post('/verify-payment',verifyPayment)

//webhook

router.post('/webhook',razporpayWebhook)



export default router;