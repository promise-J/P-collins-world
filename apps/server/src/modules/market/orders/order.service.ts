import { OrderModel, OrderStatus } from "./order.model";
import { CartModel } from "../cart/cart.model";
import { ProductModel } from "../products/product.model";
import { serviceResponse } from "../../../utils/apiResponse";

export class OrderService {
  async createOrder(userId: string, data: any) {
    try {
      // Get cart items
      const cart = await CartModel.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        return serviceResponse(false, "Cart is empty");
      }

      // Validate stock and calculate total
      let totalAmount = 0;
      const orderItems = [];

      for (const item of cart.items) {
        const product = await ProductModel.findById(item.productId);
        if (!product) {
          return serviceResponse(false, `Product not found: ${item.productId}`);
        }
        if (product.stock < (item.quantity ?? 0)) {
          return serviceResponse(false, `Insufficient stock for ${product.name}`);
        }

        const price = item.price || product.price;
        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: price,
        });

        totalAmount += price * (item.quantity ?? 1);
      }

      // Add delivery fee to total
      const deliveryFee = data.deliveryFee || 0;
      totalAmount += deliveryFee;

      // Create order
      const order = await OrderModel.create({
        userId,
        items: orderItems,
        totalAmount,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        deliveryFee,
        estimatedDays: data.estimatedDays || 3,
        status: OrderStatus.PENDING,
      });

      // Clear cart
      await CartModel.findOneAndDelete({ userId });

      return serviceResponse(true, "Order created successfully", order);
    } catch (error: any) {
      console.error("Create order error:", error);
      return serviceResponse(false, error.message || "Failed to create order");
    }
  }

  async getOrder(orderId: string, userId: string) {
    const order = await OrderModel.findOne({ _id: orderId, userId })
      .populate("items.productId", "name images price");
    
    if (!order) {
      return serviceResponse(false, "Order not found");
    }
    return serviceResponse(true, "Order fetched", order);
  }

  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const orders = await OrderModel.find({ userId })
      .populate("items.productId", "name images price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await OrderModel.countDocuments({ userId });

    return serviceResponse(true, "Orders fetched", {
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  }

  async markAsPaid(orderId: string, paymentReference: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return serviceResponse(false, "Order not found");
    }

    if (order.status === "PAID") {
      return serviceResponse(false, "Order already paid");
    }

    // Update order status
    order.status = OrderStatus.PAID;
    order.paymentReference = paymentReference;
    order.paidAt = new Date();
    await order.save();

    // Update product stock
    for (const item of order.items) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, salesCount: item.quantity },
      });
    }

    return serviceResponse(true, "Order marked as paid", order);
  }

  async markAsFailed(orderId: string, reason: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return serviceResponse(false, "Order not found");
    }

    order.status = OrderStatus.FAILED;
    order.cancellationReason = reason;
    await order.save();

    return serviceResponse(true, "Order marked as failed", order);
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return serviceResponse(false, "Order not found");
    }
    return serviceResponse(true, "Order status updated", order);
  }
}