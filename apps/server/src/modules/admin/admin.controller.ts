import { Request, Response } from "express";

import { AdminService } from "./admin.service";
import { apiResponse } from "../../utils/apiResponse";

export class AdminController {
  private service = new AdminService();

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
}