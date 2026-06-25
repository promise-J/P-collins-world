import { UserModel } from "@/modules/users/user.model";
import { apiResponse } from "@/utils/apiResponse";
import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";


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
    const result = await this.service.dashboardMetrics();


    return apiResponse(res, result.success, result.message, result.data);
  };

  getUsers = async (req: Request, res: Response) => {
    const result = await this.service.getUsers(req.query);

    return apiResponse(res, result.success, result.message, result.data);
  };
  pendingKyc = async (req: Request, res: Response) => {
    const result = await this.service.pendingKyc();

    return apiResponse(res, result.success, result.message, result.data);
  };
  monthlyRevenue = async (req: Request, res: Response) => {
    const result = await this.service.monthlyRevenue();

    return apiResponse(res, result.success, result.message, result.data);
  };
  topProducts = async (req: Request, res: Response) => {
    const result = await this.service.topProducts();

    return apiResponse(res, result.success, result.message, result.data);
  };
  totalSavings = async (req: Request, res: Response) => {
    const result = await this.service.totalSavings();

    return apiResponse(res, result.success, result.message, result.data);
  };
  updateUserRole = async (req: any, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;
    
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    return apiResponse(res, true, 'User role updated successfully');
    
  };
}