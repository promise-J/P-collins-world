import { Router } from "express";
import { ReviewController } from "./review.controller";
import { asyncHandler } from "../../../utils/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();
const controller = new ReviewController();

router.post("/product/:productId", authenticate, asyncHandler(controller.createReview));
router.get("/product/:productId", asyncHandler(controller.getProductReviews));
router.patch("/:id", authenticate, asyncHandler(controller.updateReview));
router.delete("/:id", authenticate, asyncHandler(controller.deleteReview));
router.get("/my", authenticate, asyncHandler(controller.getMyReviews));

export default router;