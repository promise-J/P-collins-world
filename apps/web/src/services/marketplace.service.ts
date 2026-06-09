import { api } from "@/lib/axios";

export class MarketplaceService {
  static async products(params?: any) {
    const response = await api.get("/products", { params });

    return response.data;
  }

  static async product(id: string) {
    const response = await api.get(`/products/${id}`);

    return response.data;
  }

  static async wishlist() {
    const response = await api.get("/wishlist");

    return response.data;
  }
}
