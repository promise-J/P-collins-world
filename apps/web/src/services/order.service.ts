import { AxiosError } from "axios";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

export interface OrderData {
  items: any[];
  totalAmount: number;
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
  paymentMethod: "wallet" | "card";
  paymentReference?: string;
}

export class OrderService {
  static async createOrder(data: OrderData) {
    try {
      const response = await api.post("/orders", data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{message?: string}>;
      const err: string = axiosError.response?.data?.message || "Something went wrong. Please try again later"
      toast.error(err)
    }
      
  }

  static async getMyOrders(params?: { page?: number; limit?: number; status?: string }) {
    const response = await api.get("/orders", { params });
    return response.data;
  }

  static async getOrderDetails(orderId: string) {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  }

  static async markAsPaid(orderId: string, reference: string) {
    const response = await api.patch(`/orders/${orderId}/pay`, { reference });
    return response.data;
  }

  static async cancelOrder(orderId: string) {
    const response = await api.patch(`/orders/${orderId}/cancel`);
    return response.data;
  }
}