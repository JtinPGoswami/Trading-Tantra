import mongoose from "mongoose";

const fiveDayRangeBreakerSchema = new mongoose.Schema(
  {
    securityId: { type: String, required: true, unique: true },
    UNDERLYING_SYMBOL: { type: String, required: true },
    SYMBOL_NAME: { type: String, required: true },
    todayHigh: { type: Number, required: true },
    todayLow: { type: Number, required: true },
    todayLatestTradedPrice: { type: Number, required: true },
    preFiveDaysHigh: { type: Number, required: true },
    preFiveDaysLow: { type: Number, required: true },
    percentageChange: { type: Number, required: true },
    type: { type: String, enum: ["bullish", "bearish"], required: true },
    timestamp: {
      type: Date,
      default: () => {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        return new Date(now.getTime() + istOffset);
      },
    },
  },
  { timestamps: true }
);

const FiveDayRangeBreakerModel = mongoose.model(
  "FiveDayRangeBreakerModel",
  fiveDayRangeBreakerSchema
);

export default FiveDayRangeBreakerModel;
