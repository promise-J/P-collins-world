import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.string(),

  MONGO_URI: z.string(),

  JWT_SECRET: z.string(),

  JWT_REFRESH_SECRET: z.string(),

  REDIS_URL: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  PAYSTACK_SECRET_KEY: z.string(),
  BREVO_API_KEY: z.string(),
  APP_NAME: z.string(),
  EMAIL_FROM: z.string(),
  WEB_URL: z.string(),
  ADMIN_URL: z.string(),
  FIREBASE_SERVICE_ACCOUNT: z.string()
});

export type Env = z.infer<typeof envSchema>;
