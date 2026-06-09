import { Request, Response } from "express";

import { UserService } from "./user.service";

import { apiResponse } from "../../utils/apiResponse";

export class UserController {
  private service = new UserService();

  getMe = async (req: any, res: Response) => {
    const data = await this.service.getMe(req.user.userId);

    return apiResponse(res, true, "User profile fetched", data);
  };

  updateRole = async (req: any, res: Response) => {
    const user = await this.service.updateRole(
      req.user.userId,
      req.body.role
    );

    return apiResponse(res, true, "Role updated", user);
  };

  completeProfile = async (req: any, res: Response) => {
    const profile = await this.service.completeProfile(
      req.user.userId,
      req.body
    );

    return apiResponse(res, true, "Profile updated", profile);
  };
}