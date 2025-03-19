import mongoose from "mongoose";
const momentumStockSchemaFiveMin = new mongoose.Schema(
  {
    securityId: { type: String, required: true, unique: true },
    symbol_name: { type: String, required: true },
    symbol: { type: String, required: true },
    currentHigh: { type: Number, required: true },
    currentLow: { type: Number, required: true },
    previousHigh: { type: Number, required: true },
    previousLow: { type: Number, required: true },
    momentumType: {
      type: String,
      enum: ["Bullish", "Bearish"],
      required: true,
    },
    priceChange: { type: Number, required: true },
    percentageChange: { type: Number },
    sector: { type: [String], required: true }, // Array of strings
    index: { type: [String], required: true }, // Array of strings
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
); // Adds createdAt & updatedAt fields

const MomentumStockFiveMin = mongoose.model(
  "MomentumStockFiveMin",
  momentumStockSchemaFiveMin
);

export default MomentumStockFiveMin;
