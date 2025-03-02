import { validationResult } from "express-validator";
import TradDate from "../models/tradDate.model.js";

const addTrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    dateRange,
    entryDate,
    exitDate,
    symbol,
    entryPrice,
    exitPrice,
    quantity,
  } = req.body;
  const loggedInUser = req.user;

  try {
    const entryPriceNum = parseFloat(entryPrice);
    const exitPriceNum = parseFloat(exitPrice);
    if (entryPriceNum <= 0 || exitPriceNum <= 0 || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Entry price, exit price, and quantity must be positive values",
      });
    }

    const profitLossPercentage =
      ((exitPriceNum - entryPriceNum) / entryPriceNum) * 100;
    const totalProfitOrLoss = (exitPriceNum - entryPriceNum) * quantity;

    const newTrade = new TradDate({
      dateRange,
      entryDate,
      exitDate,
      symbol,
      entryPrice: entryPriceNum,
      exitPrice: exitPriceNum,
      quantity,
      profitLossPercentage,
      totalProfitOrLoss,
      userID: loggedInUser._id,
    });

    const savedTrade = await newTrade.save();

    return res.status(201).json({
      success: true,
      message: "Trade added successfully",
      trade: savedTrade,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in add trade",
      error: error.message,
    });
  }
};

const getAddedTrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fromDate, toDate } = req.body;
  const loggedInUser = req.user;

  try {
    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range: fromDate should be before toDate",
      });
    }

    const trades = await TradDate.find({
      userID: loggedInUser._id,
      entryDate: { $gte: new Date(fromDate) },
      exitDate: { $lte: new Date(toDate) },
    });

    if (!trades || trades.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No trades found where entryDate >= ${fromDate} and exitDate <= ${toDate}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trades retrieved successfully",
      trades: trades,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching trades",
      error: error.message,
    });
  }
};

export { addTrade, getAddedTrade };
