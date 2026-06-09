import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    device: String,
    ipAddress: String,
    refreshToken: String,
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export const SessionModel = mongoose.model("Session", sessionSchema);
