import mongoose from "mongoose";

const MomentumSignalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Bullish Reversal", "Bearish Reversal"],
    },
    securityId: {
      type: String,
      required: true,
    },
    stockSymbol: {
      type: String,
      required: true,
      default: "N/A",
    },
    stockName: {
      type: String,
      required: true,
      default: "N/A",
    },
    lastTradePrice: {
      type: Number,
      required: true,
    },
    previousClosePrice: {
      type: Number,
      required: true,
    },
    percentageChange: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: () => {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30 (5.5 hours in milliseconds)
        return new Date(now.getTime() + istOffset);
      },
    },
  },
  { timestamps: true }
);

const fiveMinMomentumSignal = mongoose.model(
  "MomentumSignal",
  MomentumSignalSchema
);

export default fiveMinMomentumSignal;
