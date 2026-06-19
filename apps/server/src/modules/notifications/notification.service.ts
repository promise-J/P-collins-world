import { NotificationModel } from "./notification.model";
import { notificationQueue } from "../jobs/queues/notification.queue";
import { serviceResponse } from "@/utils/apiResponse";

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  actionUrl?: string;
}

export class NotificationService {
  async create({ userId, title, message, type, actionUrl }: CreateNotificationInput) {
    const notification = await NotificationModel.create({
      userId,
      title,
      message,
      type: type || "INFO",
      actionUrl
    });

    // Add to queue for potential email delivery
    await notificationQueue.add("send-notification", {
      userId,
      title,
      message,
      type: type || "INFO",
      sendEmail: false, // Set to true if you want email notifications
    });

    return serviceResponse(true, 'Notification created', notification);
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const notifications = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await NotificationModel.countDocuments({ userId });
    const unreadCount = await this.getUnreadCount(userId);

    return serviceResponse(true, 'User notifications', {
      data: notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      unreadCount
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) return serviceResponse(false, "Notification not found");
    return serviceResponse(true, 'Notificaion marked as read', notification);
  }

  async markAllAsRead(userId: string) {
    const result = await NotificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return serviceResponse(true, 'All notifications marked as read', { modifiedCount: result.modifiedCount });
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await NotificationModel.findOneAndDelete({
      _id: notificationId,
      userId
    });
    if (!notification) return serviceResponse(false, "Notification not found");
    return serviceResponse(true, 'Notification deleted', true);
  }

  async getUnreadCount(userId: string) {
    const result = await NotificationModel.countDocuments({ userId, isRead: false });
    return serviceResponse(true, 'Notification count fetched', result)
  }
}