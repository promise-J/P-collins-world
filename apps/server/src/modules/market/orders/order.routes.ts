import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../../utils/asyncHandler";

const router = Router();
const controller = new OrderController();

// All order routes require authentication
router.use(authenticate);
router.post("/", asyncHandler(controller.createOrder));
router.get("/", asyncHandler(controller.getMyOrders));
router.get("/:id", asyncHandler(controller.getOrder));
router.patch("/:id/pay", asyncHandler(controller.markAsPaid));
// router.patch("/:id/cancel", asyncHandler(controller.cancelOrder));

export default router;