import { UserRepository } from "./user.repository";

import { ProfileModel } from "../profile/profile.model";

import { ApiError } from "../../utils/apiError";
import { serviceResponse } from "@/utils/apiResponse";
import bcrypt from "bcryptjs";
import { UploadService } from "../uploads/upload.service";


export class UserService {
  private repo = new UserRepository();
  private uploadService = new UploadService()

  async getMe(userId: string) {
    const user = await this.repo.findById(userId);

    if (!user) {
      return serviceResponse(false, 'User not found')
    }

    const profile = await ProfileModel.findOne({ userId });

    return serviceResponse(true, 'User fetched', { user, profile });
  }

  async updateRole(userId: string, role: string) {
    const user = await this.repo.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.role = role as any;

    await user.save();

    return user;
  }

  async completeProfile(userId: string, data: any) {
    const profile = await ProfileModel.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    );

    await this.repo.updateProfileStatus(userId, true);

    return profile;
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.repo.update(userId, data);
    if (!user) {
      return serviceResponse(false, "User not found");
    }
    return serviceResponse(true, "Profile updated", user);
  }
  
  async updateAvatar(userId: string, file: any) {
    if (!file) {
      return serviceResponse(false, "No file provided", null);
    }
    const result = await this.uploadService.uploadFile(file, "avatars");
    const user = await this.repo.update(userId, { avatar: result.secure_url });
    return serviceResponse(true, "Avatar updated", { avatar: result.secure_url });
  }
  
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      return serviceResponse(false, "User not found");
    }
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return serviceResponse(false, "Current password is incorrect");
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.repo.update(userId, { password: hashedPassword });
    
    return serviceResponse(true, "Password changed successfully");
  }
  
  async updateBankDetails(userId: string, bankDetails: any) {
    const user = await this.repo.update(userId, { bankDetails });
    return serviceResponse(true, "Bank details updated", user);
  }
}