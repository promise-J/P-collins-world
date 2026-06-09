import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
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
          ref: "Product"
        },

        quantity: Number,

        price: Number
      }
    ]
  },
  { timestamps: true }
);

export const CartModel = mongoose.model("Cart", cartSchema);