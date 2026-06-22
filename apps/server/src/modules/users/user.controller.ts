import { Request, Response } from "express";

import { UserService } from "./user.service";

import { apiResponse } from "../../utils/apiResponse";
import { ProfileModel } from "../profile/profile.model";

export class UserController {
  private service = new UserService();

  getMe = async (req: any, res: Response) => {
    
    if(!req.user){
      return apiResponse(res, false, 'User not found')
    }
    return apiResponse(res, true, 'User found', req.user);
  };

  updateRole = async (req: any, res: Response) => {
    const user = await this.service.updateRole(
      req.user._id,
      req.body.role
    );

    return apiResponse(res, true, "Role updated", user);
  };

  completeProfile = async (req: any, res: Response) => {
    const profile = await this.service.completeProfile(
      req.user._id,
      req.body
    );

    return apiResponse(res, true, "Profile updated", profile);
  };

  updateProfile = async (req: any, res: Response) => {
    const result = await this.service.updateProfile(req.user._id, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };
  
  updateAvatar = async (req: any, res: Response) => {
    const result = await this.service.updateAvatar(req.user._id, req.file);
    return apiResponse(res, result.success, result.message, result.data);
  };
  
  changePassword = async (req: any, res: Response) => {
    const result = await this.service.changePassword(
      req.user._id,
      req.body.currentPassword,
      req.body.newPassword
    );
    return apiResponse(res, result.success, result.message);
  };
  
  updateBankDetails = async (req: any, res: Response) => {
    const result = await this.service.updateBankDetails(req.user._id, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };
}