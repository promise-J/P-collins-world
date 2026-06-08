import { api } from "@/lib/axios";

export class InventoryService {
  static async validateCart(productIds: string[]) {
    const response = await api.post(
      "/inventory/validate",

      { productIds }
    );

    return response.data;
  }
}
