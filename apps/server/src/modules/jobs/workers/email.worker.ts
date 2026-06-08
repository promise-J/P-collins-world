import { Worker } from "bullmq";
import { bullmqConnection } from "../config/bullmq.config";
import { EmailService } from "../../email/email.service";
import { logger } from "../../../config/logger";

const emailService = new EmailService();

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, html } = job.data;
    
    console.log(`📧 Processing email job ${job.id}`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    
    try {
      const result = await emailService.sendEmail(to, subject, html);
      console.log(`✅ Email sent successfully to ${to}`);
      return { success: true, result };
    } catch (error: any) {
      console.error(`❌ Failed to send email to ${to}:`, error.message);
      throw error;
    }
  },
  {
    connection: bullmqConnection,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`✅ Email job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Email job ${job?.id} failed:`, err.message);
});

emailWorker.on("error", (err) => {
  console.error("❌ Email worker error:", err.message);
});

console.log("🚀 Email worker initialized");