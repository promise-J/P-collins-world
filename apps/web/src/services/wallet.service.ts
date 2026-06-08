import { api } from "@/lib/axios";


export class WalletService {
  static async getWallet() {
    const response = await api.get("/wallet");
    return response.data;
  }

  static async initializeFunding(amount: number) {
    const response = await api.post("/wallet/fund", { amount });
    return response.data;
  }

  static async verifyFunding(reference: string) {
    const response = await api.get(`/wallet/verify?reference=${reference}`);
    return response.data;
  }

  static async withdraw(amount: number, bankDetails: any) {
    const response = await api.post("/wallet/withdraw", { amount, bankDetails });
    return response.data;
  }

  static async getTransactions(params?: { page?: number; limit?: number }) {
    const response = await api.get("/wallet/transactions", { params });
    return response.data;
  }
}