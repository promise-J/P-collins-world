import { Router } from "express";

import { OrderController } from "./order.controller";

import { authenticate } from "../../middleware/auth.middleware";

import { asyncHandler } from "../../../utils/asyncHandler";

const router = Router();

const controller = new OrderController();

router.post(
  "/create-from-cart",
  authenticate,
  asyncHandler(controller.createFromCart)
);

router.get(
  "/",
  authenticate,
  asyncHandler(controller.getMyOrders)
);

router.patch(
  "/:id/pay",
  authenticate,
  asyncHandler(controller.markAsPaid)
);

export default router;