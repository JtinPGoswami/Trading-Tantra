import MarketDetailData from "../models/marketData.model.js";
import StocksDetail from "../models/stocksDetail.model.js";
import FiveDayRangeBreakerModel from "../models/fiveDayRangeBreacker.model.js";
import TenDayRangeBreakerModel from "../models/tenDayRangeBreacker.model.js";
import DailyCandleReversalModel from "../models/dailyCandleRevarsal.model.js";
import ContractionModel from "../models/Contraction.model.js";

const getFormattedISTDate = () => {
  const now = new Date();
  const istDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, "0");
  const day = String(istDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const fiveDayRangeBreakers = async (req, res) => {
  try {
    const uniqueTradingDays = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } },
      { $sort: { _id: -1 } },
      { $limit: 6 },
    ]);

    if (uniqueTradingDays.length < 6) {
      return { message: "Not enough historical data found" };
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
      return { message: "No stocks found" };
    }

    const stocksMap = new Map();
    stocks.forEach((stock) => {
      stocksMap.set(stock.SECURITY_ID, {
        SECURITY_ID: stock.SECURITY_ID,
        UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
        SYMBOL_NAME: stock.SYMBOL_NAME,
      });
    });
    let preCha = [];
    let bulkOps = [];
    latestDayData.forEach((today, key) => {
      const todayHigh = today.data?.[0].dayOpen;
      const todayLow = today.data?.[0].dayClose;
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

      const percentageChanges =
        ((todayLatestTradedPrice - previousClose[0]) / previousClose[0]) * 100;
      preCha.push({
        securityId: key,
        percentageChanges,
      });
      const maxPreviousHigh = Math.max(...previousHighs);
      const minPreviousLow = Math.min(...previousLows);

      let type = null;
      if (todayLatestTradedPrice > maxPreviousHigh) {
        type = "bullish";
      } else if (todayLatestTradedPrice < minPreviousLow) {
        type = "bearish";
      }

      if (!type) return;
      const date = getFormattedISTDate();
      bulkOps.push({
        updateOne: {
          filter: { securityId: key },
          update: {
            $set: {
              percentageChange: parseFloat(percentageChanges.toFixed(2)),
              todayHigh: todayHigh.toFixed(2),
              todayLow: todayLow.toFixed(2),
              todayLatestTradedPrice: todayLatestTradedPrice.toFixed(2),
              preFiveDaysHigh: maxPreviousHigh.toFixed(2),
              preFiveDaysLow: minPreviousLow.toFixed(2),
              UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
              SYMBOL_NAME: stock.SYMBOL_NAME,
              type,
              timestamp: date, // IST Time
            },
          },
          upsert: true,
        },
      });
    });

    if (bulkOps.length > 0) {
      await FiveDayRangeBreakerModel.bulkWrite(bulkOps);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("5 day bo", error);
    return { message: "Internal server error", error: error.message };
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
      return { message: "Not enough historical data found" };
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
      return { message: "No stocks found" };
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
    let preCha = [];
    latestDayData.forEach((today, key) => {
      const todayHigh = today.data?.[0].dayOpen;
      const todayLow = today.data?.[0].dayClose;
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
      const percentageChanges =
        ((todayLatestTradedPrice - previousClose[0]) / previousClose[0]) * 100;
      console.log("ten day bo percentge chneg", percentageChanges);
      preCha.push({
        securityId: key,
        percentageChanges,
      });
      const maxPreviousHigh = Math.max(...previousHighs);
      const minPreviousLow = Math.min(...previousLows);

      let type = null;
      if (todayLatestTradedPrice > maxPreviousHigh) {
        type = "bullish";
      } else if (todayLatestTradedPrice <= minPreviousLow) {
        type = "bearish";
      }
      if (!type) return;

      const date = getFormattedISTDate();
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
              persentageChange: percentageChanges.toFixed(2),
              type,
              timestamp: date, // IST Time
            },
          },
          upsert: true,
        },
      });
    });
    if (bulkOps.length > 0) {
      await TenDayRangeBreakerModel.bulkWrite(bulkOps);
    }

    return {
      success: true,
    };
  } catch (error) {
    return { message: "Internal server error", error: error.message };
  }
};

// const dailyCandleReversal = async (req, res) => {
//   try {
//     const uniqueTradingDays = await MarketDetailData.aggregate([
//       { $group: { _id: "$date" } },
//       { $sort: { _id: -1 } },
//       { $limit: 3 },
//     ]);

//     if (uniqueTradingDays.length < 3) {
//       return { message: "Not enough historical data found" };
//     }

//     const prevTargetDates = uniqueTradingDays.map((day) => day._id);

//     const previousData = await MarketDetailData.find(
//       { date: { $in: prevTargetDates } },
//       {
//         securityId: 1,
//         "data.dayOpen": 1,
//         "data.dayClose": 1,
//         "data.dayHigh": 1,
//         "data.dayLow": 1,
//         "data.latestTradedPrice": 1,
//         date: 1,
//         _id: 0,
//       }
//     ).lean();

//     const groupedData = prevTargetDates.reduce((acc, date) => {
//       acc[date] = previousData.filter((entry) => entry.date === date);
//       return acc;
//     }, {});

//     const latestDayData = new Map();
//     const fstPreviousDaysData = new Map();
//     const secPreviousDaysData = new Map();

//     groupedData[prevTargetDates[0]]?.forEach((entry) => {
//       latestDayData.set(entry.securityId, entry);
//     });
//     groupedData[prevTargetDates[1]]?.forEach((entry) => {
//       fstPreviousDaysData.set(entry.securityId, entry);
//     });
//     groupedData[prevTargetDates[2]]?.forEach((entry) => {
//       secPreviousDaysData.set(entry.securityId, entry);
//     });

//     const stocks = await StocksDetail.find(
//       {},
//       { SECURITY_ID: 1, UNDERLYING_SYMBOL: 1, SYMBOL_NAME: 1, _id: 0 }
//     );
//     if (!stocks) {
//       return { message: "No stocks found" };
//     }

//     const stocksMap = new Map();
//     stocks.forEach((stock) => {
//       stocksMap.set(stock.SECURITY_ID, {
//         SECURITY_ID: stock.SECURITY_ID,
//         UNDERLYING_SYMBOL: stock.UNDERLYING_SYMBOL,
//         SYMBOL_NAME: stock.SYMBOL_NAME,
//       });
//     });

//     let responseData = [];
//     let preCha = [];

//     latestDayData.forEach((today, key) => {
//       const todayLatestTradedPrice = today.data?.[0]?.latestTradedPrice;
//       const todayOpen = today.data?.[0]?.dayOpen;
//       const todayClose = today.data?.[0]?.dayClose;
//       const stock = stocksMap.get(key);
//       const fstPreviousDays = fstPreviousDaysData.get(key);
//       const secPreviousDays = secPreviousDaysData.get(key);

//       if (!fstPreviousDays || !secPreviousDays) {
//         return;
//       }

//       const preOpen = fstPreviousDays.data?.[0]?.dayOpen;
//       const preClose = fstPreviousDays.data?.[0]?.dayClose;
//       const prevClose = fstPreviousDays.data?.[0]?.dayClose;
//       const prevPrevClose = secPreviousDays.data?.[0]?.dayClose;

//       if (
//         prevClose === undefined ||
//         prevPrevClose === undefined ||
//         todayLatestTradedPrice === undefined ||
//         prevClose === 0
//       ) {
//         return;
//       }

//       // Calculate percentage changes
//       const fstPreviousDayChange =
//         ((prevClose - prevPrevClose) / prevPrevClose) * 100;
//       const persentageChange =
//         ((todayLatestTradedPrice - prevClose) / prevClose) * 100;

//       preCha.push({ securityId: key, persentageChange });

//       // Apply 2% buffer logic
//       const buffer = Math.abs(fstPreviousDayChange) * 0.02;
//       let trend = null;

//       if (
//         (todayOpen > todayClose && preOpen < preClose) ||
//         (todayOpen < todayClose && preOpen > preClose)
//       ) {
//         if (persentageChange >= Math.abs(fstPreviousDayChange) - buffer) {
//           trend = "BULLISH";
//         } else if (
//           persentageChange <=
//           -Math.abs(fstPreviousDayChange) + buffer
//         ) {
//           trend = "BEARISH";
//         }
//       }
//       if (trend) {
//         const date = getFormattedISTDate();
//         responseData.push({
//           securityId: key,
//           fstPreviousDayChange: fstPreviousDayChange.toFixed(2),
//           persentageChange: persentageChange.toFixed(2),
//           trend,
//           UNDERLYING_SYMBOL: stock?.UNDERLYING_SYMBOL,
//           SYMBOL_NAME: stock?.SYMBOL_NAME,
//           timestamp: date,
//         });
//       }
//     });

//     const bulkOps = responseData.map((data) => ({
//       updateOne: {
//         filter: { securityId: data.securityId },
//         update: { $set: data },
//         upsert: true,
//       },
//     }));

//     if (bulkOps.length > 0) {
//       await DailyCandleReversalModel.bulkWrite(bulkOps);
//     }

//     return { success: true };
//   } catch (error) {
//     return { message: "Internal server error", error: error.message };
//   }
// };

const dailyCandleReversal = async (req, res) => {
  try {
    const uniqueTradingDays = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } },
      { $sort: { _id: -1 } },
      { $limit: 3 },
    ]);

    if (uniqueTradingDays.length < 3) {
      return { message: "Not enough historical data found" };
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
      return { message: "No stocks found" };
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
      const todayData = today.data?.[0];
      const todayOpen = todayData?.dayOpen;
      const todayClose = todayData?.dayClose;
      const todayLatestTradedPrice = todayData?.latestTradedPrice;
      // console.log('todayLatestTradedPrice', todayLatestTradedPrice);

      const stock = stocksMap.get(key);
      const fstPreviousDays = fstPreviousDaysData.get(key);
      const secPreviousDays = secPreviousDaysData.get(key);

      if (!fstPreviousDays || !secPreviousDays) return;

      const fstData = fstPreviousDays.data?.[0];
      const secData = secPreviousDays.data?.[0];

      const preOpen = fstData?.dayOpen;
      const preClose = fstData?.dayClose;
      const prevClose = fstData?.dayClose;
      const prevPrevClose = secData?.dayClose;

      if (
        prevClose === undefined ||
        prevPrevClose === undefined ||
        todayLatestTradedPrice === undefined ||
        prevClose === 0
      ) {
        return;
      }

      const firstDayChange =
        ((prevClose - prevPrevClose) / prevPrevClose) * 100;
      const todayChange =
        ((todayLatestTradedPrice - prevClose) / prevClose) * 100;

      const buffer = Math.abs(firstDayChange) * 0.02;
      let trend = null;

      // Bullish Reversal Check
      if (
        preOpen > preClose && // previous day red
        todayOpen < todayClose && // today green
        todayChange >= Math.abs(firstDayChange) - buffer
      ) {
        trend = "BULLISH";
      }

      // Bearish Reversal Check
      else if (
        preOpen < preClose && // previous day green
        todayOpen > todayClose && // today red
        todayChange <= -(Math.abs(firstDayChange) - buffer)
      ) {
        trend = "BEARISH";
      }

      if (trend) {
        const date = getFormattedISTDate();
        responseData.push({
          securityId: key,
          fstPreviousDayChange: firstDayChange.toFixed(2),
          persentageChange: todayChange.toFixed(2),
          trend,
          UNDERLYING_SYMBOL: stock?.UNDERLYING_SYMBOL,
          SYMBOL_NAME: stock?.SYMBOL_NAME,
          timestamp: date,
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

    return { success: true };
  } catch (error) {
    console.log("daily reversal", error);
    return { message: "Internal server error", error: error.message };
  }
};

const AIContraction = async (req, res) => {
  try {
    const uniqueTradingDays = await MarketDetailData.aggregate([
      { $group: { _id: "$date" } },
      { $sort: { _id: -1 } },
      { $limit: 5 },
    ]);

    if (uniqueTradingDays.length < 5) {
      return { message: "Not enough historical data (need 5 days)" };
    }

    const targetDates = uniqueTradingDays.map((day) => day._id);

    const previousData = await MarketDetailData.find(
      { date: { $in: targetDates } },
      {
        securityId: 1,
        data: 1, // Added for percentage change calculation
        date: 1,
        _id: 0,
      }
    ).lean();

    const groupedData = targetDates.reduce((acc, date) => {
      acc[date] = previousData.filter((entry) => entry.date === date);
      return acc;
    }, {});

    // Creating Maps for each day's data
    const dayMaps = targetDates.map(() => new Map());

    targetDates.forEach((date, index) => {
      groupedData[date]?.forEach((entry) => {
        dayMaps[index].set(entry.securityId, {
          securityId: entry.securityId,
          dayHigh: entry.data[0].dayHigh,
          dayLow: entry.data[0].dayLow,
          latestTradedPrice: entry.data[0].latestTradedPrice, // Needed for percentage change
          date,
        });
      });
    });

    const [
      firstDayData,
      secondDayData,
      thirdDayData,
      forthDayData,
      fifthDayData,
    ] = dayMaps;

    const stocks = await StocksDetail.find(
      {},
      { SECURITY_ID: 1, UNDERLYING_SYMBOL: 1, SYMBOL_NAME: 1, _id: 0 }
    );

    const stocksMap = new Map(
      stocks.map((stock) => [stock.SECURITY_ID, stock])
    );

    let responseData = [];
    let preCha = [];
    for (const [securityId, data] of fifthDayData.entries()) {
      const stock = stocksMap.get(securityId);
      if (!stock) continue;

      const firstDay = firstDayData.get(securityId);
      const secondDay = secondDayData.get(securityId);
      const thirdDay = thirdDayData.get(securityId);
      const forthDay = forthDayData.get(securityId);
      const todayLatestTradedPrice = data.latestTradedPrice;
      const previousClose = forthDay.latestTradedPrice;
      const percentageChange =
        ((Number(todayLatestTradedPrice) - Number(previousClose)) /
          Number(previousClose)) *
        100;

      preCha.push({
        securityId,
        percentageChange,
      });
      if (
        firstDay &&
        secondDay &&
        thirdDay &&
        forthDay &&
        secondDay.dayHigh <= firstDay.dayHigh &&
        secondDay.dayLow >= firstDay.dayLow &&
        thirdDay.dayHigh <= firstDay.dayHigh &&
        thirdDay.dayLow >= firstDay.dayLow &&
        forthDay.dayHigh <= firstDay.dayHigh &&
        forthDay.dayLow >= firstDay.dayLow &&
        data.dayHigh <= firstDay.dayHigh &&
        data.dayLow >= firstDay.dayLow
      ) {
        // Percentage change calculation
        const date = getFormattedISTDate();
        responseData.push({
          ...stock,
          percentageChange: percentageChange.toFixed(2),
          securityId,
          timestamp: date,
        });
      }
    }

    // Bulk update the contraction model
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
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await ContractionModel.bulkWrite(bulkOps);
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return { message: "Internal server error", error: error.message };
  }
};

// const AIContraction = async (req, res) => {
//   try {
//     // Fetch the last 5 unique trading days
//     const uniqueTradingDays = await MarketDetailData.aggregate([
//       { $group: { _id: "$date" } },
//       { $sort: { _id: -1 } },
//       { $limit: 5 },
//     ]);

//     if (uniqueTradingDays.length < 5) {
//       return { message: "Not enough historical data (need 5 days)" };
//     }

//     console.log("uniqueTradingDays", uniqueTradingDays);

//     const targetDates = uniqueTradingDays.map((day) => day._id);

//     // Fetch market data for these dates
//     const previousData = await MarketDetailData.find(
//       { date: { $in: targetDates } },
//       {
//         securityId: 1,
//         data: 1,
//         date: 1,
//         _id: 0,
//       }
//     ).lean();

//     // Group data by date
//     const groupedData = targetDates.reduce((acc, date) => {
//       acc[date] = previousData.filter((entry) => entry.date === date);
//       return acc;
//     }, {});

//     // Create maps for each day's data
//     const dayMaps = targetDates.map(() => new Map());
//     targetDates.forEach((date, index) => {
//       groupedData[date]?.forEach((entry) => {
//         const d = entry.data[0];
//         // Validate data
//         if (
//           !d ||
//           isNaN(d.dayHigh) ||
//           isNaN(d.dayLow) ||
//           isNaN(d.dayOpen) ||
//           isNaN(d.dayClose) ||
//           isNaN(d.latestTradedPrice)
//         ) {
//           console.warn(`Invalid data for ${entry.securityId} on ${date}`);
//           return;
//         }
//         dayMaps[index].set(entry.securityId, {
//           securityId: entry.securityId,
//           dayHigh: Number(d.dayHigh),
//           dayLow: Number(d.dayLow),
//           open: Number(d.dayOpen),
//           close: Number(d.dayClose),
//           latestTradedPrice: Number(d.latestTradedPrice),
//           date,
//         });
//       });
//     });

//     const [
//       firstDayData,
//       secondDayData,
//       thirdDayData,
//       fourthDayData,
//       fifthDayData,
//     ] = dayMaps;

//     // Log map sizes for debugging
//     if (
//       firstDayData &&
//       secondDayData &&
//       thirdDayData &&
//       fourthDayData &&
//       fifthDayData
//     ) {
//       console.log(
//         "firstDayData →",
//         typeof firstDayData,
//         "| size:",
//         firstDayData.size
//       );
//       console.log(
//         "secondDayData →",
//         typeof secondDayData,
//         "| size:",
//         secondDayData.size
//       );
//       console.log(
//         "thirdDayData →",
//         typeof thirdDayData,
//         "| size:",
//         thirdDayData.size
//       );
//       console.log(
//         "fourthDayData →",
//         typeof fourthDayData,
//         "| size:",
//         fourthDayData.size
//       );
//       console.log(
//         "fifthDayData →",
//         typeof fifthDayData,
//         "| size:",
//         fifthDayData.size
//       );
//     }

//     // Fetch stock details
//     const stocks = await StocksDetail.find(
//       {},
//       { SECURITY_ID: 1, UNDERLYING_SYMBOL: 1, SYMBOL_NAME: 1, _id: 0 }
//     );
//     const stocksMap = new Map(
//       stocks.map((stock) => [stock.SECURITY_ID, stock])
//     );

//     let responseData = [];

//     // Analyze each stock in the 5th day's data
//     for (const [securityId, fifthDay] of fifthDayData.entries()) {
//       const stock = stocksMap.get(securityId);
//       if (!stock) {
//         console.warn(`Stock details missing for ${securityId}`);
//         continue;
//       }

//       const firstDay = firstDayData.get(securityId);
//       const secondDay = secondDayData.get(securityId);
//       const thirdDay = thirdDayData.get(securityId);
//       const fourthDay = fourthDayData.get(securityId);

//       // Ensure all days have data
//       if (!firstDay || !secondDay || !thirdDay || !fourthDay) {
//         console.warn(`Incomplete data for ${securityId}`);
//         continue;
//       }

//       // Check if 2nd, 3rd, and 4th candles are within the 1st candle's high-low range
//       const isContracting =
//         secondDay.dayHigh <= firstDay.dayHigh &&
//         secondDay.dayLow >= firstDay.dayLow &&
//         thirdDay.dayHigh <= firstDay.dayHigh &&
//         thirdDay.dayLow >= firstDay.dayLow &&
//         fourthDay.dayHigh <= firstDay.dayHigh &&
//         fourthDay.dayLow >= firstDay.dayLow;

//       // Optional: Check if the body (open and close) of Days 2–4 is within Day 1's high-low
//       // Uncomment if this is required based on "closing ho rahi hai" interpretation
//       /*
//       const isBodyContracting =
//         secondDay.open <= firstDay.dayHigh &&
//         secondDay.open >= firstDay.dayLow &&
//         secondDay.close <= firstDay.dayHigh &&
//         secondDay.close >= firstDay.dayLow &&
//         thirdDay.open <= firstDay.dayHigh &&
//         thirdDay.open >= firstDay.dayLow &&
//         thirdDay.close <= firstDay.dayHigh &&
//         thirdDay.close >= firstDay.dayLow &&
//         fourthDay.open <= firstDay.dayHigh &&
//         fourthDay.open >= firstDay.dayLow &&
//         fourthDay.close <= firstDay.dayHigh &&
//         fourthDay.close >= firstDay.dayLow;
//       */

//       // Check if 5th candle breaks the 1st candle's high or low
//       const isBreakout =
//         fifthDay.dayHigh > firstDay.dayHigh ||
//         fifthDay.dayLow < firstDay.dayLow;

//       // Use isContracting && isBreakout (add isBodyContracting if uncommented above)
//       if (isContracting && isBreakout /* && isBodyContracting */) {
//         console.log(`Pattern found for ${securityId}`);
//         // Calculate percentage change
//         const previousClose = fourthDay.close;
//         const todayClose = fifthDay.close;
//         const percentageChange =
//           ((todayClose - previousClose) / previousClose) * 100;

//         const date = getFormattedISTDate();
//         responseData.push({
//           ...stock,
//           percentageChange: percentageChange.toFixed(2),
//           securityId,
//           timestamp: date,
//         });
//       }
//     }

//     // Bulk update the ContractionModel
//     const bulkOps = responseData.map((data) => ({
//       updateOne: {
//         filter: { securityId: data.SECURITY_ID },
//         update: {
//           $set: {
//             securityId: data.SECURITY_ID,
//             UNDERLYING_SYMBOL: data.UNDERLYING_SYMBOL,
//             SYMBOL_NAME: data.SYMBOL_NAME,
//             percentageChange: data.percentageChange,
//           },
//         },
//         upsert: true,
//       },
//     }));

//     if (bulkOps.length > 0) {
//       await ContractionModel.bulkWrite(bulkOps);
//     }

//     return { success: true, data: responseData };
//   } catch (error) {
//     console.error("Error in AIContraction:", error);
//     return { message: "Internal server error", error: error.message };
//   }
// };

export {
  fiveDayRangeBreakers,
  tenDayRangeBreakers,
  dailyCandleReversal,
  AIContraction,
};
