import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";
import { initSocket } from "./modules/realtime/socket/socket.server.js";
import { connectRedis } from "./config/redis.js";

// Import workers
import "./modules/jobs/workers/email.worker.js";
import "./modules/jobs/workers/notification.worker.js";

const server = http.createServer(app);

const io = initSocket(server);

const startServer = async () => {
  try {
    server.listen(env.PORT, async () => {
      logger.info(`Server and WebSockets running on port ${env.PORT}`);
      connectRedis();
      await connectDatabase();
    });
  } catch (error) {
    logger.error("Failed to start the server:", error as any);
    process.exit(1);
  }
};

startServer();