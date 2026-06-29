import { api } from "../lib/axios";

export interface WishlistItem {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    status: string;
    rating: number;
    totalReviews: number;
  } | string;
  createdAt: string;
}

export class WishlistService {
  static async getWishlist() {
    const response = await api.get("/wishlist");
    return response.data;
  }

  static async addToWishlist(productId: string) {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  }

  static async removeFromWishlist(productId: string) {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  }

  static async checkInWishlist(productId: string) {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  }

  static async clearWishlist() {
    const response = await api.delete("/wishlist/clear/all");
    return response.data;
  }
}