import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISABLED = "DISABLED"
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
      required: true
    },

    description: String,
    price: {
      type: Number,
      required: true,
      index: true
    },

    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      index: true
    },

    images: [
      {
        url: String,
        publicId: String,
        _id: false
      }
    ],

    stock: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.ACTIVE
    },

    rating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    salesCount: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

productSchema.index({
  name: "text",
  description: "text"
});

productSchema.plugin(autoConvertObjectIdsAsync(['categoryId', 'createdBy', 'updatedBy']))


export const ProductModel = mongoose.model(
  "Product",
  productSchema
);