import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

export enum DisputeStatus {
  PENDING = "PENDING",
  IN_REVIEW = "IN_REVIEW",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum DisputePriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum DisputeType {
  ORDER = "ORDER",
  PROPERTY = "PROPERTY",
  PAYMENT = "PAYMENT",
  OTHER = "OTHER",
}

const disputeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(DisputeStatus),
      default: DisputeStatus.PENDING,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(DisputePriority),
      default: DisputePriority.MEDIUM,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(DisputeType),
      required: true,
      index: true,
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
    propertyId: {
      type: mongoose.Types.ObjectId,
      ref: "Property",
    },
    customer: {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
    adminNotes: {
      type: String,
    },
    resolution: {
      type: String,
    },
    resolvedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
    escalatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    escalatedAt: {
      type: Date,
    },
    closedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    closedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

disputeSchema.plugin(
  autoConvertObjectIdsAsync([
    "orderId",
    "propertyId",
    "customer",
    "resolvedBy",
    "escalatedBy",
    "closedBy",
  ])
);

disputeSchema.index({ status: 1, priority: 1 });
disputeSchema.index({ "customer.email": 1 });
disputeSchema.index({ createdAt: -1 });

export const DisputeModel = mongoose.model("Dispute", disputeSchema);
