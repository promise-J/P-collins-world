import { Worker } from "bullmq";
import { bullmqConnection } from "../config/bullmq.config";
import { NotificationService } from "../../notifications/notification.service";
import { EmailService } from "../../email/email.service";
import { emitEvent } from "../../realtime/events/event.emitter";
import { SocketEvents } from "../../realtime/events/event.types";
import { logger } from "../../../config/logger";

const notificationService = new NotificationService();
const emailService = new EmailService();

export const notificationWorker = new Worker(
  "notification-queue",
  async (job) => {
    const { userId, title, message, type, sendEmail, emailData } = job.data;

    logger.info(`Processing notification job ${job.id} for user ${userId}`);

    try {
      const notification = await notificationService.create({userId, title, message, type});

      emitEvent(SocketEvents.NOTIFICATION, userId, notification);

      if (sendEmail && emailData?.to) {
        await emailService.sendEmail(emailData.to, title, emailData.html || message);
      }

      return notification;
    } catch (error) {
      logger.error(error, `Failed to process notification:`);
      throw error;
    }
  },
  {
    connection: bullmqConnection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);

notificationWorker.on("completed", (job) => {
  logger.info(`Notification job ${job.id} completed successfully`);
});

notificationWorker.on("failed", (job, err) => {
  logger.error(err, `Notification job ${job?.id} failed:`);
});

notificationWorker.on("error", (err) => {
  logger.error(err, "Notification worker error:");
});

logger.info("🚀 Notification worker initialized");
