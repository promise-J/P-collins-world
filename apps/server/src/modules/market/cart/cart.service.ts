import { serviceResponse } from "@/utils/apiResponse";
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
       existing.quantity ??= 0;
       existing.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price
      });
    }

    await cart.save();

    return serviceResponse(true, 'Item added to cart', cart);
  }

  async getCart(userId: string) {
    const cartItems = await CartModel.findOne({ userId });
    return serviceResponse(true, 'Cart fetchec', cartItems)
  }

  async clearCart(userId: string) {
    await CartModel.findOneAndDelete({ userId });
    return serviceResponse(true, 'Cart cleared')
  }
}