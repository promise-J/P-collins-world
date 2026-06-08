import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { envSchema } from "../validators/env.validator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnvPath = path.resolve(__dirname, "../../../../.env");

dotenv.config({ path: rootEnvPath });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors);

  process.exit(1);
}

export const env = parsed.data;
