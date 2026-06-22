import { Router } from "express";

import { CartController } from "./cart.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../../utils/asyncHandler";

const router = Router();

const controller = new CartController();

router.post("/add", authenticate, asyncHandler(controller.addToCart));

router.get("/", authenticate, asyncHandler(controller.getCart));

router.delete("/", authenticate, asyncHandler(controller.clearCart));

router.patch("/update/:productId", authenticate, asyncHandler(controller.updateQuantity));
router.delete("/remove/:productId", authenticate, asyncHandler(controller.removeItem));
router.get("/count", authenticate,asyncHandler(controller.getCartCount));

export default router;
