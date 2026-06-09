import { Request, Response } from "express";

import { apiResponse } from "../../utils/apiResponse";
import { SavingsService } from "./saving.service";

export class SavingsController {
  private service = new SavingsService();

  // PERSONAL PLAN
  createPlan = async (req: any, res: Response) => {
    const plan = await this.service.createPlan(
      req.user.userId,
      req.body
    );

    return apiResponse(res, true, "Savings plan created", plan);
  };

  getMyPlans = async (req: Request, res: Response) => {
    const plans = await this.service.getUserPlans(req?.user?.id ?? "");

    return apiResponse(res, true, "Plans fetched", plans);
  };

  contributeToPlan = async (req: any, res: Response) => {
    const result = await this.service.contributeToPlan(
      req.user.userId,
      req.params.id,
      req.body.amount,
      req.body.reference
    );

    return apiResponse(res, true, "Contribution successful", result);
  };

  // GROUP
  createGroup = async (req: any, res: Response) => {
    const group = await this.service.createGroup(
      req.user.userId,
      req.body
    );

    return apiResponse(res, true, "Group created", group);
  };

  getMyGroups = async (req: any, res: Response) => {
    const groups = await this.service.getUserGroups(req.user.userId);

    return apiResponse(res, true, "Groups fetched", groups);
  };

  contributeToGroup = async (req: any, res: Response) => {
    const result = await this.service.contributeToGroup(
      req.user.userId,
      req.params.id,
      req.body.amount,
      req.body.reference
    );

    return apiResponse(res, true, "Group contribution successful", result);
  };

  // BREAK SYSTEM
  breakSavingsPlan = async (req: any, res: Response) => {
    const result = await this.service.breakSavingsPlan(
      req.user.userId,
      req.params.id
    );

    return apiResponse(res, true, "Savings broken", result);
  };

  breakGroupSavings = async (req: any, res: Response) => {
    const result = await this.service.breakGroupSavings(
      req.user.userId,
      req.params.id
    );

    return apiResponse(res, true, "Group savings broken", result);
  };
}