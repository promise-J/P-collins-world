import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

export enum KYCStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
    },

    fullName: String,

    idType: {
      type: String,
      enum: ["NIN", "PASSPORT", "DRIVERS_LICENSE"],
    },

    idNumber: String,

    idDocumentUrl: String,

    selfieUrl: String,

    status: {
      type: String,
      enum: Object.values(KYCStatus),
      default: KYCStatus.PENDING,
    },

    reviewedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    documents: [
      {
        type: {
          type: String,
          enum: ["nin", "passport", "driver_license"],
        },

        url: String,

        publicId: String,
      },
    ],

    rejectionReason: String,
  },
  { timestamps: true }
);

kycSchema.plugin(autoConvertObjectIdsAsync(['userId']))

export const KYCModel = mongoose.model("KYC", kycSchema);
