import { api } from "@/lib/axios";


export class SavingsService {
  // Personal Savings
  static async createPlan(payload: {
    targetAmount: number;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY";
    autoDebit?: boolean;
    startDate?: Date;
    endDate?: Date;
  }) {
    const response = await api.post("/savings/plan", payload);
    return response.data;
  }

  static async getMyPlans() {
    const response = await api.get("/savings/plan");
    return response.data;
  }

  static async contributeToPlan(planId: string, amount: number, reference?: string) {
    const response = await api.post(`/savings/plan/${planId}/contribute`, { amount, reference });
    return response.data;
  }

  static async breakPlan(planId: string) {
    const response = await api.post(`/savings/plan/${planId}/break`);
    return response.data;
  }

  // Group Savings
  static async createGroup(payload: {
    name: string;
    targetAmount: number;
    contributionAmount: number;
    lockPeriodDays: number;
    goal: {
      title: string;
      description: string;
      targetAmount: number;
      category: string;
    };
  }) {
    const response = await api.post("/savings/group", payload);
    return response.data;
  }

  static async getMyGroups() {
    const response = await api.get("/savings/group");
    return response.data;
  }

  static async getGroupDetails(groupId: string) {
    const response = await api.get(`/savings/group/${groupId}`);
    return response.data;
  }

  static async contributeToGroup(groupId: string, amount: number, reference?: string) {
    const response = await api.post(`/savings/group/${groupId}/contribute`, { amount, reference });
    return response.data;
  }

  static async breakGroup(groupId: string) {
    const response = await api.post(`/savings/group/${groupId}/break`);
    return response.data;
  }
}