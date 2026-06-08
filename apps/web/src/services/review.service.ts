import { api } from "@/lib/axios";


export class ReviewService {
  static async getProductReviews(productId: string, params?: { page?: number; limit?: number }) {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  }

  static async createReview(productId: string, payload: { rating: number; comment: string }) {
    const response = await api.post(`/reviews/product/${productId}`, payload);
    return response.data;
  }

  static async updateReview(reviewId: string, payload: { rating?: number; comment?: string }) {
    const response = await api.patch(`/reviews/${reviewId}`, payload);
    return response.data;
  }

  static async deleteReview(reviewId: string) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }

  static async getMyReviews(params?: { page?: number; limit?: number }) {
    const response = await api.get("/reviews/my", { params });
    return response.data;
  }
}