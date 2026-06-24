import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import { requestLogger } from "./middleware/request-logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import allRoutes from "./routes/index";
import { PaymentWebhookController } from "./modules/webhook/webhook.js";


const app = express();
const webhookController = new PaymentWebhookController();


app.use(requestLogger);

const WEB_URL = process.env.WEB_URL || "";
const ADMIN_URL = process.env.ADMIN_URL || "";

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));

app.set("trust proxy", 1);

app.use(cors({
  origin: [
    WEB_URL,
    ADMIN_URL
  ],
  credentials: true
}));

app.post("/webhook", express.raw({ type: "application/json" }), webhookController.handleWebhook);

app.use(compression());

app.use(express.json());
app.use(cookieParser()); 

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", allRoutes);

app.use("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the P Collins API site!",
    timestamp: new Date().toISOString()
  });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;