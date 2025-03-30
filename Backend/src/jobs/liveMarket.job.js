// import cron from "node-cron";
// import MarketHoliday from "../models/holidays.model.js";
// import { startWebSocket } from "../controllers/liveMarketData.controller.js";

// // Helper to get IST time
// const getISTTime = () => {
//   const now = new Date();
//   return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
// };

// const checkHoliday = async () => {
//   const now = getISTTime();
//   const todayDate = now.toISOString().split("T")[0];
//   const dayOfWeek = now.getDay();

//   if (dayOfWeek === 0 || dayOfWeek === 6) {
//     console.log("Weekend detected (Saturday/Sunday).");
//     return true;
//   }

//   try {
//     const holiday = await MarketHoliday.findOne({
//       date: new Date(todayDate),
//     }).select("date");
//     return !!holiday;
//   } catch (error) {
//     console.error("Error checking holiday:", error.message);
//     return false;
//   }
// };

// const runMarketTask = async () => {
//   const now = getISTTime();
//   const hours = now.getHours();
//   const minutes = now.getMinutes();

//   if (await checkHoliday()) {
//     console.log("Market Holiday or Weekend. Skipping execution.");
//     return;
//   }

//   if (hours < 9 || hours > 15 || (hours === 15 && minutes > 40)) {
//     console.log(
//       "Outside market hours (9:25 AM - 3:40 PM IST). Skipping execution."
//     );
//     return;
//   }

//   try {
//     console.log("Running market task at", now.toLocaleTimeString());
//     await startWebSocket();
//   } catch (error) {
//     console.error("Error in market task:", error.message);
//   }
// };

// const scheduleMarketJob = cron.schedule(
//   "*/2 9-15 * * 1-5", // Every 2 minutes, 9 AM to 3 PM, Monday-Friday
//   runMarketTask,
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   }
// );

// console.log(
//   "Market cron job scheduled: Every 2 minutes, 9:25 AM - 3:40 PM IST, Mon-Fri ✅"
// );

// export default scheduleMarketJob;

import cron from "node-cron";
import MarketHoliday from "../models/holidays.model.js";
import {
  getData,
  getDataForTenMin,
} from "../controllers/liveMarketData.controller.js";

// Helper to get IST time
const getISTTime = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

// Check if today is a holiday or weekend
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

// Sequential Execution of Both Functions
const runMarketTask = async () => {
  const now = getISTTime();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Check if today is a holiday or outside market hours
  if (await checkHoliday()) {
    console.log("Market Holiday or Weekend. Skipping execution.");
    return;
  }

  if (
    hours < 9 ||
    (hours === 9 && minutes < 15) ||
    hours > 15 ||
    (hours === 15 && minutes > 40)
  ) {
    console.log(
      "Outside market hours (9:15 AM - 3:40 PM IST). Skipping execution."
    );
    return;
  }

  try {
    console.log(`Running market task at ${now.toLocaleTimeString()}`);
    const today = new Date();
    const fromDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    console.log(formattedDate);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const toDate = tomorrow.toISOString().split("T")[0];
    console.log(formattedDate);

    console.log("Executing getDataForTenMin...");
    await getDataForTenMin(fromDate, toDate);

    console.log("Executing getData for 5 min...");
    await getData(fromDate, toDate);

    console.log("Market task completed.");
  } catch (error) {
    console.error("Error in market task:", error.message);
  }
};

// Schedule the cron job
const scheduleMarketJob = cron.schedule(
  "*/2 9-15 * * 1-5", // Runs every 2 minutes, Monday to Friday (9 AM - 3 PM)
  runMarketTask,
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

console.log(
  "Market cron job scheduled: Every 2 minutes, 9:15 AM - 3:40 PM IST, Mon-Fri ✅"
);

export default scheduleMarketJob;
