import { Router } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import { UserRole } from "../../../enum/role.enum";
import { CouponController } from "./coupon.controller";

const router = Router();
const controller = new CouponController();

// Public
router.post("/validate", asyncHandler(controller.validateCoupon));

// Admin only
router.post("/", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.createCoupon));
router.get("/", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.listCoupons));
router.patch("/:id", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.updateCoupon));
router.delete("/:id", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.deleteCoupon));

export default router;