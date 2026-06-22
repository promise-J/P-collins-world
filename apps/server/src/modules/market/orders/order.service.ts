import { OrderModel } from "./order.model";

import { CartModel } from "../cart/cart.model";
import { serviceResponse } from "@/utils/apiResponse";
import { ProductModel } from "../products/product.model";

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
  async getUserOrders(userId: string) {
    const orders = await OrderModel.find({ userId }).sort({
      createdAt: -1
    });

    return serviceResponse(true, 'Order fetched', orders)
  }

  async markAsPaid(orderId: string, paymentReference: string) {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        status: "PAID",
        paymentReference,
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!order) {
      return serviceResponse(false, "Order not found");
    }

    // Update product stock
    for (const item of order.items) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -(item.quantity ?? 0), salesCount: item.quantity ?? 0 },
      });
    }

    return serviceResponse(true, 'Marked as paid', order);
  }

  async markAsFailed(orderId: string, reason: string) {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        status: "CANCELLED",
        cancellationReason: reason,
      },
      { new: true }
    );

    return serviceResponse(true, 'Marked as failed', order);
  }
}