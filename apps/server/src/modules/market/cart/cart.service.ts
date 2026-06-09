import { CartModel } from "./cart.model";

export class CartService {
  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    price: number
  ) {
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = await CartModel.create({
        userId,
        items: []
      });
    }

    const existing = cart.items.find(
      (i) => (i.productId ?? "").toString() === productId
    );

    if (existing) {
       existing.quantity ??= 0; // Sets to 0 if null/undefined
       existing.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price
      });
    }

    await cart.save();

    return cart;
  }

  async getCart(userId: string) {
    return CartModel.findOne({ userId });
  }

  async clearCart(userId: string) {
    return CartModel.findOneAndDelete({ userId });
  }
}