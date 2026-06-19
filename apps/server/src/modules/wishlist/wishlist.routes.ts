import { Router } from "express";
import { WishlistController } from "./wishlist.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const controller = new WishlistController();

// All wishlist routes require authentication
router.use(authenticate);

router.get("/", asyncHandler(controller.getWishlist));
router.post("/:productId", asyncHandler(controller.addToWishlist));
router.delete("/:productId", asyncHandler(controller.removeFromWishlist));
router.delete("/clear/all", asyncHandler(controller.clearWishlist));
router.get("/check/:productId", asyncHandler(controller.checkInWishlist));
router.get("/count", asyncHandler(controller.getWishlistCount));

export default router;