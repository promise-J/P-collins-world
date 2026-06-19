import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    rating: Number,
    comment: String
  },
  { timestamps: true }
);

reviewSchema.plugin(autoConvertObjectIdsAsync(['userId', 'productId']))


export const ReviewModel = mongoose.model(
  "Review",
  reviewSchema
);