import { OrderModel } from "./order.model";

import { CartModel } from "../cart/cart.model";

export class OrderService {
  async createOrderFromCart(userId: string) {
    const cart = await CartModel.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const total = cart.items.reduce(
      (sum, item) =>
        sum + (item.price ?? 0) * (item.quantity ?? 0),
      0
    );

    const order = await OrderModel.create({
      userId,
      items: cart.items,
      totalAmount: total
    });

    await CartModel.deleteOne({ userId });

    return order;
  }

  async markAsPaid(orderId: string, ref: string) {
    return OrderModel.findByIdAndUpdate(orderId, {
      status: "PAID",
      paymentReference: ref
    });
  }
  async getUserOrders(userId: string) {
    return OrderModel.find({ userId }).sort({
      createdAt: -1
    });
  }
}