import { NotificationModel } from "./notification.model";
import { notificationQueue } from "../jobs/queues/notification.queue";

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

    return notification;
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const notifications = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await NotificationModel.countDocuments({ userId });
    const unreadCount = await this.getUnreadCount(userId);

    return {
      data: notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      unreadCount
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) throw new Error("Notification not found");
    return notification;
  }

  async markAllAsRead(userId: string) {
    const result = await NotificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return { modifiedCount: result.modifiedCount };
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await NotificationModel.findOneAndDelete({
      _id: notificationId,
      userId
    });
    if (!notification) throw new Error("Notification not found");
    return true;
  }

  async getUnreadCount(userId: string) {
    return NotificationModel.countDocuments({ userId, isRead: false });
  }
}