import { api } from "../lib/axios";

export interface PaystackInitializeResponse {
  success: boolean;
  data: {
    authorization_url: string;
    reference: string;
    access_code: string;
  };
}

export class PaystackService {
  static async initializePayment(email: string, amount: number, metadata?: any) {
    const response = await api.post("/payments/initialize", {
      email,
      amount,
      metadata,
    });
    return response.data;
  }

  static async verifyPayment(reference: string) {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  }
}