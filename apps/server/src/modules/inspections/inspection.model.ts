import mongoose from "mongoose";

const inspectionSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Types.ObjectId,
      ref: "Property",
      index: true
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },

    scheduledDate: {type: Date},
    adminNotes: {
      type: String
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "DONE"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export const InspectionModel = mongoose.model(
  "Inspection",
  inspectionSchema
);