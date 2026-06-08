import { InspectionModel } from "./inspection.model";
import { PropertyModel } from "../properties/property.model";
import { NotificationService } from "../notifications/notification.service";

export class InspectionService {
  private notificationService = new NotificationService();

  async bookInspection(userId: string, propertyId: string, scheduledDate: Date, message?: string) {
    const property = await PropertyModel.findById(propertyId);
    if (!property) throw new Error("Property not found");

    const existing = await InspectionModel.findOne({
      userId,
      propertyId,
      status: { $in: ["PENDING", "CONFIRMED"] }
    });

    if (existing) throw new Error("You already have a pending inspection for this property");

    const inspection = new InspectionModel({
      userId,
      propertyId,
      scheduledDate,
      message,
      status: "PENDING"
    });

    await inspection.save();

    if (property.landlordId) {
      await this.notificationService.create(
        property.landlordId.toString(),
        "New Inspection Request",
        `Someone wants to inspect your property: ${property.title}`
      );
    }

    await inspection.populate("propertyId userId");
    return inspection;
  }

  async updateStatus(inspectionId: string, status: string, adminNotes?: string) {
    const inspection = await InspectionModel.findById(inspectionId);
    if (!inspection) throw new Error("Inspection not found");

    inspection.status = status as any;
    if (adminNotes) inspection.adminNotes = adminNotes;
    await inspection.save();

    // Notify user
    await this.notificationService.create(
      inspection?.userId?.toString() ?? "",
      "Inspection Status Updated",
      `Your inspection request has been ${status.toLowerCase()}`
    );

    return inspection;
  }

  async getUserInspections(userId: string, page: number = 1, limit: number = 10) {
    const inspections = await InspectionModel.find({ userId })
      .populate("propertyId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ scheduledDate: -1 });

    const total = await InspectionModel.countDocuments({ userId });

    return {
      data: inspections,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getPropertyInspections(propertyId: string, page: number = 1, limit: number = 10) {
    const inspections = await InspectionModel.find({ propertyId })
      .populate("userId", "firstName lastName email phone")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ scheduledDate: -1 });

    const total = await InspectionModel.countDocuments({ propertyId });

    return {
      data: inspections,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async cancelInspection(inspectionId: string, userId: string) {
    const inspection = await InspectionModel.findOne({ _id: inspectionId, userId });
    if (!inspection) throw new Error("Inspection not found");

    if (inspection.status !== "PENDING") {
      throw new Error("Cannot cancel inspection that is already confirmed or done");
    }

    inspection.status = "CANCELLED";
    await inspection.save();

    return inspection;
  }
}