import StocksDetail from "../models/stocksDetail.model.js";
import { fetchData } from "../utils/fetchData.js";

import { WebSocket } from "ws";

const getStocks = async (req, res) => {
  try {
    const stocks = await StocksDetail.find();

    if (!stocks) {
      return res.status(404).json({ message: "No stocks found" });
    }

    res.status(200).json(stocks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};




const getOhlcData = async (req, res) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


  const stockList = await StocksDetail.find();
  const batchSize = 190;
  let securityId = stockList.map(stock => stock.SECURITY_ID);

  for (let i = 0; i < securityId.length; i += batchSize) {
    let batch = securityId.slice(i, i + batchSize);

    const batchNumber =  batch.map(Number);

    console.log('batchNumber',batchNumber)

     
    

    
    const requestBody = { "NSE_EQ": batchNumber };

    let data;

    try {
      const response = await fetchData("/marketfeed/ohlc", "POST", requestBody);

      data = response.data.data.NSE_EQ

      Object.entries(data).forEach(([key, value]) => {
        console.log('value',value.ohlc)
         
      })

   return data
      

    } catch (error) {
      console.error(`Error fetching batch ${i / batchSize + 1}:`, error);
       
    }

    await delay(5000); 
  }




 
}

const getHistoricalData = async (securityId) => {
  const requestBody = {
    securityId,
    exchangeSegment: "NSE_EQ",
    instrument: "EQUITY",
    expiryCode: 0,
    fromDate: "2025-03-07",
    toDate: "2025-03-08",
  };

  const response = await fetchData("/charts/historical", "POST", requestBody);

  return response.data;
};

// const fetchAndStoreFNOData = async (req,res) => {

//     try {
//         const fnoStocks = await StocksDetail.find()
//         let allstocks = []

//         for(const stocks of fnoStocks){
//           const stocksHistoricData = await getHistoricalData(stocks.SECURITY_ID);

//           if(!stocksHistoricData){
//              console.log("No historic data found",stocks.SECURITY_ID);
//              continue
//           }

//           allstocks.push({
//             securityId: stocks.SECURITY_ID,
//             historicaldata: stocksHistoricData
//           })

//           console.log("historic data found",stocks.SECURITY_ID);

//         }

//         console.log('allstock length',allstocks.length)
//         res.status(200).json(allstocks);

//     } catch (error) {

//         console.log('error in get fno stocks',error.message)

//         res.status(500).json({message:"Internal server error in get fno stocks",error:error.message});

//     }

// }

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const batchSize = 5; // Fetch 5 stocks at a time
const fetchAndStoreFNOData = async () => {
  try {
    const fnoStocks = await StocksDetail.find();
    for (let i = 0; i < fnoStocks.length; i += batchSize) {
      const batch = fnoStocks.slice(i, i + batchSize);

      const promises = batch.map((stock) =>
        getHistoricalData(stock.SECURITY_ID)
      );

      const results = await Promise.allSettled(promises);

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          console.log(`Data for ${batch[index].SECURITY_ID}:`, result.value);
        } else {
          console.log(
            `Error fetching ${batch[index].SECURITY_ID}:`,
            result.reason
          );
        }
      });

      await delay(2000); // 2-second delay between batches
    }
  } catch (error) {
    console.log("Error fetching stocks:", error.message);
  }
};

 

export { getStocks, fetchAndStoreFNOData,getOhlcData };
