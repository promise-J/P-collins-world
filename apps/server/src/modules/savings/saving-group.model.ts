import mongoose from "mongoose";

const savingsGroupSchema = new mongoose.Schema(
  {
    name: String,

    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },

    members: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "User"
        },

        role: {
          type: String,
          enum: ["OWNER", "TREASURER", "MEMBER"]
        }
      }
    ],

    targetAmount: Number,

    contributionAmount: Number,

    lockPeriodDays: Number,

    isLocked: {
      type: Boolean,
      default: false
    },
    goal: {
        title: String, // e.g Foodstuff
      
        description: String,
      
        targetAmount: Number,
      
        category: {
          type: String,
          enum: [
            "FOOD",
            "GADGET",
            "RENT",
            "BUSINESS",
            "OTHER"
          ]
        }
      },
      
      currentAmount: {
        type: Number,
        default: 0
      },

    penaltiesEnabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const SavingsGroupModel = mongoose.model(
  "SavingsGroup",
  savingsGroupSchema
);