import { api } from "@/lib/axios";


export class UserService {
  static async getMe() {
    const response = await api.get("/users/me");
    return response.data;
  }

  static async updateProfile(payload: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    bio?: string;
    occupation?: string;
    bankDetails?: {
      bankName: string;
      accountNumber: string;
      accountName: string;
    };
    preferences?: {
      emailNotifications: boolean;
      smsNotifications: boolean;
    };
  }) {
    const response = await api.put("/users/profile", payload);
    return response.data;
  }

  static async updateRole(role: string) {
    const response = await api.patch("/users/role", { role });
    return response.data;
  }

  static async updateUserRole(userId: string, role: string) {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  }
}