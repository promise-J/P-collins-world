import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },

    address: String,

    city: String,

    state: String,

    country: String,

    bio: String,

    occupation: String,

    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String
    },

    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },

      smsNotifications: {
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

export const ProfileModel = mongoose.model("Profile", profileSchema);