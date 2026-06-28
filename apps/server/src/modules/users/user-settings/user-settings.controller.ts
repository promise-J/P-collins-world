import { Request, Response } from "express";
import { UserSettingsService } from "./user-settings.service";
import { apiResponse } from "../../../utils/apiResponse";

export class UserSettingsController {
  private service = new UserSettingsService();

  getSettings = async (req: any, res: Response) => {
    const result = await this.service.getAllSettings(req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  updateProfile = async (req: any, res: Response) => {
    const result = await this.service.updateProfile(req.user._id, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  updateNotifications = async (req: any, res: Response) => {
    const result = await this.service.updateNotifications(req.user._id, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  updateAppearance = async (req: any, res: Response) => {
    const result = await this.service.updateAppearance(req.user._id, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  changePassword = async (req: any, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const result = await this.service.changePassword(req.user._id, currentPassword, newPassword);
    return apiResponse(res, result.success, result.message);
  };
}