import { Router } from "express";
import { AuditController } from "./audit.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../../enum/role.enum";

const router = Router();
const controller = new AuditController();

router.get("/", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.getAuditLogs));
router.get("/user/:userId", authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(controller.getUserAuditLogs));

export default router;