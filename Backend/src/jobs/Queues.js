import { Queue } from "bullmq";

const connection = {
  host: "127.0.0.1", // localhost pe Redis chal raha hai.
  port: 6379, //Redis ka default port hai.
}; //Ye Redis connection ka config hai.

export const liveDataQueue = new Queue("liveData", { connection });
export const TenMinDataQueue = new Queue("TenMinData", { connection });
export const fiveMinDataQueue = new Queue("fiveMinData", { connection });
