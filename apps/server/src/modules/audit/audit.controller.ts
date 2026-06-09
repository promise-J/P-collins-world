import { Response } from "express";
import { AuditService } from "./audit.service";
import { apiResponse } from "../../utils/apiResponse";

export class AuditController {
  private service = new AuditService();

  getAuditLogs = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const logs = await this.service.getAuditLogs(req.query, page, limit);
    return apiResponse(res, true, "Audit logs fetched", logs);
  };

  getUserAuditLogs = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const logs = await this.service.getUserAuditLogs(req.params.userId, page, limit);
    return apiResponse(res, true, "User audit logs fetched", logs);
  };
}