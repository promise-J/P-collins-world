import { api } from "@/lib/axios";

export class ProductService {
  static async list(params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    rating?: number;
    inStock?: boolean;
  }) {
    const response = await api.get("/products", { params });
    return response.data;
  }

  static async getOne(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  static async search(query: string) {
    const response = await api.get("/products/search", { params: { q: query } });
    return response.data;
  }

  static async create(payload: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    images: string[];
    stock: number;
    status?: string;
  }) {
    const response = await api.post("/products", payload);
    return response.data;
  }

  static async update(id: string, payload: any) {
    const response = await api.patch(`/products/${id}`, payload);
    return response.data;
  }

  static async delete(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }

  static async getRecommendations(productId: string) {
    const response = await api.get(`/products/${productId}/recommendations`);
    return response.data;
  }
}