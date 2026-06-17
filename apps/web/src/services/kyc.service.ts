import { api } from "@/lib/axios";


export class KYCService {
  static async submitKyc(payload: FormData) {
    const response = await api.post("/kyc/submit", payload, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data;
  }
  static async getMyKyc() {
    const response = await api.get("/kyc/me");
    return response.data;
  }

  static async getPendingKyc(params?: { page?: number; limit?: number }) {
    const response = await api.get("/admin/analytics/pending-kyc", { params });
    return response.data;
  }

  static async review(kycId: string, payload: { status: string; reason?: string }) {
    const response = await api.patch(`/kyc/${kycId}/review`, payload);
    return response.data;
  }
}