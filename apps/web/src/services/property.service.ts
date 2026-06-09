import { api } from "@/lib/axios";

export class PropertyService {
  static async list(params?: {
    page?: number;
    limit?: number;
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    status?: string;
    search?: string;  // Add search parameter
  }) {
    const response = await api.get("/properties", { params });
    return response.data;
  }

  static async getOne(id: string) {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  }

  static async search(query: string) {
    const response = await api.get("/properties/search", { params: { q: query } });
    return response.data;
  }

  static async create(payload: any) {
    const response = await api.post("/properties", payload);
    return response.data;
  }

  static async update(id: string, payload: any) {
    const response = await api.patch(`/properties/${id}`, payload);
    return response.data;
  }

  static async delete(id: string) {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  }

  static async getFavorites() {
    const response = await api.get("/favorites");
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

  static async getRecentlyViewed() {
    const response = await api.get("/properties/recently-viewed");
    return response.data;
  }

  static async recommendations() {
    const response = await api.get("/properties/recommendations");
    return response.data;
  }
}