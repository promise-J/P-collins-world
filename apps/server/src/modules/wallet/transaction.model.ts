import mongoose from "mongoose";

export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit"
}

export enum TransactionStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed"
}

const transactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Types.ObjectId,
      ref: "Wallet",
      index: true
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },

    type: {
      type: String,
      enum: Object.values(TransactionType)
    },

    amount: {
      type: Number,
      required: true
    },

    reference: {
      type: String,
      unique: true,
      index: true,
      sparse: true
    },

    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING
    },

    metadata: {
      type: Object
    },
    paymentProof:{
      url:String,
      publicId:String
     }
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model(
  "Transaction",
  transactionSchema
);