import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["INFO", "SUCCESS", "WARNING", "ERROR"],
      default: "INFO",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    actionUrl: String,
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({
  userId: 1,
  createdAt: -1,
});

notificationSchema.plugin(autoConvertObjectIdsAsync(["userId"]));

export const NotificationModel = mongoose.model(
  "Notification",
  notificationSchema
);
