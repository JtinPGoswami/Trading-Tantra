import mongoose from "mongoose";

const dailyCandleReversalSchema = new mongoose.Schema(
  {
    securityId: { type: String, required: true, unique: true },
    fstPreviousDayChange: { type: Number, required: true },
    persentageChange: { type: Number, required: true },
    trend: {
      type: String,
      enum: ["BULLISH", "BEARISH"],
      required: true,
    },
    UNDERLYING_SYMBOL: { type: String, required: true },
    SYMBOL_NAME: { type: String, required: true },
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

const DailyCandleReversalModel = mongoose.model(
  "DailyCandleReversalModel",
  dailyCandleReversalSchema
);

export default DailyCandleReversalModel;
