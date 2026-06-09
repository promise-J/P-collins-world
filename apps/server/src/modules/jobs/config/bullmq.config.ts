import { env } from "@/config/env";

export const bullmqConnection = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null,
  connectTimeout: 50000,
  tls: env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
};
