import cron from "node-cron";
import MarketHoliday from "../models/holidays.model.js";
import {
  AIContraction,
  dailyCandleReversal,
  fiveDayRangeBreakers,
  tenDayRangeBreakers,
} from "../controllers/swingAnalysis.controllers.js";

// Get IST time
const getISTTime = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

// Check for weekend or listed holiday
const checkHoliday = async () => {
  const now = getISTTime();
  const todayDate = now.toISOString().split("T")[0];
  const dayOfWeek = now.getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    console.log("Weekend detected (Saturday/Sunday).");
    return true;
  }

  try {
    const holiday = await MarketHoliday.findOne({
      date: new Date(todayDate),
    }).select("date");
    return !!holiday;
  } catch (error) {
    console.error("Error checking holiday:", error);
    return false;
  }
};

// Main task for after-market analysis
const runAfterMarketAnalysis = async () => {
  if (await checkHoliday()) {
    console.log("Market Holiday or Weekend. Skipping after-market analysis.");
    return;
  }

  try {
    console.log("Running after-market analysis at 3:35 PM IST...");

    const fd = await fiveDayRangeBreakers();
    const sd = await tenDayRangeBreakers();
    const td = await dailyCandleReversal();
    const fod = await AIContraction();

    console.log(
      "✅ After-market analysis completed.",
      "fiveDayRangeBreakers:",
      fd,
      "tenDayRangeBreakers:",
      sd,
      "dailyCandleReversal:",
      td,
      "AIContraction:",
      fod
    );
  } catch (error) {
    console.error("❌ Error in after-market analysis:", error.message);
  }
};

// Schedule the cron job (3:32 PM IST, Monday to Friday)
const scheduleAfterMarketJob = cron.schedule(
  "32 15 * * 1-5", // ⬅️ Runs at 3:32 PM IST
  runAfterMarketAnalysis,
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

console.log("✅ After-market cron job scheduled (3:32 PM IST, Mon-Fri)");

export default scheduleAfterMarketJob;
