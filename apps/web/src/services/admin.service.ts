import { api } from "@/lib/axios";

export class AdminService {
  static async getDashboardMetrics() {
    const response = await api.get("/admin/dashboard");
    return response.data;
  }

  static async getUsers(params?: { page?: number; limit?: number; role?: string; search?: string }) {
    const response = await api.get("/admin/users", { params });
    return response.data;
  }

  static async getPendingKyc() {
    const response = await api.get("/admin/analytics/pending-kyc");
    return response.data;
  }

  static async getMonthlyRevenue() {
    const response = await api.get("/admin/analytics/revenue");
    return response.data;
  }

  static async getTopProducts() {
    const response = await api.get("/admin/analytics/top-products");
    return response.data;
  }

  static async getTotalSavings() {
    const response = await api.get("/admin/analytics/total-savings");
    return response.data;
  }

  static async suspendUser(userId: string, reason: string) {
    const response = await api.post(`/admin/users/${userId}/suspend`, { reason });
    return response.data;
  }

  static async activateUser(userId: string) {
    const response = await api.post(`/admin/users/${userId}/activate`);
    return response.data;
  }

  static async verifyAgent(userId: string) {
    const response = await api.post(`/admin/users/${userId}/verify-agent`);
    return response.data;
  }

  static async verifyLandlord(userId: string) {
    const response = await api.post(`/admin/users/${userId}/verify-landlord`);
    return response.data;
  }
}