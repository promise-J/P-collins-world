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
    }
  },
  { timestamps: true }
);

export const FavoriteModel = mongoose.model("Favorite", favoriteSchema);