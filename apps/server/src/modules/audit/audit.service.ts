import { serviceResponse } from "@/utils/apiResponse";
import { AuditLogModel } from "./audit-log.model";

export class AuditService {
  async log(data: {
    userId?: string;
    action: string;
    module: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return AuditLogModel.create(data);
  }

  async getAuditLogs(filter: any, page: number = 1, limit: number = 50) {
    const query: any = {};
    
    if (filter.userId) query.userId = filter.userId;
    if (filter.module) query.module = filter.module;
    if (filter.action) query.action = { $regex: filter.action, $options: "i" };
    if (filter.startDate || filter.endDate) {
      query.createdAt = {};
      if (filter.startDate) query.createdAt.$gte = new Date(filter.startDate);
      if (filter.endDate) query.createdAt.$lte = new Date(filter.endDate);
    }

    const logs = await AuditLogModel.find(query)
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await AuditLogModel.countDocuments(query);

    return serviceResponse(true, 'Audit logs', {
      data: logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  }

  async getUserAuditLogs(userId: string, page: number = 1, limit: number = 20) {
    const result = await this.getAuditLogs({ userId }, page, limit);
    return serviceResponse(true, 'User audit', result)
  }

  async getModuleAuditLogs(module: string, page: number = 1, limit: number = 50) {
    const result = await this.getAuditLogs({ module }, page, limit);
    return serviceResponse(true, 'Module audit', result)
  }
}