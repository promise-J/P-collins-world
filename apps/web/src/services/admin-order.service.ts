import { api } from "../lib/axios";

export interface Order {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    productId: {
      _id: string;
      name: string;
      images: string[];
      price: number;
      stock: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "FAILED";
  paymentMethod: "wallet" | "card";
  paymentReference?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    lga: string;
    country: string;
  };
  deliveryFee: number;
  estimatedDays: number;
  trackingNumber?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export class AdminOrderService {
  static async getAllOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const response = await api.get("/admin/orders", { params });
    return response.data;
  }

  static async getOrderDetails(orderId: string) {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  }

  static async updateOrderStatus(orderId: string, status: string, note?: string) {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status, note });
    return response.data;
  }

  static async updateTrackingNumber(orderId: string, trackingNumber: string) {
    const response = await api.patch(`/admin/orders/${orderId}/tracking`, { trackingNumber });
    return response.data;
  }

  static async addAdminNote(orderId: string, note: string) {
    const response = await api.post(`/admin/orders/${orderId}/note`, { note });
    return response.data;
  }

  static async getOrderStats() {
    const response = await api.get("/admin/orders/stats");
    return response.data;
  }
}