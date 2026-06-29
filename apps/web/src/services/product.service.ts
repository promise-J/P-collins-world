import { api } from "@/lib/axios";

export interface ProductData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  stock: number;
  status?: "ACTIVE" | "OUT_OF_STOCK" | "DISABLED";
}

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

  static async create(data: FormData) {
    const response = await api.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
  
  static async update(id: string, data: FormData | any) {
    const headers: any = {};
    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }
    const response = await api.patch(`/products/${id}`, data, { headers });
    return response.data;
  }

  static async updateWithFiles(id: string, data: FormData) {
    const response = await api.patch(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
