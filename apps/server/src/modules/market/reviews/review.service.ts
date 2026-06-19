import mongoose from "mongoose";
import { ReviewModel } from "./review.model";
import { ProductModel } from "../products/product.model";
import { serviceResponse } from "@/utils/apiResponse";

export class ReviewService {
  async createReview(userId: string, productId: string, rating: number, comment: string) {
    const product = await ProductModel.findById(productId);
    if (!product) return serviceResponse(false, "Product not found");

    const existing = await ReviewModel.findOne({ userId, productId });
    if (existing) return serviceResponse(false, "You have already reviewed this product");

    if (rating < 1 || rating > 5) return serviceResponse(false, "Rating must be between 1 and 5");

    const review = await ReviewModel.create({
      userId,
      productId,
      rating,
      comment
    });

    await this.updateProductRating(productId);

    const result = review.populate("userId", "firstName lastName avatar");
    return serviceResponse(true, 'Review created', result)
  }

  async getProductReviews(productId: string, page: number = 1, limit: number = 10) {
    const reviews = await ReviewModel.find({ productId })
      .populate("userId", "firstName lastName avatar")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ReviewModel.countDocuments({ productId });

    const averageRating = await this.getAverageRating(productId);

    return serviceResponse(true, 'Product reviews', {
      data: reviews,
      averageRating,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  }

  async updateReview(reviewId: string, userId: string, rating?: number, comment?: string) {
    const review = await ReviewModel.findById(reviewId);
    if (!review) return serviceResponse(false, "Review not found");
    if (review?.userId?.toString() !== userId) return serviceResponse(false, "Unauthorized");

    if (rating) {
      if (rating < 1 || rating > 5) return serviceResponse(false, "Rating must be between 1 and 5");
      review.rating = rating;
    }
    if (comment) review.comment = comment;
    
    await review.save();

    await this.updateProductRating(review?.productId?.toString() ?? "");

    return serviceResponse(true, 'Review updated', review);
  }

  async deleteReview(reviewId: string, userId: string, isAdmin: boolean = false) {
    const review = await ReviewModel.findById(reviewId);
    if (!review) return serviceResponse(false, "Review not found");
    
    if (!isAdmin && (review?.userId?.toString() ?? "") !== userId) {
      return serviceResponse(false, "Unauthorized");
    }

    const productId = review?.productId?.toString();
    await review.deleteOne();

    await this.updateProductRating(productId ?? "");

    return serviceResponse(true, 'Review deleted', true);
  }

  async getUserReviews(userId: string, page: number = 1, limit: number = 10) {
    const reviews = await ReviewModel.find({ userId })
      .populate("productId", "name images price")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ReviewModel.countDocuments({ userId });

    return serviceResponse(true, 'User review', {
      data: reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  }

  private async getAverageRating(productId: string): Promise<number> {
    const result = await ReviewModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]);
    const value = result[0]?.avg || 0;
    return serviceResponse(true, 'Average rating', value)
  }

  private async updateProductRating(productId: string) {
    const result = await ReviewModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: "$productId", avgRating: { $avg: "$rating" }, total: { $sum: 1 } } }
    ]);

    const avgRating = result[0]?.avgRating || 0;
    const totalReviews = result[0]?.total || 0;

    await ProductModel.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews
    });

    return serviceResponse(true, 'Product rating updated')
  }
}