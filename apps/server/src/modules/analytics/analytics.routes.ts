import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../../enum/role.enum";

const router = Router();
const controller = new AnalyticsController();

router.get("/platform", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.getPlatformMetrics));
router.get("/revenue", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.getRevenueAnalytics));
router.get("/products", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.getProductAnalytics));
router.get("/users", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.getUserAnalytics));
router.get("/properties", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.getPropertyAnalytics));
router.get("/savings", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.getSavingsAnalytics));

export default router;