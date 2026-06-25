import { Router } from "express";

import { asyncHandler } from "@/utils/asyncHandler";
import { UserRole } from "@/enum/role.enum";
import { authenticate } from "@/modules/middleware/auth.middleware";
import { authorize } from "@/modules/middleware/role.middleware";
import { AdminOrderController } from "../controllers/admin-order.controller";

const router = Router();
const controller = new AdminOrderController();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]));

router.get("/", asyncHandler(controller.getAllOrders));
router.get("/stats", asyncHandler(controller.getOrderStats));
router.get("/:id", asyncHandler(controller.getOrderDetails));
router.patch("/:id/status", asyncHandler(controller.updateOrderStatus));
router.patch("/:id/tracking", asyncHandler(controller.updateTrackingNumber));
router.post("/:id/note", asyncHandler(controller.addAdminNote));

export default router;