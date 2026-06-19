import { Request, Response } from "express";

import { apiResponse } from "../../utils/apiResponse";
import { SavingsService } from "./saving.service";

export class SavingsController {
  private service = new SavingsService();

  // PERSONAL PLAN
  createPlan = async (req: any, res: Response) => {
    const result = await this.service.createPlan(
      req.user._id,
      req.body
    );

    return apiResponse(res, result.success, result.message, result.data);
  };

  getMyPlans = async (req: Request, res: Response) => {
    const result = await this.service.getUserPlans(req?.user?._id.toString() ?? "");

    return apiResponse(res, result.success, result.message, result.data);

  };

  contributeToPlan = async (req: any, res: Response) => {
    const result = await this.service.contributeToPlan(
      req.user._id,
      req.params.id,
      req.body.amount,
      req.body.reference
    );

    return apiResponse(res, result.success, result.message, result.data);
  };

  // GROUP
  createGroup = async (req: any, res: Response) => {
    const result = await this.service.createGroup(req.user._id, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  getMyGroups = async (req: any, res: Response) => {
    const result = await this.service.getUserGroups(req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  getAllGroups = async (req: any, res: Response) => {
    const result = await this.service.getAllPublicGroups(req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  getGroupDetails = async (req: any, res: Response) => {
    const result = await this.service.getGroupDetails(req.params.id, req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  joinGroup = async (req: any, res: Response) => {
    const result = await this.service.joinGroup(req.params.id, req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  leaveGroup = async (req: any, res: Response) => {
    const result = await this.service.leaveGroup(req.params.id, req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  contributeToGroup = async (req: any, res: Response) => {
    const result = await this.service.contributeToGroup(
      req.user._id,
      req.params.id,
      req.body.amount,
      req.body.reference || `GROUP_CONTRIB_${Date.now()}`
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  breakGroupSavings = async (req: any, res: Response) => {
    const result = await this.service.breakGroupSavings(req.user._id, req.params.id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  deleteGroup = async (req: any, res: Response) => {
    const result = await this.service.deleteGroup(req.params.id, req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  updateGroup = async (req: any, res: Response) => {
    const result = await this.service.updateGroup(req.params.id, req.user._id, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  // BREAK SYSTEM
  breakSavingsPlan = async (req: any, res: Response) => {
    const result = await this.service.breakSavingsPlan(
      req.user._id,
      req.params.id
    );

    return apiResponse(res, result.success, result.message, result.data);
  };
}