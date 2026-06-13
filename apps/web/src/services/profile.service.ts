import { api } from "../lib/axios";

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  occupation?: string;
  avatar?: File | string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
}

export class ProfileService {
  static async getProfile() {
    const response = await api.get("/users/me");
    return response.data;
  }

  static async updateProfile(data: ProfileData) {
    const response = await api.put("/users/profile", data);
    return response.data;
  }

  static async updateAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async updatePassword(currentPassword: string, newPassword: string) {
    const response = await api.post("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  static async updateBankDetails(bankDetails: ProfileData['bankDetails']) {
    const response = await api.put("/users/bank-details", bankDetails);
    return response.data;
  }
}