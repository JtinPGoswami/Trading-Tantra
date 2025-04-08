import { Worker } from "bullmq";

import { getData } from "../../controllers/liveMarketData.controller.js";

new Worker(
  "fiveMinData",
  async (job) => {
   try {
     const { fromDate, toDate } = job.data;
     console.log("running five min candle fetch....⛷️");
     await getData(fromDate, toDate);
    
   } catch (error) {
      console.log('error in five min worker',error.message)
   }
  },
  { connection: { host: "127.0.0.1", port: 6379 } }
);
