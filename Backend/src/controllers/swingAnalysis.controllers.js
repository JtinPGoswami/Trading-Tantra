import MarketDetailData from "../models/marketData.model.js";
import StocksDetail from "../models/stocksDetail.model.js";
import FiveDayRangeBreakerModel from "../models/fiveDayRangeBreacker.model.js";
import TenDayRangeBreakerModel from "../models/tenDayRangeBreacker.model.js";
import DailyCandleReversalModel from "../models/dailyCandleRevarsal.model.js";
import ContractionModel from "../models/Contraction.model.js";

const fiveDayRangeBreakers = async (req, res) => {
  try {
    const uniqueTradingDays = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } },
      { $sort: { _id: -1 } },
      { $limit: 6 },
    ]);

    if (uniqueTradingDays.length < 6) {
      return res
        .status(404)
        .json({ message: "Not enough historical data found" });
    }

    const prevTargetDates = uniqueTradingDays.map((day) => day._id);

    const previousData = await MarketDetailData.find(
      { date: { $in: prevTargetDates } },
      {
        securityId: 1,
        "data.dayOpen": 1,
        "data.dayClose": 1,
        "data.dayHigh": 1,
        "data.dayLow": 1,
        "data.latestTradedPrice": 1,
        date: 1,
        _id: 0,
      }
    ).lean();

    const groupedData = prevTargetDates.reduce((acc, date) => {
      acc[date] = previousData.filter((entry) => entry.date === date);
      return acc;
    }, {});

    const latestDayData = new Map();
    const previousDaysData = new Map();

    groupedData[prevTargetDates[0]]?.forEach((entry) => {
      latestDayData.set(entry.securityId, entry);
    });

    prevTargetDates.slice(1).forEach((date, index) => {
      groupedData[date]?.forEach((entry) => {
        if (!previousDaysData.has(entry.securityId)) {
          previousDaysData.set(entry.securityId, {});
        }
        previousDaysData.get(entry.securityId)[`day${index + 1}`] = entry;
      });
    });

    const stocks = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, UNDERLYING_SYMBOL: 1, SYMBOL_NAME: 1, _id: 0 }
    );
    if (!stocks) {
      return res.status(404).json({ message: "No stocks found" });
    }

    const stocksMap = new Map();
    stocks.forEach((stock) => {
      stocksMap.set(stock.SECURITY_ID, {
        SECURITY_ID: stock.SECURITY_ID,
        UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
        SYMBOL_NAME: stock.SYMBOL_NAME,
      });
    });

    let bulkOps = [];
    latestDayData.forEach((today, key) => {
      const todayHigh = today.data?.[0].dayHigh;
      const todayLow = today.data?.[0].dayLow;
      const todayLatestTradedPrice = today.data?.[0].latestTradedPrice;
      const stock = stocksMap.get(key);
      const previousDays = previousDaysData.get(key);

      if (!previousDays) return;

      const previousHighs = [];
      const previousLows = [];
      const previousClose = [];
      for (let i = 1; i <= 5; i++) {
        if (previousDays[`day${i}`]) {
          previousHighs.push(previousDays[`day${i}`].data?.[0].dayHigh);
          previousLows.push(previousDays[`day${i}`].data?.[0].dayLow);
          previousClose.push(previousDays[`day${i}`].data?.[0].dayClose);
        }
      }
      const percentageChange =
        ((todayLatestTradedPrice - previousClose[0]) / previousClose[0]) * 100;

      const maxPreviousHigh = Math.max(...previousHighs);
      const minPreviousLow = Math.min(...previousLows);

      let type = null;
      if (todayLatestTradedPrice > maxPreviousHigh) {
        type = "bullish";
      } else if (todayLatestTradedPrice < minPreviousLow) {
        type = "bearish";
      }

      if (!type) return;

      bulkOps.push({
        updateOne: {
          filter: { securityId: key },
          update: {
            $set: {
              todayHigh: todayHigh.toFixed(2),
              todayLow: todayLow.toFixed(2),
              todayLatestTradedPrice: todayLatestTradedPrice.toFixed(2),
              preFiveDaysHigh: maxPreviousHigh.toFixed(2),
              preFiveDaysLow: minPreviousLow.toFixed(2),
              UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
              SYMBOL_NAME: stock.SYMBOL_NAME,
              percentageChange: percentageChange.toFixed(2),
              type,
              timestamp: new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000), // IST Time
            },
          },
          upsert: true,
        },
      });
    });

    if (bulkOps.length > 0) {
      await FiveDayRangeBreakerModel.bulkWrite(bulkOps);
    }
    const resData = await FiveDayRangeBreakerModel.find(
      {}, // Empty filter to get all documents
      {
        securityId: 1,
        SYMBOL_NAME: 1,
        UNDERLYING_SYMBOL: 1,
        preFiveDaysHigh: 1,
        preFiveDaysLow: 1,
        timestamp: 1,
        todayHigh: 1,
        todayLatestTradedPrice: 1,
        todayLow: 1,
        type: 1,
        _id: 0, // Explicitly exclude _id (optional if you only list fields you want)
      }
    ).lean();
    if (!resData) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json({
      success: true,
      resData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const tenDayRangeBreakers = async (req, res) => {
  try {
    const uniqueTradingDays = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } },
      { $sort: { _id: -1 } },
      { $limit: 11 },
    ]);

    if (uniqueTradingDays.length < 11) {
      return res
        .status(404)
        .json({ message: "Not enough historical data found" });
    }

    const prevTargetDates = uniqueTradingDays.map((day) => day._id);

    const previousData = await MarketDetailData.find(
      { date: { $in: prevTargetDates } },
      {
        securityId: 1,
        "data.dayOpen": 1,
        "data.dayClose": 1,
        "data.dayHigh": 1,
        "data.dayLow": 1,
        "data.latestTradedPrice": 1,
        date: 1,
        _id: 0,
      }
    ).lean();

    const groupedData = prevTargetDates.reduce((acc, date) => {
      acc[date] = previousData.filter((entry) => entry.date === date);
      return acc;
    }, {});

    const latestDayData = new Map();
    const previousDaysData = new Map();

    groupedData[prevTargetDates[0]]?.forEach((entry) => {
      latestDayData.set(entry.securityId, entry);
    });

    prevTargetDates.slice(1).forEach((date, index) => {
      groupedData[date]?.forEach((entry) => {
        if (!previousDaysData.has(entry.securityId)) {
          previousDaysData.set(entry.securityId, {});
        }
        previousDaysData.get(entry.securityId)[`day${index + 1}`] = entry;
      });
    });

    const stocks = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, UNDERLYING_SYMBOL: 1, SYMBOL_NAME: 1, _id: 0 }
    );
    if (!stocks) {
      return res.status(404).json({ message: "No stocks found" });
    }

    const stocksMap = new Map();

    stocks.forEach((stock) => {
      stocksMap.set(stock.SECURITY_ID, {
        SECURITY_ID: stock.SECURITY_ID,
        UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
        SYMBOL_NAME: stock.SYMBOL_NAME,
      });
    });

    let bulkOps = [];
    latestDayData.forEach((today, key) => {
      const todayHigh = today.data?.[0].dayHigh;
      const todayLow = today.data?.[0].dayLow;
      const todayLatestTradedPrice = today.data?.[0].latestTradedPrice;
      const stock = stocksMap.get(key);
      const previousDays = previousDaysData.get(key);

      if (!previousDays) return;

      const previousHighs = [];
      const previousLows = [];
      const previousClose = [];
      for (let i = 1; i <= 10; i++) {
        if (previousDays[`day${i}`]) {
          previousHighs.push(previousDays[`day${i}`].data?.[0].dayHigh);
          previousLows.push(previousDays[`day${i}`].data?.[0].dayLow);
          previousClose.push(previousDays[`day${i}`].data?.[0].dayClose);
        }
      }
      const percentageChange =
        ((todayLatestTradedPrice - previousClose[0]) / previousClose[0]) * 100;

      const maxPreviousHigh = Math.max(...previousHighs);
      const minPreviousLow = Math.min(...previousLows);

      let type = null;
      if (todayLatestTradedPrice > maxPreviousHigh) {
        type = "bullish";
      } else if (todayLatestTradedPrice <= minPreviousLow) {
        type = "bearish";
      }
      if (!type) return;

      bulkOps.push({
        updateOne: {
          filter: { securityId: key },
          update: {
            $set: {
              todayHigh: todayHigh.toFixed(2),
              todayLow: todayLow.toFixed(2),
              todayLatestTradedPrice: todayLatestTradedPrice.toFixed(2),
              preTenDaysHigh: maxPreviousHigh.toFixed(2),
              preTenDaysLow: minPreviousLow.toFixed(2),
              UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
              SYMBOL_NAME: stock.SYMBOL_NAME,
              percentageChange: percentageChange.toFixed(2),
              type,
              timestamp: new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000), // IST Time
            },
          },
          upsert: true,
        },
      });
    });
    if (bulkOps.length > 0) {
      await TenDayRangeBreakerModel.bulkWrite(bulkOps);
    }
    const resData = await TenDayRangeBreakerModel.find(
      {}, // Empty filter to get all documents
      {
        securityId: 1,
        SYMBOL_NAME: 1,
        UNDERLYING_SYMBOL: 1,
        preTenDaysHigh: 1,
        preTenDaysLow: 1,
        timestamp: 1,
        todayHigh: 1,
        todayLatestTradedPrice: 1,
        todayLow: 1,
        type: 1,
        _id: 0,
      }
    ).lean();
    if (!resData) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({
      success: true,
      resData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const dailyCandleReversal = async (req, res) => {
  try {
    const uniqueTradingDays = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } },
      { $sort: { _id: -1 } },
      { $limit: 3 },
    ]);

    if (uniqueTradingDays.length < 3) {
      return res
        .status(404)
        .json({ message: "Not enough historical data found" });
    }

    const prevTargetDates = uniqueTradingDays.map((day) => day._id);

    const previousData = await MarketDetailData.find(
      { date: { $in: prevTargetDates } },
      {
        securityId: 1,
        "data.dayOpen": 1,
        "data.dayClose": 1,
        "data.dayHigh": 1,
        "data.dayLow": 1,
        "data.latestTradedPrice": 1,
        date: 1,
        _id: 0,
      }
    ).lean();

    const groupedData = prevTargetDates.reduce((acc, date) => {
      acc[date] = previousData.filter((entry) => entry.date === date);
      return acc;
    }, {});

    const latestDayData = new Map();
    const fstPreviousDaysData = new Map();
    const secPreviousDaysData = new Map();

    groupedData[prevTargetDates[0]]?.forEach((entry) => {
      latestDayData.set(entry.securityId, entry);
    });
    groupedData[prevTargetDates[1]]?.forEach((entry) => {
      fstPreviousDaysData.set(entry.securityId, entry);
    });
    groupedData[prevTargetDates[2]]?.forEach((entry) => {
      secPreviousDaysData.set(entry.securityId, entry);
    });

    const stocks = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, UNDERLYING_SYMBOL: 1, SYMBOL_NAME: 1, _id: 0 }
    );
    if (!stocks) {
      return res.status(404).json({ message: "No stocks found" });
    }

    const stocksMap = new Map();
    stocks.forEach((stock) => {
      stocksMap.set(stock.SECURITY_ID, {
        SECURITY_ID: stock.SECURITY_ID,
        UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
        SYMBOL_NAME: stock.SYMBOL_NAME,
      });
    });

    let responseData = [];
    latestDayData.forEach((today, key) => {
      const todayLatestTradedPrice = today.data?.[0].latestTradedPrice;
      const todayOpen = today.data?.[0].dayOpen;
      const todayClose = today.data?.[0].dayClose;
      const stock = stocksMap.get(key);
      const fstPreviousDays = fstPreviousDaysData.get(key);
      const secPreviousDays = secPreviousDaysData.get(key);
      const preOpen = fstPreviousDays.data?.[0].dayOpen;
      const preClose = fstPreviousDays.data?.[0].dayClose;
      if (!fstPreviousDays || !secPreviousDays) {
        return;
      }

      const prevClose = fstPreviousDays.data?.[0].dayClose;
      const prevPrevClose = secPreviousDays.data?.[0].dayClose;

      if (
        prevClose === undefined ||
        prevPrevClose === undefined ||
        todayLatestTradedPrice === undefined
      )
        return;

      // Calculate percentage changes
      const fstPreviousDayChange =
        ((prevClose - prevPrevClose) / prevPrevClose) * 100;
      const persentageChange =
        ((todayLatestTradedPrice - prevClose) / prevClose) * 100;

      // Apply 2% buffer logic
      const buffer = Math.abs(fstPreviousDayChange) * 0.02; // 2% of previous day's change

      let trend = null;

      if (
        (todayOpen > todayClose && preOpen < preClose) ||
        (todayOpen < todayClose && preOpen > preClose)
      ) {
        if (persentageChange >= Math.abs(fstPreviousDayChange) - buffer) {
          trend = "BULLISH";
        } else if (
          persentageChange <=
          -Math.abs(fstPreviousDayChange) + buffer
        ) {
          trend = "BEARISH";
        }
      }
      if (trend) {
        responseData.push({
          securityId: key,
          fstPreviousDayChange: fstPreviousDayChange.toFixed(2),
          persentageChange: persentageChange.toFixed(2),
          trend,
          UNDERLYING_SYMBOL: stock?.UNDERLYING_SYMBOL,
          SYMBOL_NAME: stock?.SYMBOL_NAME,
        });
      }
    });

    const bulkOps = responseData.map((data) => ({
      updateOne: {
        filter: { securityId: data.securityId },
        update: { $set: data },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await DailyCandleReversalModel.bulkWrite(bulkOps);
    }

    const resData = await DailyCandleReversalModel.find(
      {},
      {
        securityId: 1,
        SYMBOL_NAME: 1,
        UNDERLYING_SYMBOL: 1,
        fstPreviousDayChange: 1,
        persentageChange: 1,
        trend: 1,
        timestamp: 1,
        _id: 0,
      }
    ).lean();
    if (!resData) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({
      success: true,
      resData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const AIContraction = async (req, res) => {
  try {
    const uniqueTradingDays = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } },
      { $sort: { _id: -1 } },
      { $limit: 5 },
    ]);

    if (uniqueTradingDays.length < 4) {
      return res
        .status(404)
        .json({ message: "Not enough historical data (need 5 days)" });
    }

    const targetDates = uniqueTradingDays.map((day) => day._id);

    const previousData = await MarketDetailData.find(
      { date: { $in: targetDates } },
      {
        securityId: 1,
        "data.dayHigh": 1,
        "data.dayLow": 1,
        date: 1,
        _id: 0,
      }
    ).lean();

    const groupedData = targetDates.reduce((acc, date) => {
      acc[date] = previousData.filter((entry) => entry.date === date);
      return acc;
    }, {});

    const firstDayData = new Map();
    const secondDayData = new Map();
    const thirdDayData = new Map();
    const forthDayData = new Map();
    const fifthDayData = new Map();

    groupedData[targetDates[0]]?.forEach((entry) => {
      firstDayData.set(entry.securityId, {
        securityId: entry.securityId,
        dayHigh: entry.data[0].dayHigh,
        dayLow: entry.data[0].dayLow,
        date: targetDates[0],
      });
    });
    groupedData[targetDates[1]]?.forEach((entry) => {
      secondDayData.set(entry.securityId, {
        securityId: entry.securityId,
        dayHigh: entry.data[0].dayHigh,
        dayLow: entry.data[0].dayLow,
        date: targetDates[1],
      });
    });

    groupedData[targetDates[2]]?.forEach((entry) => {
      thirdDayData.set(entry.securityId, {
        securityId: entry.securityId,
        dayHigh: entry.data[0].dayHigh,
        dayLow: entry.data[0].dayLow,
        date: targetDates[2],
      });
    });

    groupedData[targetDates[3]]?.forEach((entry) => {
      forthDayData.set(entry.securityId, {
        securityId: entry.securityId,
        dayHigh: entry.data[0].dayHigh,
        dayLow: entry.data[0].dayLow,
        date: targetDates[3],
      });
    });

    groupedData[targetDates[4]]?.forEach((entry) => {
      fifthDayData.set(entry.securityId, {
        securityId: entry.securityId,
        dayHigh: entry.data[0].dayHigh,
        dayLow: entry.data[0].dayLow,
        date: targetDates[4],
      });
    });

    const stocks = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, UNDERLYING_SYMBOL: 1, SYMBOL_NAME: 1, _id: 0 }
    );

    const stocksMap = new Map(
      stocks.map((stock) => [stock.SECURITY_ID, stock])
    );

    let responseData = [];
    for (const [securityId, data] of fifthDayData.entries()) {
      const stock = stocksMap.get(securityId);
      if (!stock) continue;

      const firstDay = firstDayData.get(securityId) || {};
      const secondDay = secondDayData.get(securityId) || {};
      const thirdDay = thirdDayData.get(securityId) || {};
      const forthDay = forthDayData.get(securityId) || {};

      const maxHigh = Math.max(
        firstDay.dayHigh ?? 0,
        secondDay.dayHigh ?? 0,
        thirdDay.dayHigh ?? 0,
        forthDay.dayHigh ?? 0
      );
      const minLow = Math.min(
        firstDay.dayLow ?? Infinity,
        secondDay.dayLow ?? Infinity,
        thirdDay.dayLow ?? Infinity,
        forthDay.dayLow ?? Infinity
      );

      if (data.dayHigh > maxHigh && data.dayLow < minLow) {
        responseData.push(stock);
      }
    }
    const bulkOps = responseData.map((data) => ({
      updateOne: {
        filter: { securityId: data.SECURITY_ID },
        update: {
          $set: {
            securityId: data.SECURITY_ID,
            UNDERLYING_SYMBOL: data.UNDERLYING_SYMBOL,
            SYMBOL_NAME: data.SYMBOL_NAME,
          },
        },
        upsert: true, // Creates a new entry if not found
      },
    }));

    if (bulkOps.length > 0) {
      await ContractionModel.bulkWrite(bulkOps);
    }

    const resData = await ContractionModel.find(
      {}, // Empty filter to get all documents
      {
        securityId: 1,
        SYMBOL_NAME: 1,
        UNDERLYING_SYMBOL: 1,
        timestamp: 1,
        _id: 0,
      }
    );

    if (!resData) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ success: true, resData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export {
  fiveDayRangeBreakers,
  tenDayRangeBreakers,
  dailyCandleReversal,
  AIContraction,
};
