import { Worker } from "bullmq";

import { getData } from "../../controllers/liveMarketData.controller.js";

new Worker(
  "fiveMinData",
  async (job) => {
    const { fromDate, toDate } = job.data;
    console.log("running five min candle fetch....⛷️");
    const data = await getData(fromDate, toDate);
   
  },
  { connection: { host: "127.0.0.1", port: 6379 } }
);
