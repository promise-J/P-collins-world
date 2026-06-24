import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lgas: [
      {
        name: {
          type: String,
          required: true,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        deliveryFee: {
          type: Number,
          default: 0,
        },
        estimatedDays: {
          type: Number,
          default: 3,
        },
      },
    ],
    deliveryFee: {
      type: Number,
      default: 0,
    },
    estimatedDays: {
      type: Number,
      default: 3,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const LocationModel = mongoose.model("Location", locationSchema);