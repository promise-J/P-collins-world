import mongoose from "mongoose";

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },

    items: [
      {
        productId: mongoose.Types.ObjectId,
        quantity: Number,
        price: Number
      }
    ],

    totalAmount: Number,

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    },

    paymentReference: String
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model("Order", orderSchema);