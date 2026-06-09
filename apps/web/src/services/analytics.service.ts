import { api } from "@/lib/axios";

export class AnalyticsService {
  static async getPlatformMetrics() {
    const response = await api.get("/analytics/platform");
    return response.data;
  }

  static async getRevenueAnalytics(params?: { startDate?: Date; endDate?: Date }) {
    const response = await api.get("/analytics/revenue", { params });
    return response.data;
  }

  static async getProductAnalytics() {
    const response = await api.get("/analytics/products");
    return response.data;
  }

  static async getUserAnalytics() {
    const response = await api.get("/analytics/users");
    return response.data;
  }

  static async getPropertyAnalytics() {
    const response = await api.get("/analytics/properties");
    return response.data;
  }

  static async getSavingsAnalytics() {
    const response = await api.get("/analytics/savings");
    return response.data;
  }
}