import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED"
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
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      lga: String,
      country: String,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true,
    },
    paymentReference: {
      type: String,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["wallet", "card"],
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    estimatedDays: {
      type: Number,
      default: 3,
    },
    paidAt: Date,
    cancellationReason: String,
    trackingNumber: String,
    deliveryNotes: String,
  },
  { timestamps: true }
);

orderSchema.plugin(autoConvertObjectIdsAsync(['userId', 'items.productId']))


export const OrderModel = mongoose.model("Order", orderSchema);