import { api } from "@/lib/axios";

export class FavoriteService {
  static async getFavorites(params?: { page?: number; limit?: number }) {
    const response = await api.get("/favorites", { params });
    return response.data;
  }

  static async addFavorite(propertyId: string) {
    const response = await api.post(`/favorites/${propertyId}`);
    return response.data;
  }

  static async removeFavorite(propertyId: string) {
    const response = await api.delete(`/favorites/${propertyId}`);
    return response.data;
  }

  static async checkFavorite(propertyId: string) {
    const response = await api.get(`/favorites/${propertyId}/check`);
    return response.data;
  }
}