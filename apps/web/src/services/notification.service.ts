import { api } from "@/lib/axios";


export class NotificationService {
  static async getNotifications(params?: { page?: number; limit?: number }) {
    const response = await api.get("/notifications", { params });
    return response.data;
  }

  static async markAsRead(notificationId: string) {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }

  static async markAllAsRead() {
    const response = await api.patch("/notifications/read-all");
    return response.data;
  }

  static async deleteNotification(notificationId: string) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }

  static async getUnreadCount() {
    const response = await api.get("/notifications/unread/count");
    return response.data;
  }
}