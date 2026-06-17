import { UserSettingsModel } from "./user-settings.model";
import { UserModel } from "../user.model";
import { serviceResponse } from "../../../utils/apiResponse";
import bcrypt from "bcryptjs";

export class UserSettingsService {
  // Get or create user settings
  async getOrCreateSettings(userId: string) {
    let settings = await UserSettingsModel.findOne({ userId });
    
    if (!settings) {
      const user = await UserModel.findById(userId);
      settings = await UserSettingsModel.create({
        userId,
        profile: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          phone: user?.phone,
        },
      });
    }
    
    return settings;
  }

  // Update profile settings
  async updateProfile(userId: string, data: any) {
    const settings = await this.getOrCreateSettings(userId);
    
    settings.profile = {
      ...settings.profile,
      ...data,
    };
    
    // Also update main user model for firstName, lastName, phone
    if (data.firstName || data.lastName || data.phone) {
      await UserModel.findByIdAndUpdate(userId, {
        firstName: data.firstName || settings?.profile?.firstName,
        lastName: data.lastName || settings?.profile?.lastName,
        phone: data.phone || settings?.profile?.phone,
      });
    }
    
    await settings.save();
    return serviceResponse(true, "Profile updated successfully", settings);
  }

  // Update notification settings
  async updateNotifications(userId: string, data: any) {
    const settings = await this.getOrCreateSettings(userId);
    
    settings.notifications = {
      ...settings.notifications,
      ...data,
    };
    
    await settings.save();
    return serviceResponse(true, "Notification settings updated", settings.notifications);
  }

  // Update appearance settings
  async updateAppearance(userId: string, data: any) {
    const settings = await this.getOrCreateSettings(userId);
    
    settings.appearance = {
      ...settings.appearance,
      ...data,
    };
    
    await settings.save();
    return serviceResponse(true, "Appearance settings updated", settings.appearance);
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return serviceResponse(false, "User not found");
    }
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return serviceResponse(false, "Current password is incorrect");
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    

    const settings = await this.getOrCreateSettings(userId);
    if (settings) {
      settings.security = settings.security || {
        twoFactorEnabled: false,
        loginAlerts: true
      };
      
      settings.security.lastPasswordChange = new Date();
      await settings.save();
    }    
    
    return serviceResponse(true, "Password changed successfully");
  }

  // Get all settings
  async getAllSettings(userId: string) {
    const settings = await this.getOrCreateSettings(userId);
    const user = await UserModel.findById(userId).select("-password -refreshToken");
    
    return serviceResponse(true, "Settings retrieved", {
      user,
      settings,
    });
  }
}