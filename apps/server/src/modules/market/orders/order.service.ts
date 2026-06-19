import { OrderModel } from "./order.model";

import { CartModel } from "../cart/cart.model";
import { serviceResponse } from "@/utils/apiResponse";

export class OrderService {
  async createOrderFromCart(userId: string) {
    const cart = await CartModel.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return serviceResponse(false, "Cart is empty");
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

    return serviceResponse(true, 'Order created', order);
  }

  async markAsPaid(orderId: string, ref: string) {
    const order = await OrderModel.findByIdAndUpdate(orderId, {
      status: "PAID",
      paymentReference: ref
    });

    return serviceResponse(true, 'Order marked as paid')
  }
  async getUserOrders(userId: string) {
    const orders = await OrderModel.find({ userId }).sort({
      createdAt: -1
    });

    return serviceResponse(true, 'Order fetched', orders)
  }
}