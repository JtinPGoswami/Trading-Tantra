import { Worker } from "bullmq";
import { getDataForTenMin } from "../../controllers/liveMarketData.controllerj.js";


// Worker BullMQ ka part hai — iska kaam queue se jobs uthana aur unhe run karna hota hai.
new Worker(
  "TenMinData",
  async (job) => {
    const { fromDate, toDate } = job.data;
    console.log("running ten min candle fetch....⛷️");
    const data = await getDataForTenMin(fromDate, toDate);
  },
  { connection: { host: "127.0.0.1", port: 6379 } }
);
