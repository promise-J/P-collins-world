import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const controller = new NotificationController();

router.get("/", authenticate, asyncHandler(controller.getMyNotifications));
router.patch("/:id/read", authenticate, asyncHandler(controller.markAsRead));
router.patch("/read-all", authenticate, asyncHandler(controller.markAllAsRead));
router.delete("/:id", authenticate, asyncHandler(controller.deleteNotification));
router.get("/unread/count", authenticate, asyncHandler(controller.getUnreadCount));

export default router;