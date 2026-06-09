import { Queue } from "bullmq";
import { bullmqConnection } from "../config/bullmq.config";

export const notificationQueue = new Queue("notification-queue", {
  connection: bullmqConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
