import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },

        quantity: Number,

        price: Number,
      },
    ],
  },
  { timestamps: true }
);

cartSchema.plugin(autoConvertObjectIdsAsync(['userId']))

cartSchema.index({ userId: 1, "items.productId": 1 }, { unique: true });

export const CartModel = mongoose.model("Cart", cartSchema);
