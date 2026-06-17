import { Request, Response } from "express";
import { UserSettingsService } from "./user-settings.service";
import { apiResponse } from "../../../utils/apiResponse";

export class UserSettingsController {
  private service = new UserSettingsService();

  getSettings = async (req: any, res: Response) => {
    const result = await this.service.getAllSettings(req.user.userId);
    return apiResponse(res, result.success, result.message, result.data);
  };

  updateProfile = async (req: any, res: Response) => {
    const result = await this.service.updateProfile(req.user.userId, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  updateNotifications = async (req: any, res: Response) => {
    const result = await this.service.updateNotifications(req.user.userId, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  updateAppearance = async (req: any, res: Response) => {
    const result = await this.service.updateAppearance(req.user.userId, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  changePassword = async (req: any, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const result = await this.service.changePassword(req.user.userId, currentPassword, newPassword);
    return apiResponse(res, result.success, result.message);
  };
}