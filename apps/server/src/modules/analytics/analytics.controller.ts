import { Response } from "express";
import { AnalyticsService } from "./analytics.service";
import { apiResponse } from "../../utils/apiResponse";

export class AnalyticsController {
  private service = new AnalyticsService();

  getPlatformMetrics = async (req: any, res: Response) => {
    const result = await this.service.getPlatformMetrics();
    return apiResponse(res, result.success, result.message, result.data);
  };

  getRevenueAnalytics = async (req: any, res: Response) => {
    const { startDate, endDate } = req.query;
    const result = await this.service.getRevenueAnalytics(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    return apiResponse(res, result.success, result.message, result.data);

  };

  getProductAnalytics = async (req: any, res: Response) => {
    const result = await this.service.getProductAnalytics();

    return apiResponse(res, result.success, result.message, result.data);
  };

  getUserAnalytics = async (req: any, res: Response) => {
    const result = await this.service.getUserAnalytics();
    return apiResponse(res, result.success, result.message, result.data);
  };

  getPropertyAnalytics = async (req: any, res: Response) => {
    const result = await this.service.getPropertyAnalytics();
    return apiResponse(res, result.success, result.message, result.data);
  };

  getSavingsAnalytics = async (req: any, res: Response) => {
    const result = await this.service.getSavingsAnalytics();
    return apiResponse(res, result.success, result.message, result.data);
  };
}