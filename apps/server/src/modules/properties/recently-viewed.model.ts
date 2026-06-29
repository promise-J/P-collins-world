import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose, { CallbackWithoutResultAndOptionalError } from "mongoose";

const recentlyViewedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    properties: [
      {
        propertyId: {
          type: mongoose.Types.ObjectId,
          ref: "Property",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

recentlyViewedSchema.plugin(autoConvertObjectIdsAsync(['userId','properties.propertyId']))

recentlyViewedSchema.pre(
    "save", 
    { document: true },
    function (this: any, next: any) {
      if (this.properties.length > 20) {
        const itemsToRemove = this.properties.length - 20;
        this.properties.splice(0, itemsToRemove); 
      }
      next();
    }
  );

export const RecentlyViewedModel = mongoose.model("RecentlyViewed", recentlyViewedSchema);