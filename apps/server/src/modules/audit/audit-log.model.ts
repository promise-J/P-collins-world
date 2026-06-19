import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },
    action: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    metadata: {
      type: Object
    },
    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.plugin(autoConvertObjectIdsAsync(['userId']))


// Check if model exists before creating
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);