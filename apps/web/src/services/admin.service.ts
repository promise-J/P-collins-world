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

  // Add KYC review method
  static async reviewKyc(kycId: string, status: string, reason?: string) {
    const response = await api.patch(`/kyc/${kycId}/review`, { status, reason });
    return response.data;
  }

  // Get single KYC details
  static async getKycDetails(kycId: string) {
    const response = await api.get(`/kyc/${kycId}`);
    return response.data;
  }

  // Get all KYC submissions (with filters)
  static async getAllKyc(params?: { page?: number; limit?: number; status?: string }) {
    const response = await api.get("/admin/kyc", { params });
    return response.data;
  }

  // Update user role
  static async updateUserRole(userId: string, role: string) {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  // Get platform statistics
  static async getPlatformStats() {
    const response = await api.get("/admin/stats");
    return response.data;
  }

  // Get system health
  static async getSystemHealth() {
    const response = await api.get("/admin/health");
    return response.data;
  }

  // Get audit logs
  static async getAuditLogs(params?: { page?: number; limit?: number; module?: string, search?: string, action?: string }) {
    const response = await api.get("/admin/audit-logs", { params });
    return response.data;
  }
}