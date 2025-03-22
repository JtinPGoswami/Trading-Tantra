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

// new logic that return previous data if today data not avail for turnover with optimized code
const getStocksData = async () => {
  try {
    // Step 1: Get the latest **unique** date
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date")
      .lean();

    if (!latestEntry) {
      return { success: false, message: "No stock data available" };
    }
    // console.log("latestEntry", latestEntry);

    const latestDate = latestEntry.date;

    // Step 2: Find the **most recent past available date** (ignoring holidays)
    let previousDayDate = null;

    const previousDayEntry = await MarketDetailData.findOne(
      { date: { $lt: latestDate } } // Find entry before latest date
    )
      .sort({ date: -1 }) // Sort again to get the latest available past entry
      .select("date")
      .lean();

    if (previousDayEntry) {
      previousDayDate = previousDayEntry.date;
    }

    // Step 3: Fetch stock data for the latest date
    const stocksData = await MarketDetailData.find({ date: latestDate }).lean();

    if (!stocksData.length) {
      return {
        success: false,
        message: "No stock data available for the latest date",
      };
    }

    // Step 4: Fetch previous day's stock data (if available)
    let previousDayMap = new Map();
    if (previousDayDate) {
      const previousDayData = await MarketDetailData.find({
        date: previousDayDate,
      }).lean();
      previousDayMap = new Map(
        previousDayData.map((stock) => [stock.securityId, stock])
      );
    }

    // Step 5: Fetch stock details
    const stockIds = stocksData.map((entry) => entry.securityId);
    const stockDetails = await StocksDetail.find(
      { SECURITY_ID: { $in: stockIds } },
      {
        _id: 0,
        SECURITY_ID: 1,
        UNDERLYING_SYMBOL: 1,
        SYMBOL_NAME: 1,
        DISPLAY_NAME: 1,
        INDEX: 1,
        SECTOR: 1,
      }
    ).lean();

    const stockDetailsMap = new Map(
      stockDetails.map((stock) => [stock.SECURITY_ID, stock])
    );

    // Step 6: Compute stock data with changes
    const response = stocksData.map((stock) => {
      const stockDetail = stockDetailsMap.get(stock.securityId) || {};
      const previousStock = previousDayMap.get(stock.securityId);
      const dayClose = previousStock?.data?.[0].dayClose;
      const latestTradePrice = stock?.data?.[0].latestTradedPrice;
      // console.log(latestTradePrice, dayClose, "ltp,dayclose");

      // Change Percentage Calculation
      const changePercentage =
        dayClose && dayClose !== 0
          ? parseFloat(
              (((latestTradePrice - dayClose) / dayClose) * 100).toFixed(2)
            )
          : 0;

      return {
        SECURITY_ID: stock.securityId,
        INDEX: stockDetail.INDEX || "N/A",
        SECTOR: stockDetail.SECTOR || "N/A",
        UNDERLYING_SYMBOL: stockDetail.UNDERLYING_SYMBOL || "N/A",
        SYMBOL_NAME: stockDetail.SYMBOL_NAME || "N/A",
        DISPLAY_NAME: stockDetail.DISPLAY_NAME || "N/A",
        turnover: stock.turnover,
        changePercentage,
      };
    });

    // Sort by turnover and return top 30 stocks
    const sortedData = response
      .sort((a, b) => b.turnover - a.turnover)
      .slice(0, 30);

    return { success: true, message: "Stock data retrieved", data: sortedData };
  } catch (error) {
    console.error("Error fetching stocks data:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error.message,
    };
  }
};

//this controller give data if today data not avail it return yesterday data
const getTopGainersAndLosers = async (req, res) => {
  try {
    // Step 1: Find the most recent available date
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 }) // Get the latest date
      .select("date");

    if (!latestEntry) {
      return res.status(404).json({ message: "No stock data available" });
    }

    const latestDate = latestEntry.date;
    // console.log("Latest available date:", latestDate);

    // Step 2: Fetch all data for the latest available date
    const latestData = await MarketDetailData.find({ date: latestDate });

    if (latestData.length === 0) {
      return res
        .status(404)
        .json({ message: "No stock data available for the latest date" });
    }

    // console.log("Total entries found for latest date:", latestData.length);

    // Step 3: Find the most recent previous available date
    const previousDayEntry = await MarketDetailData.findOne(
      { date: { $lt: latestDate } },
      { date: 1 }
    ).sort({ date: -1 });

    if (!previousDayEntry) {
      return res
        .status(404)
        .json({ message: "No previous stock data available" });
    }

    const previousDayDate = previousDayEntry.date;
    // console.log("Previous available date:", previousDayDate);

    // Fetch previous day's stock data
    const yesterdayData = await MarketDetailData.find({
      date: previousDayDate,
    });

    // Step 4: Map previous day's closing prices
    const yesterdayMap = new Map();
    yesterdayData.forEach((entry) => {
      yesterdayMap.set(entry.securityId, entry.data?.dayClose[0] || 0);
    });

    // console.log('yesterdayyyyyyyyyyyy',yesterdayMap)

    const gainers = [];
    const losers = [];

    // Step 5: Get stock details
    const stockIds = latestData.map((entry) => entry.securityId);
    const stockDetailsMap = new Map();

    const stockDetails = await StocksDetail.find(
      { SECURITY_ID: { $in: stockIds } },
      {
        UNDERLYING_SYMBOL: 1,
        SYMBOL_NAME: 1,
        SECURITY_ID: 1,
        INDEX: 1,
        SECTOR: 1,
      }
    );

    stockDetails.forEach((stock) => {
      stockDetailsMap.set(stock.SECURITY_ID, stock);
    });

    // Step 6: Compute gainers & losers
    latestData.forEach((todayEntry) => {
      const prevClose = yesterdayMap.get(todayEntry.securityId);
      if (!prevClose || prevClose === 0) return;
      // console.log(' jbrbjbrrbbkrbirbfribiu',prevClose)

      const latestPrice = todayEntry.data?.latestTradedPrice[0] || 0;

      if (latestPrice === 0) return;
      const percentageChange =
        prevClose && prevClose !== 0
          ? parseFloat(
              (((latestPrice - prevClose) / prevClose) * 100).toFixed(2)
            )
          : 0;
      const stockDetail = stockDetailsMap.get(todayEntry.securityId) || {};
      // console.log('fnrfkjrknf',percentageChange)
      const result = {
        securityId: todayEntry.securityId,
        stockSymbol: stockDetail.UNDERLYING_SYMBOL || "N/A",
        stockName: stockDetail.SYMBOL_NAME || "N/A",
        sector: stockDetail.SECTOR || "N/A",
        index: stockDetail.INDEX || "N/A",
        lastTradePrice: latestPrice,
        previousClosePrice: prevClose,
        percentageChange: percentageChange.toFixed(2),
        turnover: todayEntry.turnover,
        xElement: todayEntry.xelement,
      };

      if (percentageChange > 0) {
        // console.log(true)
        gainers.push(result);
      } else {
        losers.push(result);
      }
    });

    gainers.sort((a, b) => b.percentageChange - a.percentageChange);
    losers.sort((a, b) => a.percentageChange - b.percentageChange);

    res.status(200).json({
      topGainers: gainers.slice(0, 30),
      topLosers: losers.slice(0, 30),
    });
  } catch (error) {
    console.error("Error fetching top gainers & losers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// give the previous data if today data not avail
const getDayHighBreak = async (req, res) => {
  try {
    // Step 1: Find the most recent date available in the database
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 }) // Get the latest date
      .select("date");

    if (!latestEntry) {
      return res
        .status(404)
        .json({ message: "Not enough data to calculate day high break" });
    }

    const latestDate = latestEntry.date;
    // console.log("Latest available date:", latestDate);

    // Step 2: Fetch all entries that match this date
    const todayData = await MarketDetailData.find({ date: latestDate });

    if (todayData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data available for the latest saved date" });
    }
    const previousDayEntry = await MarketDetailData.findOne(
      { date: { $lt: latestDate } },
      { date: 1 }
    ).sort({ date: -1 });

    if (!previousDayEntry) {
      return { success: false, message: "No previous stock data available" };
    }

    const previousDayDate = previousDayEntry.date;

    // Fetch previous day's stock data
    const previousDayData = await MarketDetailData.find({
      date: previousDayDate,
    });
    const yesterdayMap = new Map();
    previousDayData.forEach((entry) => {
      yesterdayMap.set(entry.securityId, entry.data?.dayClose?.[0] || 0);
    });
    const stocksDetail = await StocksDetail.find();

    if (!stocksDetail) {
      return res
        .status(404)
        .json({ message: "Not enough data to calculate day high break" });
    }
    let filteredData = todayData.map((data) => ({
      latestPrice: parseFloat(data.data.latestTradedPrice[0].toFixed(2)),
      dayHigh: parseFloat(data.data.dayHigh?.[0].toFixed(2)),
      securityId: data.securityId,
      turnover: data.turnover,
      todayOpen: parseFloat(data.data.dayOpen?.[0].toFixed(2)),
      xElement: data.xelement,
    }));
    // console.log("today data", todayData);
    const dayHighBreak = filteredData
      .map((data) => {
        const dayHigh = data.dayHigh;
        const changePrice = dayHigh * 0.005;
        const latestPrice = data.latestPrice;
        const dayClose = yesterdayMap.get(data.securityId);
        if (latestPrice >= dayHigh - changePrice) {
          const stock = stocksDetail.find(
            (stock) => stock.SECURITY_ID === data.securityId
          );

          if (stock) {
            const {
              _id,
              createdAt,
              updatedAt,
              SECURITY_ID,
              __v,
              ...filteredStock
            } = stock.toObject();

            const percentageChange = (
              ((latestPrice - dayClose) / dayClose) *
              100
            ).toFixed(2);
            const cmpPrice = dayHigh - changePrice;
            const percentageDifference = (
              ((latestPrice - cmpPrice) / cmpPrice) *
              100
            ).toFixed(2);
            return {
              ...data,
              stock: filteredStock,
              percentageChange,
              percentageDifference,
            };
          }
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.percentageDifference - a.percentageDifference);

    // console.log("dayHighBreak:", dayHighBreak);
    res.status(200).json({ dayHighBreak });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// give the previous data if today data not avail
const getDayLowBreak = async (req, res) => {
  try {
    // Step 1: Find the most recent date available in the database
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 }) // Get the latest date
      .select("date");

    if (!latestEntry) {
      return res
        .status(404)
        .json({ message: "Not enough data to calculate day low break" });
    }

    const latestDate = latestEntry.date;
    // console.log("Latest available date:", latestDate);

    // Step 2: Fetch all entries that match this date
    const todayData = await MarketDetailData.find({ date: latestDate });

    if (todayData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data available for the latest saved date" });
    }

    // console.log("Total entries found for latest date:", todayData.length);
    const previousDayEntry = await MarketDetailData.findOne(
      { date: { $lt: latestDate } },
      { date: 1 }
    ).sort({ date: -1 });

    if (!previousDayEntry) {
      return { success: false, message: "No previous stock data available" };
    }

    const previousDayDate = previousDayEntry.date;

    // Fetch previous day's stock data
    const previousDayData = await MarketDetailData.find({
      date: previousDayDate,
    });
    const yesterdayMap = new Map();
    previousDayData.forEach((entry) => {
      yesterdayMap.set(entry.securityId, entry.data?.dayClose || 0);
    });
    const stocksDetail = await StocksDetail.find();

    if (!stocksDetail) {
      return res
        .status(404)
        .json({ message: "Not enough data to calculate day low break" });
    }

    let filteredData = todayData.map((data) => ({
      latestPrice: parseFloat(data.data.latestTradedPrice?.[0].toFixed(2)),
      dayLow: parseFloat(data.data.dayLow?.[0].toFixed(2)),
      securityId: data.securityId,
      turnover: data.turnover,
      xElement: data.xelement,
    }));

    const dayLowBreak = filteredData
      .map((data) => {
        const changePrice = data.dayLow * 0.005;
        const latestPrice = data.latestPrice;
        const dayLow = data.dayLow;
        const previousClose = yesterdayMap.get(data.securityId);
        if (latestPrice <= dayLow + changePrice) {
          const stock = stocksDetail.find(
            (stock) => stock.SECURITY_ID === data.securityId
          );

          if (stock) {
            const {
              _id,
              createdAt,
              updatedAt,
              SECURITY_ID,
              __v,
              ...filteredStock
            } = stock.toObject();

            const percentageChange = (
              ((latestPrice - previousClose) / previousClose) *
              100
            ).toFixed(2);
            const cmpPrice = dayLow - changePrice;
            const percentageDifference = (
              ((latestPrice - (dayLow - cmpPrice)) / cmpPrice) *
              100
            ).toFixed(2);

            return {
              ...data,
              stock: filteredStock,
              percentageChange,
              percentageDifference,
            };
          }
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.percentageChange - b.percentageChange);

    // console.log("dayLowBreak:", dayLowBreak);
    res.status(200).json({ dayLowBreak });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// give the previous data if today data not avail
const previousDaysVolume = async (req, res) => {
  try {
    const latestEntry = await MarketDetailData.findOne({}, { date: 1 }).sort({
      date: -1,
    });

    if (!latestEntry) {
      return res
        .status(404)
        .json({ success: false, message: "No stock data available" });
    }

    const latestDate = latestEntry.date;

    // Fetch today's data (latest available)
    const todayData = await MarketDetailData.find(
      { date: latestDate },
      {
        securityId: 1,
        "data.latestTradedPrice": 1,
        "data.dayOpen": 1,
        "data.volume": 1,
        _id: 0,
      }
    );

    // Fetch all previous stock data (before latest date)
    const previousData = await MarketDetailData.find(
      {
        date: { $lt: latestDate },
      },
      {
        securityId: 1,
        "data.latestTradedPrice": 1,
        "data.dayOpen": 1,
        "data.dayClose": 1,
        "data.volume": 1,
        date: 1,
        _id: 0,
      }
    ).sort({ date: -1 });

    if (!previousData.length) {
      return res
        .status(404)
        .json({ success: false, message: "No previous stock data available" });
    }

    // Fetch stock details once
    const stocksDetail = await StocksDetail.find(
      {},
      {
        SECURITY_ID: 1,
        UNDERLYING_SYMBOL: 1,
        SYMBOL_NAME: 1,
        DISPLAY_NAME: 1,
        _id: 0,
      }
    );

    const stocksDetailsMap = new Map();
    stocksDetail.forEach((stock) => {
      stocksDetailsMap.set(stock.SECURITY_ID, {
        UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
        SYMBOL_NAME: stock.SYMBOL_NAME,
        DISPLAY_NAME: stock.DISPLAY_NAME,
      });
    });

    // Build a lookup map for previous volumes by securityId
    let previousVolumesMap = {};
    previousData.forEach(({ securityId, data }) => {
      const volume = data?.volume?.[0] || 0;
      if (!previousVolumesMap[securityId]) {
        previousVolumesMap[securityId] = [];
      }
      previousVolumesMap[securityId].push(volume);
    });

    const previousDayClose = previousData[0].data.dayClose;
    if (!previousDayClose) {
      return res
        .status(404)
        .json({ success: false, message: "No previous date close price" });
    }
    let bulkUpdates = [];
    const combinedData = todayData.map(({ securityId, data }) => {
      const todayVolume = data?.volume?.[0] || 0;
      const volumeHistory = previousVolumesMap[securityId] || [];
      const todayopen = data?.dayOpen;
      const latestTradedPrice = data?.latestTradedPrice;
      const stock = stocksDetailsMap.get(securityId);
      const percentageChange = todayopen
        ? ((latestTradedPrice - previousDayClose) / previousDayClose) * 100
        : 0;
      const totalPreviousVolume = volumeHistory.reduce(
        (sum, vol) => sum + vol,
        0
      );
      const averagePreviousVolume = volumeHistory.length
        ? totalPreviousVolume / volumeHistory.length
        : 0;

      const xElement =
        averagePreviousVolume > 0 ? todayVolume / averagePreviousVolume : 0;

      bulkUpdates.push({
        updateOne: {
          filter: { securityId, date: latestDate },
          update: { $set: { xelement: xElement } },
        },
      });

      return {
        securityId,
        todayVolume,
        stock,
        totalPreviousVolume,
        averagePreviousVolume,
        xElement,
        percentageChange,
      };
    });

    // Perform batch update in a single query
    if (bulkUpdates.length > 0) {
      await MarketDetailData.bulkWrite(bulkUpdates);
    }

    res.status(200).json({ success: true, combinedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const sectorStockData = async (req, res) => {
  try {
    // 1️⃣ Find the latest stock entry date
    const latestEntry = await MarketDetailData.findOne()
      .sort({ date: -1 })
      .select("date");
    if (!latestEntry)
      return res.status(404).json({ message: "No stock data available" });

    const latestDate = latestEntry.date;
    console.log("Latest available date:", latestDate);

    // 2️⃣ Get latest stock data for the latest date
    const latestData = await MarketDetailData.find({ date: latestDate });
    if (latestData.length === 0) {
      return res
        .status(404)
        .json({ message: "No stock data available for the latest date" });
    }
    console.log("Total entries found for latest date:", latestData.length);

    // 3️⃣ Find previous day's stock data
    const previousDayEntry = await MarketDetailData.findOne({
      date: { $lt: latestDate },
    }).sort({ date: -1 });
    if (!previousDayEntry)
      return res
        .status(404)
        .json({ message: "No previous stock data available" });

    const previousDayDate = previousDayEntry.date;
    console.log("Previous available date:", previousDayDate);

    const yesterdayData = await MarketDetailData.find({
      date: previousDayDate,
    });

    // 4️⃣ Create a map of yesterday's closing prices
    const yesterdayMap = new Map();
    yesterdayData.forEach((entry) => {
      yesterdayMap.set(entry.securityId, entry.data?.dayClose || 0);
    });

    // 5️⃣ Fetch stock details (sector, index, etc.)
    const stocksDetail = await StocksDetail.find();
    if (!stocksDetail) {
      return res.status(404).json({ message: "No stock details available" });
    }

    // 6️⃣ Create a stock details map
    const stockmap = new Map();
    stocksDetail.forEach((entry) => {
      stockmap.set(entry.SECURITY_ID, {
        INDEX: entry.INDEX || [],
        SECTOR: entry.SECTOR || [],
        UNDERLYING_SYMBOL: entry.UNDERLYING_SYMBOL,
      });
    });

    // 7️⃣ Process stock data
    const combinedData = latestData.map((entry) => {
      const { securityId, data, xelement } = entry;
      const todayopen = data?.dayOpen || 0;
      const latestTradedPrice = data?.latestTradedPrice || 0;
      const yesterdayClose = yesterdayMap.get(securityId) || 0;
      const stockdata = stockmap.get(securityId) || { INDEX: [], SECTOR: [] };
      console.log("stockdata:", stockdata);
      // Ensure INDEX and SECTOR are always arrays
      const sectors = Array.isArray(stockdata.SECTOR)
        ? stockdata.SECTOR
        : [stockdata.SECTOR];
      const indices = Array.isArray(stockdata.INDEX)
        ? stockdata.INDEX
        : [stockdata.INDEX];

      // Calculate percentage change
      const percentageChange = todayopen
        ? ((latestTradedPrice - todayopen) / todayopen) * 100
        : 0;

      return {
        securityId,
        yesterdayClose,
        percentageChange,
        xelement,
        ...stockdata,
        SECTOR: sectors.filter(Boolean), // Remove null/undefined values
        INDEX: indices.filter(Boolean), // Remove null/undefined values
      };
    });

    // 8️⃣ Organize data sector-wise and index-wise
    const sectorWiseData = {};
    const indexWiseData = {};

    combinedData.forEach((stock) => {
      // Categorize by SECTOR
      stock.SECTOR.forEach((sector) => {
        if (!sectorWiseData[sector]) sectorWiseData[sector] = [];
        sectorWiseData[sector].push(stock);
      });

      // Categorize by INDEX
      stock.INDEX.forEach((index) => {
        if (!indexWiseData[index]) indexWiseData[index] = [];
        indexWiseData[index].push(stock);
      });

      // Handle stocks with no sector
      if (stock.SECTOR.length === 0) {
        if (!sectorWiseData["Uncategorized"])
          sectorWiseData["Uncategorized"] = [];
        sectorWiseData["Uncategorized"].push(stock);
      }

      // Handle stocks with no index
      if (stock.INDEX.length === 0) {
        if (!indexWiseData["Uncategorized"])
          indexWiseData["Uncategorized"] = [];
        indexWiseData["Uncategorized"].push(stock);
      }
    });

    // 9️⃣ Send response
    res.status(200).json({
      success: true,
      latestDate,
      previousDayDate,
      sectorWiseData,
      indexWiseData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  getStocks,
  getStocksData,
  getTopGainersAndLosers,
  getDayHighBreak,
  getDayLowBreak,
  previousDaysVolume,
  sectorStockData,
};
