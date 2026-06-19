import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true
    },
    balance: {
      type: Number,
      default: 0
    },
    pendingBalance: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

walletSchema.plugin(autoConvertObjectIdsAsync(['userId']))


export const WalletModel = mongoose.model("Wallet", walletSchema);