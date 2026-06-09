import mongoose from "mongoose";

export enum CouponType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE"
}

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      index: true
    },

    type: {
      type: String,
      enum: Object.values(CouponType)
    },

    value: Number,

    minOrderAmount: {
      type: Number,
      default: 0
    },

    maxUsage: Number,

    usedCount: {
      type: Number,
      default: 0
    },

    expiresAt: Date,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const CouponModel = mongoose.model(
  "Coupon",
  couponSchema
);