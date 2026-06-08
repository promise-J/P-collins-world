import { Response } from "express";
import { NotificationService } from "./notification.service";
import { apiResponse } from "../../utils/apiResponse";

export class NotificationController {
  private service = new NotificationService();

  getMyNotifications = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const notifications = await this.service.getUserNotifications(
      req.user.userId,
      page,
      limit
    );
    return apiResponse(res, true, "Notifications fetched", notifications);
  };

  markAsRead = async (req: any, res: Response) => {
    const notification = await this.service.markAsRead(
      req.params.id,
      req.user.userId
    );
    return apiResponse(res, true, "Notification marked as read", notification);
  };

  markAllAsRead = async (req: any, res: Response) => {
    const result = await this.service.markAllAsRead(req.user.userId);
    return apiResponse(res, true, "All notifications marked as read", result);
  };

  deleteNotification = async (req: any, res: Response) => {
    await this.service.deleteNotification(req.params.id, req.user.userId);
    return apiResponse(res, true, "Notification deleted");
  };

  getUnreadCount = async (req: any, res: Response) => {
    const count = await this.service.getUnreadCount(req.user.userId);
    return apiResponse(res, true, "Unread count fetched", { count });
  };
}