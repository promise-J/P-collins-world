import { Router } from "express";

import { ProductController } from "./product.controller"

import { authenticate } from "../../middleware/auth.middleware";

import { asyncHandler } from "../../../utils/asyncHandler";

const router = Router();

const controller = new ProductController();

router.post(
  "/",
  authenticate,
  asyncHandler(controller.create)
);

router.get(
  "/",
  asyncHandler(controller.list)
);

router.get(
  "/search",
  asyncHandler(controller.search)
);

router.get(
  "/:id",
  asyncHandler(controller.getOne)
);

export default router;