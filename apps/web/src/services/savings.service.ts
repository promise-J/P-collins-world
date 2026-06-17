import { api } from "@/lib/axios";

export interface PersonalPlanData {
  targetAmount: number;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  autoDebit?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface GroupData {
  name: string;
  targetAmount: number;
  contributionAmount: number;
  lockPeriodDays: number;
  goal: {
    title: string;
    description: string;
    targetAmount: number;
    category: "FOOD" | "GADGET" | "RENT" | "BUSINESS" | "OTHER";
  };
  penaltiesEnabled?: boolean;
}

export interface ContributionData {
  amount: number;
  reference?: string;
}


export class SavingsService {
  // Personal Savings
  static async createPlan(payload: PersonalPlanData) {
    const response = await api.post("/savings/plan", payload);
    return response.data;
  }

  static async getMyPlans() {
    const response = await api.get("/savings/plan");
    return response.data;
  }

  static async getPlanDetails(planId: string) {
    const response = await api.get(`/savings/plan/${planId}`);
    return response.data;
  }

  static async contributeToPlan(planId: string, data: ContributionData) {
    const response = await api.post(`/savings/plan/${planId}/contribute`, data);
    return response.data;
  }

  static async breakPlan(planId: string) {
    const response = await api.post(`/savings/plan/${planId}/break`);
    return response.data;
  }

  // Group Savings
  static async createGroup(data: GroupData) {
    const response = await api.post("/savings/group", data);
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


  static async joinGroup(groupId: string) {
    const response = await api.post(`/savings/group/${groupId}/join`);
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

  static async getDummyPlans() {
    return {
      success: true,
      data: dummyPersonalPlans,
      total: dummyPersonalPlans.length,
    };
  }

  static async getDummyGroups() {
    return {
      success: true,
      data: dummyGroups,
      total: dummyGroups.length,
    };
  }
}


export const dummyPersonalPlans = [
  {
    _id: "plan1",
    targetAmount: 500000,
    currentAmount: 125000,
    frequency: "MONTHLY",
    autoDebit: true,
    isCompleted: false,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    progress: 25,
    createdAt: new Date("2024-01-01"),
  },
  {
    _id: "plan2",
    targetAmount: 200000,
    currentAmount: 200000,
    frequency: "WEEKLY",
    autoDebit: false,
    isCompleted: true,
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-12-31"),
    progress: 100,
    createdAt: new Date("2023-06-01"),
  },
  {
    _id: "plan3",
    targetAmount: 1000000,
    currentAmount: 350000,
    frequency: "DAILY",
    autoDebit: true,
    isCompleted: false,
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-08-15"),
    progress: 35,
    createdAt: new Date("2024-02-15"),
  },
];

// Dummy Group Savings
export const dummyGroups = [
  {
    _id: "group1",
    name: "Christmas Rice Fund",
    ownerId: {
      _id: "user1",
      firstName: "John",
      lastName: "Doe",
    },
    members: [
      { userId: { _id: "user1", firstName: "John", lastName: "Doe" }, role: "OWNER" },
      { userId: { _id: "user2", firstName: "Jane", lastName: "Smith" }, role: "MEMBER" },
      { userId: { _id: "user3", firstName: "Mike", lastName: "Johnson" }, role: "MEMBER" },
    ],
    targetAmount: 500000,
    contributionAmount: 25000,
    currentAmount: 250000,
    lockPeriodDays: 30,
    isLocked: false,
    goal: {
      title: "Christmas Rice",
      description: "Save to buy rice for Christmas celebration",
      targetAmount: 500000,
      category: "FOOD",
    },
    penaltiesEnabled: true,
    progress: 50,
    createdAt: new Date("2024-05-01"),
  },
  {
    _id: "group2",
    name: "Gadget Fund",
    ownerId: {
      _id: "user4",
      firstName: "Alice",
      lastName: "Brown",
    },
    members: [
      { userId: { _id: "user4", firstName: "Alice", lastName: "Brown" }, role: "OWNER" },
      { userId: { _id: "user5", firstName: "Bob", lastName: "Wilson" }, role: "TREASURER" },
      { userId: { _id: "user6", firstName: "Carol", lastName: "Davis" }, role: "MEMBER" },
      { userId: { _id: "user7", firstName: "David", lastName: "Miller" }, role: "MEMBER" },
    ],
    targetAmount: 1200000,
    contributionAmount: 50000,
    currentAmount: 600000,
    lockPeriodDays: 60,
    isLocked: true,
    goal: {
      title: "New Laptops",
      description: "Save to buy new laptops for team members",
      targetAmount: 1200000,
      category: "GADGET",
    },
    penaltiesEnabled: true,
    progress: 50,
    createdAt: new Date("2024-04-15"),
  },
];