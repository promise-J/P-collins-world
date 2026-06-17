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

  // Dummy data for testing
  static async getDummyNotifications(params?: { page?: number; limit?: number }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      success: true,
      data: dummyNotifications.slice(start, end),
      total: dummyNotifications.length,
      totalPages: Math.ceil(dummyNotifications.length / limit),
      currentPage: page,
    };
  }
}

// Dummy notifications data
export const dummyNotifications: Notification[] = [
  // Today
  {
    _id: "1",
    userId: "user1",
    title: "🎉 Welcome to P Collins!",
    message: "Thank you for joining P Collins. Start exploring our marketplace, savings, and real estate features.",
    type: "SUCCESS",
    isRead: false,
    actionUrl: "/dashboard",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    userId: "user1",
    title: "💰 Savings Goal Update",
    message: "You've reached 50% of your ₦500,000 savings goal! Keep up the great work!",
    type: "SUCCESS",
    isRead: false,
    actionUrl: "/savings",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    _id: "3",
    userId: "user1",
    title: "🏠 New Property Alert",
    message: "A new luxury apartment in Victoria Island has been listed. Check it out before it's gone!",
    type: "INFO",
    isRead: false,
    actionUrl: "/properties/1",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },

  // Yesterday
  {
    _id: "4",
    userId: "user1",
    title: "🛒 Order Confirmed",
    message: "Your order #ORD-12345 has been confirmed and is being processed for delivery.",
    type: "SUCCESS",
    isRead: true,
    actionUrl: "/orders/12345",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "5",
    userId: "user1",
    title: "⭐ New Review on Your Property",
    message: "John D. left a 5-star review on your property 'Luxury Apartment in Lekki'.",
    type: "INFO",
    isRead: true,
    actionUrl: "/properties/2/reviews",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },

  // This Week
  {
    _id: "6",
    userId: "user1",
    title: "👥 Group Savings Update",
    message: "Your group 'Christmas Rice Fund' has received 3 new contributions this week.",
    type: "INFO",
    isRead: true,
    actionUrl: "/savings/groups/group1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "7",
    userId: "user1",
    title: "💳 Wallet Funded",
    message: "Your wallet has been funded with ₦50,000. New balance: ₦75,000",
    type: "SUCCESS",
    isRead: true,
    actionUrl: "/wallet",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "8",
    userId: "user1",
    title: "📝 KYC Verification Complete",
    message: "Your KYC has been successfully verified. You now have full access to all features.",
    type: "SUCCESS",
    isRead: true,
    actionUrl: "/profile",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Last Week
  {
    _id: "9",
    userId: "user1",
    title: "🏷️ Flash Sale Alert",
    message: "50% off on selected electronics! Hurry, sale ends in 48 hours.",
    type: "WARNING",
    isRead: true,
    actionUrl: "/products?flashsale=true",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "10",
    userId: "user1",
    title: "👥 Group Invitation",
    message: "Sarah Johnson has invited you to join 'Tech Gadget Fund' savings group.",
    type: "INFO",
    isRead: true,
    actionUrl: "/savings/groups/group3",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "11",
    userId: "user1",
    title: "⭐ Property Favorite",
    message: "Your property 'Modern 4-Bedroom House' has been favorited by 5 users this week.",
    type: "INFO",
    isRead: true,
    actionUrl: "/properties/3",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Older
  {
    _id: "12",
    userId: "user1",
    title: "💰 Withdrawal Processed",
    message: "Your withdrawal of ₦25,000 has been processed and sent to your bank account.",
    type: "SUCCESS",
    isRead: true,
    actionUrl: "/wallet/transactions",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "13",
    userId: "user1",
    title: "🛒 Price Drop Alert",
    message: "An item in your cart has dropped in price! Save ₦5,000 on iPhone 15 Pro.",
    type: "INFO",
    isRead: true,
    actionUrl: "/cart",
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "14",
    userId: "user1",
    title: "👥 Savings Group Completed",
    message: "Congratulations! Your group 'Christmas Rice Fund' has reached its target of ₦500,000!",
    type: "SUCCESS",
    isRead: true,
    actionUrl: "/savings/groups/group1",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper function to group notifications by date
export function groupNotificationsByDate(notifications: Notification[]) {
  const groups: { [key: string]: Notification[] } = {};
  
  notifications.forEach((notification) => {
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