import { Worker } from "bullmq";

import { startWebSocket } from "../../controllers/liveMarketData.controller.js";


new Worker(
    'liveData',
    async (data) => {
        console.log("running live data fetch....⛷️");
        startWebSocket();
    },
    { connection: { host: '127.0.0.1', port: 6379 } }
)