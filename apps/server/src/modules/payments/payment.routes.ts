import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();
const controller = new PaymentController();

router.post("/webhook", asyncHandler(controller.handleWebhook));

// Protected payment routes
router.post("/initialize", authenticate, asyncHandler(controller.initializePayment));
router.get("/verify/:reference", authenticate, asyncHandler(controller.verifyPayment));

export default router;