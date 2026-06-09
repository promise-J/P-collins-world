import { Queue } from "bullmq";
import { bullmqConnection } from "../config/bullmq.config";

export const emailQueue = new Queue("email-queue", {
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


export const addEmailJob = async (to: string, subject: string, html: string) => {
  return emailQueue.add("send-email", { to, subject, html });
};
