import { Router } from "express";
import { UserSettingsController } from "./user-settings.controller";
import { authenticate } from "@/modules/middleware/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler";

const router = Router();
const controller = new UserSettingsController();

// All settings routes require authentication
router.use(authenticate);

router.get("/", asyncHandler(controller.getSettings));
router.put("/profile", asyncHandler(controller.updateProfile));
router.put("/notifications", asyncHandler(controller.updateNotifications));
router.put("/appearance", asyncHandler(controller.updateAppearance));
router.post("/change-password", asyncHandler(controller.changePassword));

export default router;