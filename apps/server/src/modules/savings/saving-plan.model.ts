
import mongoose from "mongoose";

export enum Frequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY"
}

const savingsPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },

    targetAmount: {type: Number},

    currentAmount: {
      type: Number,
      default: 0
    },

    frequency: {
      type: String,
      enum: Object.values(Frequency)
    },

    autoDebit: {
      type: Boolean,
      default: false
    },

    isCompleted: {
      type: Boolean,
      default: false
    },

    startDate: {type: Date},

    endDate: {type: Date}
  },
  { timestamps: true }
);

export const SavingsPlanModel = mongoose.model(
  "SavingsPlan",
  savingsPlanSchema
);