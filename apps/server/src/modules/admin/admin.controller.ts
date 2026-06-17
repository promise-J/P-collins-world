import { Request, Response } from "express";

import { AdminService } from "./admin.service";
import { apiResponse } from "../../utils/apiResponse";
import { UserModel } from "../users/user.model";

export class AdminController {
  private service = new AdminService();

  login = async (req: Request, res: Response) => {
    const result = await this.service.login(req.body.email, req.body.password);

    if (!result.success) {
      return apiResponse(res, false, result.message);
    }

    const refreshToken = result.data?.refreshToken;
    const accessToken = result.data?.accessToken;

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return apiResponse(res, true, "Login successful", result.data?.user);
  };

  dashboardMetrics = async (req: Request, res: Response) => {
    const kyc = await this.service.dashboardMetrics();

    return apiResponse(res, true, "Dashboard metrics fetched", kyc);
  };

  getUsers = async (req: Request, res: Response) => {
    const kyc = await this.service.getUsers(req.query);

    return apiResponse(res, true, "KYC reviewed", kyc);
  };
  pendingKyc = async (req: Request, res: Response) => {
    const kyc = await this.service.pendingKyc();

    return apiResponse(res, true, "KYC reviewed", kyc);
  };
  monthlyRevenue = async (req: Request, res: Response) => {
    const kyc = await this.service.monthlyRevenue();

    return apiResponse(res, true, "KYC reviewed", kyc);
  };
  topProducts = async (req: Request, res: Response) => {
    const kyc = await this.service.topProducts();

    return apiResponse(res, true, "KYC reviewed", kyc);
  };
  totalSavings = async (req: Request, res: Response) => {
    const kyc = await this.service.totalSavings();

    return apiResponse(res, true, "KYC reviewed", kyc);
  };
  updateUserRole = async (req: any, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;
    
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    
    if (!user) {
      return apiResponse(res, false, "User not found");
    }
    
    return apiResponse(res, true, "Role updated successfully", user);
  };
}