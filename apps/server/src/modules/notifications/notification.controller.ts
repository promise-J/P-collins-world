import { Response } from "express";
import { NotificationService } from "./notification.service";
import { apiResponse } from "../../utils/apiResponse";

export class NotificationController {
  private service = new NotificationService();

  getMyNotifications = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const result = await this.service.getUserNotifications(
      req.user._id,
      page,
      limit
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  markAsRead = async (req: any, res: Response) => {
    const result = await this.service.markAsRead(
      req.params.id,
      req.user._id
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  markAllAsRead = async (req: any, res: Response) => {
    const result = await this.service.markAllAsRead(req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  deleteNotification = async (req: any, res: Response) => {
    const result = await this.service.deleteNotification(req.params.id, req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  getUnreadCount = async (req: any, res: Response) => {
    const count = await this.service.getUnreadCount(req.user._id);
    return apiResponse(res, true, "Unread count fetched", { count });
  };
}