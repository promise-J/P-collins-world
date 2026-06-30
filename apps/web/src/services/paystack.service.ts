import { api } from "../lib/axios";

export interface InitializePaymentOptions {
  amount: number;
  goalId?: string;
  goalType?: 'individual' | 'group';
  goalName?: string;
  purpose?: 'wallet_funding' | 'savings_contribution' | 'order_payment';
  metadata?: Record<string, any>;
}
export interface PaystackInitializeResponse {
  success: boolean;
  data: {
    authorization_url: string;
    reference: string;
    access_code: string;
  };
}

export class PaystackService {
  static async initializePayment(options: InitializePaymentOptions) {
    const { amount, goalId, goalType, goalName, purpose } = options;
    
    const payload: any = {
      amount,
      email: localStorage.getItem('userEmail') || '',
    };

    if (goalId) {
      payload.goalId = goalId;
      payload.goalType = goalType || 'individual';
      payload.goalName = goalName || '';
      payload.purpose = purpose || 'savings_contribution';
    } else {
      payload.purpose = purpose || 'wallet_funding';
    }

    const response = await api.post('/payments/initialize', payload);
    return response.data;
  }

  static async verifyPayment(reference: string) {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  }
}