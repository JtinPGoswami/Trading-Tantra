import mongoose, { Mongoose } from "mongoose";

const MarketDataSchema = new mongoose.Schema(
  {
    securityId: String,
    data: {
      responseCode: Number,
      latestTradedPrice: Number,
      lastTradedQty: Number,
      lastTradeTime: Number,
      avgTradePrice: Number,
      volume: Number,
      totalSellQty: Number,
      totalBuyQty: Number,
      openInterest: Number,
      highestOpenInterest: Number,
      lowestOpenInterest: Number,
      dayOpen: Number,
      dayClose: Number,
      dayHigh: Number,
      dayLow: Number,
      marketDepth: [
        {
          price: Number,
          quantity: Number,
          orders: Number,
          buySell: Number,
        },
      ],
    },
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: "StocksDetail" },
    date: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "1814400s" },//auto delete entries after 21 days
  },

  { timestamps: true }
);

const MarketDetailData = mongoose.model("MarketDetailData", MarketDataSchema);
export default MarketDetailData;
