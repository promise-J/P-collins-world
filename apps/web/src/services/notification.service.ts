import { api } from "../lib/axios";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export class NotificationService {
  static async getNotifications(params?: {
    page?: number;
    limit?: number;
  }) {
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

// ✅ Fixed: Handle notifications.data structure
export function groupNotificationsByDate(notifications: any): { [key: string]: Notification[] } {
  const groups: { [key: string]: Notification[] } = {};
  
  // Handle different data structures
  let notificationList: Notification[] = [];
  
  if (Array.isArray(notifications)) {
    notificationList = notifications;
  } else if (notifications?.data && Array.isArray(notifications.data)) {
    notificationList = notifications.data;
  } else if (notifications?.data?.data && Array.isArray(notifications.data.data)) {
    notificationList = notifications.data.data;
  } else {
    console.warn('No notifications data found', notifications);
    return groups;
  }


  notificationList.forEach((notification) => {
    if (!notification.createdAt) {
      return;
    }

    const date = new Date(notification.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey = "";
    
    if (date.toDateString() === today.toDateString()) {
      groupKey = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = "Yesterday";
    } else {
      const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) {
        groupKey = "This Week";
      } else if (daysDiff < 14) {
        groupKey = "Last Week";
      } else {
        groupKey = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
      }
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
  });
  
  return groups;
}