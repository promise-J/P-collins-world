import { api } from "@/lib/axios";


export class CouponService {
  static async validateCoupon(code: string, orderAmount: number) {
    const response = await api.post("/coupons/validate", { code, orderAmount });
    return response.data;
  }

  static async getAllCoupons(params?: { page?: number; limit?: number }) {
    const response = await api.get("/coupons", { params });
    return response.data;
  }

  static async createCoupon(payload: {
    code: string;
    type: "FIXED" | "PERCENTAGE";
    value: number;
    minOrderAmount?: number;
    maxUsage?: number;
    expiresAt?: Date;
  }) {
    const response = await api.post("/coupons", payload);
    return response.data;
  }

  static async updateCoupon(id: string, payload: any) {
    const response = await api.patch(`/coupons/${id}`, payload);
    return response.data;
  }

  static async deleteCoupon(id: string) {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  }
}