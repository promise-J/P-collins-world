import { UserRepository } from "./user.repository";

import { ProfileModel } from "../profile/profile.model";

import { ApiError } from "../../utils/apiError";

export class UserService {
  private repo = new UserRepository();

  async getMe(userId: string) {
    const user = await this.repo.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const profile = await ProfileModel.findOne({ userId });

    return { user, profile };
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
}