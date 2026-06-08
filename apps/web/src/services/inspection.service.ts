import { api } from "@/lib/axios";

export class InspectionService {
  static async bookInspection(propertyId: string, payload: { scheduledDate: Date; message?: string }) {
    const response = await api.post(`/inspections/${propertyId}/book`, payload);
    return response.data;
  }

  static async getMyInspections(params?: { page?: number; limit?: number }) {
    const response = await api.get("/inspections/my", { params });
    return response.data;
  }

  static async getPropertyInspections(propertyId: string, params?: { page?: number; limit?: number }) {
    const response = await api.get(`/inspections/property/${propertyId}`, { params });
    return response.data;
  }

  static async cancelInspection(inspectionId: string) {
    const response = await api.post(`/inspections/${inspectionId}/cancel`);
    return response.data;
  }

  static async updateInspectionStatus(inspectionId: string, payload: { status: string; adminNotes?: string }) {
    const response = await api.patch(`/inspections/${inspectionId}/status`, payload);
    return response.data;
  }
}