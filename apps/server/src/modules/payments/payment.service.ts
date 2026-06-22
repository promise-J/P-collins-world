import axios from "axios";
import crypto from "crypto";
import { env } from "../../config/env";
import { serviceResponse } from "@/utils/apiResponse";

export class PaymentService {
  private paystackSecretKey: string;
  private paystackBaseUrl: string;

  constructor() {
    this.paystackSecretKey = env.PAYSTACK_SECRET_KEY;
    this.paystackBaseUrl = "https://api.paystack.co";
  }

  async initializePayment(email: string, amount: number, metadata?: any) {
    try {
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100), // Convert to kobo
          metadata,
          callback_url: `${env.WEB_URL}/payment/verify`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return serviceResponse(true, 'Payment initialized', {
          authorization_url: response.data.data.authorization_url,
          reference: response.data.data.reference,
          access_code: response.data.data.access_code,
        })
    } catch (error: any) {
      console.error("Paystack initialization error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to initialize payment",
      };
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        }
      );

      const data = response.data.data;
      return serviceResponse(true, 'Payment verified', {
          status: data.status,
          reference: data.reference,
          amount: data.amount / 100, // Convert back from kobo
          metadata: data.metadata,
          customer: data.customer,
          paidAt: data.paid_at,
        })
    } catch (error: any) {
      console.error("Paystack verification error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to verify payment",
      };
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const hash = crypto
        .createHmac("sha512", this.paystackSecretKey)
        .update(payload)
        .digest("hex");
      return hash === signature;
    } catch (error) {
      console.error("Webhook signature verification error:", error);
      return false;
    }
  }
}