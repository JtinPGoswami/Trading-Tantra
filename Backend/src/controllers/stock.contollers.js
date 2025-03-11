import MarketDetailData from "../models/marketData.model.js";
import StocksDetail from "../models/stocksDetail.model.js";

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

// // const fetchAndStoreFNOData = async (req,res) => {

// //     try {
// //         const fnoStocks = await StocksDetail.find()
// //         let allstocks = []

// //         for(const stocks of fnoStocks){
// //           const stocksHistoricData = await getHistoricalData(stocks.SECURITY_ID);

// //           if(!stocksHistoricData){
// //              console.log("No historic data found",stocks.SECURITY_ID);
// //              continue
// //           }

// //           allstocks.push({
// //             securityId: stocks.SECURITY_ID,
// //             historicaldata: stocksHistoricData
// //           })

// //           console.log("historic data found",stocks.SECURITY_ID);

// //         }

// //         console.log('allstock length',allstocks.length)
// //         res.status(200).json(allstocks);

// //     } catch (error) {

// //         console.log('error in get fno stocks',error.message)

// //         res.status(500).json({message:"Internal server error in get fno stocks",error:error.message});

// //     }

// // }

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// const batchSize = 5; // Fetch 5 stocks at a time
// // const fetchAndStoreFNOData = async () => {
// //   try {
// //     const fnoStocks = await StocksDetail.find();
// //     for (let i = 0; i < fnoStocks.length; i += batchSize) {
// //       const batch = fnoStocks.slice(i, i + batchSize);

// //       const promises = batch.map((stock) =>
// //         getHistoricalData(stock.SECURITY_ID)
// //       );

// //       const results = await Promise.allSettled(promises);

// //       results.forEach((result, index) => {
// //         if (result.status === "fulfilled") {
// //           console.log(`Data for ${batch[index].SECURITY_ID}:`, result.value);
// //         } else {
// //           console.log(
// //             `Error fetching ${batch[index].SECURITY_ID}:`,
// //             result.reason
// //           );
// //         }
// //       });

// //       await delay(2000); // 2-second delay between batches
// //     }
// //   } catch (error) {
// //     console.log("Error fetching stocks:", error.message);
// //   }
// // };

const getStocksData = async (req, res) => {
  try {
    const stocksData = await MarketDetailData.find({
      date: new Date().toISOString().split("T")[0],
    });
    console.log("stocks Data", stocksData.data);
    if (stocksData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No stocks found" });
    }

    const response = await Promise.all(
      stocksData.map(async (stock) => {
        const share = await StocksDetail.find(
          { SECURITY_ID: stock.securityId },
          {
            _id: 1,
            SECURITY_ID: 1,
            UNDERLYING_SYMBOL: 1,
            SYMBOL_NAME: 1,
            DISPLAY_NAME: 1,
          }
        );

        if (!share || share.length === 0) return null;

        return {
          share,
          turnover: stock.turnover,
        };
      })
    );

    const filteredResponse = response
      .filter((item) => item !== null)
      .sort((a, b) => b.turnover - a.turnover);

    res.status(200).json({ success: true, data: filteredResponse });
  } catch (error) {
    console.error("Error fetching stocks data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getTopGainersAndLosers = async (req, res) => {
  try {
    const todayDate = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const formattedYesterday = yesterdayDate.toISOString().split("T")[0];

    const todayData = await MarketDetailData.find({ date: todayDate });
    const yesterdayData = await MarketDetailData.find({
      date: formattedYesterday,
    });

    if (todayData.length === 0 || yesterdayData.length === 0) {
      return res
        .status(404)
        .json({ message: "Not enough data to calculate gainers & losers" });
    }

    const yesterdayMap = new Map();
    yesterdayData.forEach((entry) => {
      yesterdayMap.set(entry.securityId, entry.data?.dayClose || 0);
    });

    const gainers = [];
    const losers = [];

    const stockIds = todayData.map((entry) => entry.securityId);
    const stockDetailsMap = new Map();

    const stockDetails = await StocksDetail.find(
      { SECURITY_ID: { $in: stockIds } },
      { UNDERLYING_SYMBOL: 1, SYMBOL_NAME: 1, SECURITY_ID: 1 }
    );

    stockDetails.forEach((stock) => {
      stockDetailsMap.set(stock.SECURITY_ID, stock);
    });

    todayData.forEach((todayEntry) => {
      const prevClose = yesterdayMap.get(todayEntry.securityId);
      if (!prevClose || prevClose === 0) return;

      const latestPrice = todayEntry.data?.latestTradedPrice || 0;
      if (latestPrice === 0) return;

      const percentageChange = ((latestPrice[0] - prevClose) / prevClose) * 100;
      const stockDetail = stockDetailsMap.get(todayEntry.securityId) || {};

      const result = {
        securityId: todayEntry.securityId,
        stockSymbol: stockDetail.UNDERLYING_SYMBOL || "N/A",
        stockName: stockDetail.SYMBOL_NAME || "N/A",
        lastTradePrice: latestPrice,
        previousClosePrice: prevClose,
        percentageChange: percentageChange.toFixed(2),
      };

      if (percentageChange > 0) {
        gainers.push(result);
      } else {
        losers.push(result);
      }
    });

    gainers.sort((a, b) => b.percentageChange - a.percentageChange);
    losers.sort((a, b) => a.percentageChange - b.percentageChange);

    res.status(200).json({
      topGainers: gainers.slice(0, 10),
      topLosers: losers.slice(0, 10),
    });
  } catch (error) {
    console.error("Error fetching top gainers & losers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getStocks, getStocksData, getTopGainersAndLosers };
