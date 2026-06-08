import { Response } from "express";
import { InspectionService } from "./inspection.service";
import { apiResponse } from "../../utils/apiResponse";

export class InspectionController {
  private service = new InspectionService();

  bookInspection = async (req: any, res: Response) => {
    const inspection = await this.service.bookInspection(
      req.user.userId,
      req.params.propertyId,
      new Date(req.body.scheduledDate),
      req.body.message
    );
    return apiResponse(res, true, "Inspection booked successfully", inspection);
  };

  updateStatus = async (req: any, res: Response) => {
    const inspection = await this.service.updateStatus(
      req.params.id,
      req.body.status,
      req.body.adminNotes
    );
    return apiResponse(res, true, "Inspection updated", inspection);
  };

  getMyInspections = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const inspections = await this.service.getUserInspections(req.user.userId, page, limit);
    return apiResponse(res, true, "Inspections fetched", inspections);
  };

  getPropertyInspections = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const inspections = await this.service.getPropertyInspections(req.params.propertyId, page, limit);
    return apiResponse(res, true, "Inspections fetched", inspections);
  };

  cancelInspection = async (req: any, res: Response) => {
    const inspection = await this.service.cancelInspection(req.params.id, req.user.userId);
    return apiResponse(res, true, "Inspection cancelled", inspection);
  };
}