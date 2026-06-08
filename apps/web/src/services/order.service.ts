import { api } from "@/lib/axios";


export class OrderService {
  static async getMyOrders(params?: { page?: number; limit?: number; status?: string }) {
    const response = await api.get("/orders", { params });
    return response.data;
  }

  static async getOne(id: string) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }

  static async createFromCart() {
    const response = await api.post("/orders/create-from-cart");
    return response.data;
  }

  static async markAsPaid(orderId: string, reference: string) {
    const response = await api.patch(`/orders/${orderId}/pay`, { reference });
    return response.data;
  }
}