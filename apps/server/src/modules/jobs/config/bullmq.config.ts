import { env } from "@/config/env";

// BullMQ Redis connection configuration
export const bullmqConnection = {
      url: env.REDIS_URL,
      maxRetriesPerRequest: null,
      connectTimeout: 50000,
    }
