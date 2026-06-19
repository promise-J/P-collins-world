import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },

    propertyId: {
      type: mongoose.Types.ObjectId,
      ref: "Property",
      index: true
    },
    itemType: {
      type: String,
      default: 'product',
      enum: ['product', 'property']
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      index: true
    }
  },
  { timestamps: true }
);

favoriteSchema.plugin(autoConvertObjectIdsAsync(['userId', 'propertyId']))

export const FavoriteModel = mongoose.model("Favorite", favoriteSchema);