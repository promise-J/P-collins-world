import { Response } from "express";
import { InspectionService } from "./inspection.service";
import { apiResponse } from "../../utils/apiResponse";

export class InspectionController {
  private service = new InspectionService();

  bookInspection = async (req: any, res: Response) => {
    const result = await this.service.bookInspection(
      req.user._id,
      req.params.propertyId,
      new Date(req.body.scheduledDate),
      req.body.message
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  updateStatus = async (req: any, res: Response) => {
    const result = await this.service.updateStatus(
      req.params.id,
      req.body.status,
      req.body.adminNotes
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  getMyInspections = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await this.service.getUserInspections(req.user._id, page, limit);
    return apiResponse(res, result.success, result.message, result.data);

  };

  getPropertyInspections = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await this.service.getPropertyInspections(req.params.propertyId, page, limit);
    return apiResponse(res, result.success, result.message, result.data);
  };

  cancelInspection = async (req: any, res: Response) => {
    const result = await this.service.cancelInspection(req.params.id, req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };
}