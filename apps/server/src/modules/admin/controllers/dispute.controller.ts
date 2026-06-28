import { Response } from "express";
import { DisputeService } from "../services/dispute.service";
import { apiResponse } from "@/utils/apiResponse";


const disputeService = new DisputeService();

export class DisputeController {
  getDisputes = async (req: any, res: Response) => {
    try {
      const result = await disputeService.getDisputes(req.query);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch disputes");
    }
  };

  getDisputeById = async (req: any, res: Response) => {
    try {
      const result = await disputeService.getDisputeById(req.params.id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch dispute");
    }
  };

  createDispute = async (req: any, res: Response) => {
    try {
      const result = await disputeService.createDispute(req.body);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to create dispute");
    }
  };

  resolveDispute = async (req: any, res: Response) => {
    try {
      const { resolution } = req.body;
      const result = await disputeService.resolveDispute(
        req.params.id,
        resolution,
        req.user._id
      );
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to resolve dispute");
    }
  };

  escalateDispute = async (req: any, res: Response) => {
    try {
      const { notes } = req.body;
      const result = await disputeService.escalateDispute(
        req.params.id,
        notes,
        req.user._id
      );
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to escalate dispute");
    }
  };

  closeDispute = async (req: any, res: Response) => {
    try {
      const result = await disputeService.closeDispute(req.params.id, req.user._id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to close dispute");
    }
  };

  getDisputeStats = async (req: any, res: Response) => {
    try {
      const result = await disputeService.getDisputeStats();
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch dispute stats");
    }
  };

  updateDisputePriority = async (req: any, res: Response) => {
    try {
      const { priority } = req.body;
      const result = await disputeService.updateDisputePriority(
        req.params.id,
        priority,
        req.user._id
      );
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to update dispute priority");
    }
  };
}