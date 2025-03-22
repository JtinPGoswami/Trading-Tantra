import mongoose from "mongoose";

const ContractionSchema = new mongoose.Schema(
  {
    securityId: { type: String, required: true, unique: true },
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

const ContractionModel = mongoose.model("AIContraction", ContractionSchema);

export default ContractionModel;
