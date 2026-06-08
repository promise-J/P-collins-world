// BullMQ Redis connection configuration
export const bullmqConnection = process.env.REDIS_URL 
  ? {
      url: process.env.REDIS_URL,
      maxRetriesPerRequest: null,
      connectTimeout: 50000,
    }
  : {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || "0", 10),
      connectTimeout: 50000,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy: (times: number) => {
        return Math.min(times * 50, 2000);
      },
    };
