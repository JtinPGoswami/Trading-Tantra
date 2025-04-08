import { Worker } from "bullmq";

import { startWebSocket } from "../../controllers/liveMarketData.controller.js";


new Worker(
    'liveData',
    async (data) => {
      try {
          console.log("running live data fetch....⛷️");
        await startWebSocket();
      } catch (error) {
        console.log('error in live worker',error)
      }
    },
    { connection: { host: '127.0.0.1', port: 6379 } }
)