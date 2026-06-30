import { api } from "../lib/axios";

export interface Transaction {
  _id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  reference: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  metadata?: any;
  createdAt: string;
}

export interface WalletData {
  balance: number;
  pendingBalance: number;
  transactions: Transaction[];
}

export class WalletService {
  static async getWallet() {
    const response = await api.get("/wallet");
    return response.data;
  }

  static async fundWallet(amount: number) {
    const response = await api.post("/wallet/fund", { amount });
    return response.data;
  }

  static async verifyFunding(reference: string) {
    const response = await api.get(`/wallet/verify?reference=${reference}`);
    return response.data;
  }

  static async withdraw(amount: number, bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) {
    const response = await api.post("/wallet/withdraw", { amount, bankDetails });
    return response.data;
  }

  static async initializeFunding(amount: number) {
    const response = await api.post('/wallet/fund', { amount });
    return response.data;
  }

  static async getTransactions(params: { limit: number, page?: number }) {
    const { limit, page } = params; // Destructure params
    const response = await api.get(`/wallet/transactions?page=${page}&limit=${limit}`);
    return response.data;
  }
}