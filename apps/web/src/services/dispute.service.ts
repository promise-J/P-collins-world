import { api } from "../lib/axios";


export interface DisputeData {
  _id: string;
  title: string;
  description: string;
  type: "ORDER" | "PROPERTY" | "PAYMENT" | "OTHER";
  priority?: "HIGH" | "MEDIUM" | "LOW";
  orderId?: string;
  propertyId?: string;
  customer: {
    userId: string;
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
  };
  status: "PENDING" | "CLOSED" | "RESOLVED" | "IN_REVIEW";
  resolution: string;
  createdAt: Date;
}

export class DisputeService {
  static async getDisputes(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    type?: string;
    search?: string;
  }) {
    const response = await api.get("/admin/disputes", { params });
    return response.data;
  }

  static async getDisputeStats() {
    const response = await api.get("/admin/disputes/stats");
    return response.data;
  }

  static async getDisputeById(id: string) {
    const response = await api.get(`/admin/disputes/${id}`);
    return response.data;
  }

  static async createDispute(data: DisputeData) {
    const response = await api.post("/admin/disputes", data);
    return response.data;
  }

  static async resolveDispute(id: string, resolution: string) {
    const response = await api.patch(`/admin/disputes/${id}/resolve`, { resolution });
    return response.data;
  }

  static async escalateDispute(id: string, notes?: string) {
    const response = await api.patch(`/admin/disputes/${id}/escalate`, { notes });
    return response.data;
  }

  static async closeDispute(id: string) {
    const response = await api.patch(`/admin/disputes/${id}/close`);
    return response.data;
  }

  static async updatePriority(id: string, priority: "HIGH" | "MEDIUM" | "LOW") {
    const response = await api.patch(`/admin/disputes/${id}/priority`, { priority });
    return response.data;
  }
}