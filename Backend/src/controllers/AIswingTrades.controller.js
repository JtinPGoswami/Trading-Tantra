import ContractionModel from "../models/Contraction.model.js";
import DailyCandleReversalModel from "../models/dailyCandleRevarsal.model.js";
import DailyRangeBreakouts from "../models/dailyRangeBreakout.model.js";
import FiveDayRangeBreakerModel from "../models/fiveDayRangeBreacker.model.js";
import TenDayRangeBreakerModel from "../models/tenDayRangeBreacker.model.js";

const FiveDayBO = async (req, res) => {
  try {
    const data = await FiveDayRangeBreakerModel.find(
      {},
      {
        _id: 0,
        SYMBOL_NAME: 1,
        UNDERLYING_SYMBOL: 1,
        type: 1,
        timestamp: 1,
        percentageChange: 1,
      }
    ).lean();

    if (!data) {
      res.status(404).json({ success: false, message: "No data found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const TenDayBO = async (req, res) => {
  try {
    const data = await TenDayRangeBreakerModel.find(
      {},
      {
        _id: 0,
        SYMBOL_NAME: 1,
        UNDERLYING_SYMBOL: 1,
        type: 1,
        timestamp: 1,
        persentageChange: 1,
      }
    ).lean();

    if (!data) {
      res.status(404).json({ success: false, message: "No data found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const AICandleReversal = async (req, res) => {
  try {
    const data = await DailyCandleReversalModel.find(
      {},
      {
        _id: 0,
        SYMBOL_NAME: 1,
        UNDERLYING_SYMBOL: 1,
        type: 1,
        timestamp: 1,
        persentageChange: 1,
      }
    );

    if (!data) {
      res.status(404).json({ success: false, message: "No data found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const AICandleBreakers = async (req, res) => {
  try {
    const data = await DailyRangeBreakouts.find(
      {},
      {
        _id: 0,
        stockSymbol: 1,
        stockName: 1,
        type: 1,
        timestamp: 1,
        percentageChange: 1,
      }
    );

    if (!data) {
      res.status(404).json({ success: false, message: "No data found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const AIContraction = async (req, res) => {
    try {
        const data = await ContractionModel.find({},{
            _id: 0,
            SYMBOL_NAME: 1,
            UNDERLYING_SYMBOL: 1,
            timestamp: 1,
        }).lean();

        if(!data){
            res.status(404).json({success: false, message: "No data found"})
        }

        res.status(200).json({success: true, data})


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
        
    }
}


export { FiveDayBO, TenDayBO, AICandleReversal,AICandleBreakers , AIContraction};
