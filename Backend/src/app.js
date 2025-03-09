import axios from 'axios'
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import "./config/passport.js";
import paymentRoutes from './routes/payment.routes.js'
import subscriptionPlanRoutes from './routes/subscriptionPlan.routes.js'
import stocksRoutes from './routes/stock.routes.js'
import { getOhlcData } from './controllers/stock.contollers.js';


 
 

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(passport.initialize());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/payment",paymentRoutes)
app.use('/api',subscriptionPlanRoutes)
app.use('/api',stocksRoutes)



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


// const getData = async () => {
//   const securityId = "3045";  
//   const fromDate = "2023-03-31";
//   const toDate = "2024-04-01";

//   try {
//     const data = await fetchHistoricalData(securityId, fromDate, toDate);
//     if (!data) throw new Error("No historical data received");
    
//     const turnover = calculateTurnover(data);
//     console.log(`Total Turnover of SBIN (NSE) from ${fromDate} to ${toDate}: ₹${turnover.toFixed(2)}`);
//   } catch (error) {
//     console.error("Error in getData:", error.message);
//   }
// };
// getData();



 

 
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

 

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server started on port ", PORT);
    });
  })
  .catch((error) => {
    console.log("Failed to connect ", error);
  });
