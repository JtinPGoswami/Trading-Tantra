import cron from "node-cron";
import MarketHoliday from "../models/holidays.model.js";
import { startWebSocket } from "../controllers/liveMarketData.controller.js";

// Helper to get IST time
const getISTTime = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

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
    console.error("Error checking holiday:", error.message);
    return false;
  }
};

const runMarketTask = async () => {
  const now = getISTTime();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  if (await checkHoliday()) {
    console.log("Market Holiday or Weekend. Skipping execution.");
    return;
  }

  if (hours < 9 || hours > 15 || (hours === 15 && minutes > 40)) {
    console.log(
      "Outside market hours (9:25 AM - 3:40 PM IST). Skipping execution."
    );
    return;
  }

  try {
    console.log("Running market task at", now.toLocaleTimeString());
    await startWebSocket();
  } catch (error) {
    console.error("Error in market task:", error.message);
  }
};

const scheduleMarketJob = cron.schedule(
  "*/2 9-15 * * 1-5", // Every 2 minutes, 9 AM to 3 PM, Monday-Friday
  runMarketTask,
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

console.log(
  "Market cron job scheduled: Every 2 minutes, 9:25 AM - 3:40 PM IST, Mon-Fri ✅"
);

export default scheduleMarketJob;
