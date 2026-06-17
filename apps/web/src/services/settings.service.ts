import { api } from "../lib/axios";

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  currency?: string;
  language?: string;
}

export interface NotificationSettings {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
  savingsAlerts?: boolean;
  propertyAlerts?: boolean;
  orderUpdates?: boolean;
  groupChatNotifications?: boolean;
}

export interface AppearanceSettings {
  theme?: "light" | "dark" | "system";
  reducedAnimations?: boolean;
  compactView?: boolean;
}

export class SettingsService {
  static async getSettings() {
    const response = await api.get("/settings");
    return response.data;
  }

  static async updateProfile(data: ProfileData) {
    const response = await api.put("/settings/profile", data);
    return response.data;
  }

  static async updateNotifications(data: NotificationSettings) {
    const response = await api.put("/settings/notifications", data);
    return response.data;
  }

  static async updateAppearance(data: AppearanceSettings) {
    const response = await api.put("/settings/appearance", data);
    return response.data;
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.post("/settings/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  }
}