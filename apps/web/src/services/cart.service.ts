import { api } from "../lib/axios";

export class CartService {
  static async getCart() {
    const response = await api.get("/cart");
    return response.data;
  }

  static async addToCart(productId: string, quantity: number, price: number) {
    const response = await api.post("/cart/add", {
      productId,
      quantity,
      price,
    });
    return response.data;
  }

  static async updateQuantity(productId: string, quantity: number) {
    const response = await api.patch(`/cart/update/${productId}`, { quantity });
    return response.data;
  }

  static async removeItem(productId: string) {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  }

  static async clearCart() {
    const response = await api.delete("/cart");
    return response.data;
  }

  static async getCartCount() {
    const response = await api.get("/cart/count");
    return response.data;
  }
}