import { api } from "@/lib/axios";

export interface PropertyData {
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  type: "APARTMENT" | "HOUSE" | "LAND" | "COMMERCIAL";
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED" | "MAINTENANCE" | "EXPIRED";
  features: {
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    furnished: boolean;
  };
  media: Array<{ url: string; publicId: string; type: string }>;
  isFeatured?: boolean;
  approvalStatus?: string;
}

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
    search?: string;
    approvalStatus?: string;
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

  static async create(data: FormData | PropertyData) {
    const response = await api.post("/properties", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  }


  static async update(id: string, data: any): Promise<any> {
    const response = await api.patch(`/properties/${id}`, data);
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

  static async approveProperty(id: string) {
    const response = await api.patch(`/properties/${id}/approve`);
    return response.data;
  }


  static async rejectProperty(id: string, reason?: string) {
    const response = await api.patch(`/properties/${id}/reject`, { reason });
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
