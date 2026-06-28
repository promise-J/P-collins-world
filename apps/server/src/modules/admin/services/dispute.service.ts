import { NotificationService } from "@/modules/notifications/notification.service";
import { DisputeModel, DisputeStatus, DisputePriority, DisputeType } from "../models/dispute.model"
import { serviceResponse } from "@/utils/apiResponse";
import { UserModel } from "@/modules/users/user.model";
import { OrderModel } from "@/modules/market/orders/order.model";
import { PropertyModel } from "@/modules/properties/property.model";

const notificationService = new NotificationService();

export class DisputeService {
  async getDisputes(filters: any) {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      type,
      search,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "customer.firstName": { $regex: search, $options: "i" } },
        { "customer.lastName": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const disputes = await DisputeModel.find(query)
      .populate("customer.userId", "firstName lastName email phone")
      .populate("orderId", "orderNumber totalAmount status")
      .populate("propertyId", "title price location")
      .populate("resolvedBy", "firstName lastName email")
      .populate("escalatedBy", "firstName lastName email")
      .populate("closedBy", "firstName lastName email")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await DisputeModel.countDocuments(query);

    return serviceResponse(true, "Disputes fetched", {
      data: disputes,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  }

  async getDisputeById(disputeId: string) {
    const dispute = await DisputeModel.findById(disputeId)
      .populate("customer.userId", "firstName lastName email phone")
      .populate("orderId", "orderNumber totalAmount status")
      .populate("propertyId", "title price location")
      .populate("resolvedBy", "firstName lastName email")
      .populate("escalatedBy", "firstName lastName email")
      .populate("closedBy", "firstName lastName email");

    if (!dispute) {
      return serviceResponse(false, "Dispute not found");
    }

    return serviceResponse(true, "Dispute fetched", dispute);
  }

  async createDispute(data: any) {
    try {
      // Validate customer exists
      const customer = await UserModel.findById(data.customer.userId);
      if (!customer) {
        return serviceResponse(false, "Customer not found");
      }

      // If orderId is provided, validate order exists
      if (data.orderId) {
        const order = await OrderModel.findById(data.orderId);
        if (!order) {
          return serviceResponse(false, "Order not found");
        }
      }

      // If propertyId is provided, validate property exists
      if (data.propertyId) {
        const property = await PropertyModel.findById(data.propertyId);
        if (!property) {
          return serviceResponse(false, "Property not found");
        }
      }

      const dispute = await DisputeModel.create({
        ...data,
        customer: {
          userId: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
      });

      return serviceResponse(true, "Dispute created successfully", dispute);
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to create dispute");
    }
  }

  async resolveDispute(disputeId: string, resolution: string, adminId: string) {
    const dispute = await DisputeModel.findById(disputeId);
    if (!dispute) {
      return serviceResponse(false, "Dispute not found");
    }

    if (dispute.status === DisputeStatus.RESOLVED) {
      return serviceResponse(false, "Dispute already resolved");
    }

    dispute.status = DisputeStatus.RESOLVED;
    dispute.resolution = resolution;
    dispute.resolvedBy = adminId as any;
    dispute.resolvedAt = new Date();
    await dispute.save();

    // Notify customer
    await notificationService.create({
      userId: dispute?.customer?.userId.toString() ?? "",
      title: "Dispute Resolved",
      message: `Your dispute "${dispute.title}" has been resolved.`
  });

    return serviceResponse(true, "Dispute resolved successfully", dispute);
  }

  async escalateDispute(disputeId: string, notes: string, adminId: string) {
    const dispute = await DisputeModel.findById(disputeId);
    if (!dispute) {
      return serviceResponse(false, "Dispute not found");
    }

    if (dispute.status === DisputeStatus.RESOLVED || dispute.status === DisputeStatus.CLOSED) {
      return serviceResponse(false, `Cannot escalate a ${dispute.status} dispute`);
    }

    dispute.status = DisputeStatus.IN_REVIEW;
    dispute.adminNotes = notes || dispute.adminNotes;
    dispute.escalatedBy = adminId as any;
    dispute.escalatedAt = new Date();
    await dispute.save();

    return serviceResponse(true, "Dispute escalated successfully", dispute);
  }

  async closeDispute(disputeId: string, adminId: string) {
    const dispute = await DisputeModel.findById(disputeId);
    if (!dispute) {
      return serviceResponse(false, "Dispute not found");
    }

    if (dispute.status !== DisputeStatus.RESOLVED) {
      return serviceResponse(false, "Only resolved disputes can be closed");
    }

    dispute.status = DisputeStatus.CLOSED;
    dispute.closedBy = adminId as any;
    dispute.closedAt = new Date();
    await dispute.save();

    return serviceResponse(true, "Dispute closed successfully", dispute);
  }

  async getDisputeStats() {
    const stats = await DisputeModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await DisputeModel.countDocuments();

    return serviceResponse(true, "Dispute stats fetched", {
      byStatus: stats,
      total,
    });
  }

  async updateDisputePriority(disputeId: string, priority: DisputePriority, adminId: string) {
    const dispute = await DisputeModel.findById(disputeId);
    if (!dispute) {
      return serviceResponse(false, "Dispute not found");
    }

    dispute.priority = priority;
    dispute.adminNotes = `Priority updated to ${priority} by admin`;
    await dispute.save();

    return serviceResponse(true, "Dispute priority updated", dispute);
  }
}