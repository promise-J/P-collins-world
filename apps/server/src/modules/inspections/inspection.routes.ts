import { Router } from "express";
import { InspectionController } from "./inspection.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../../enum/role.enum";

const router = Router();
const controller = new InspectionController();

router.post("/:propertyId/book", authenticate, asyncHandler(controller.bookInspection));
router.patch("/:id/status", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.updateStatus));
router.get("/my", authenticate, asyncHandler(controller.getMyInspections));
router.get("/property/:propertyId", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT, UserRole.LANDLORD), asyncHandler(controller.getPropertyInspections));
router.post("/:id/cancel", authenticate, asyncHandler(controller.cancelInspection));

export default router;