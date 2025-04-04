import cron from "node-cron";
import MarketHoliday from "../models/holidays.model.js";
import scrapeAndSaveFIIDIIData from "./scrapData_Two.js";

// Helper to get IST time
const getISTTime = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

// Check if today is a market holiday or weekend
const checkMarketDay = async () => {
  const now = getISTTime();
  const todayDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format
  const dayOfWeek = now.getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    console.log("Weekend detected (Saturday/Sunday). Skipping execution.");
    return false;
  }

  try {
    const holiday = await MarketHoliday.findOne({
      date: new Date(todayDate),
    }).select("date");
    if (holiday) {
      console.log("Market holiday detected. Skipping execution.");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking holiday:", error.message);
    return false;
  }
};

// Run the scraping task only on market days
const runFIIDIIJob = async () => {
  if (await checkMarketDay()) {
    console.log("Market is open. Running FII/DII data scraping...");
    await scrapeAndSaveFIIDIIData();
  } else {
    console.log("Market closed. Skipping FII/DII data scraping.");
  }
};

const FiiDiiJob = cron.schedule("30 16 * * 1-5", runFIIDIIJob, {
  scheduled: true,
  timezone: "Asia/Kolkata",
});

console.log("📅 Scheduled FII/DII scraping job: 4:30 PM IST, Mon-Fri ✅");

export default FiiDiiJob;
