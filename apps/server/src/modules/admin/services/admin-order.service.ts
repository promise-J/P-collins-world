import { OrderModel, OrderStatus } from "../../market/orders/order.model";
import { UserModel } from "../../users/user.model";
import { ProductModel } from "../../market/products/product.model";
import { serviceResponse } from "../../../utils/apiResponse";
import { NotificationService } from "../../notifications/notification.service";

const notificationService = new NotificationService();

export class AdminOrderService {
  async getAllOrders(filters: any) {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const query: any = {};

    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: "i" } },
        { "shippingAddress.firstName": { $regex: search, $options: "i" } },
        { "shippingAddress.lastName": { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const orders = await OrderModel.find(query)
      .populate("userId", "firstName lastName email")
      .populate("items.productId", "name images price")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await OrderModel.countDocuments(query);

    return serviceResponse(true, "Orders fetched", {
      data: orders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  }

  async getOrderDetails(orderId: string) {
    const order = await OrderModel.findById(orderId)
      .populate("userId", "firstName lastName email phone")
      .populate("items.productId", "name images price stock");

    if (!order) {
      return serviceResponse(false, "Order not found");
    }

    return serviceResponse(true, "Order details fetched", order);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, adminId: string, note?: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return serviceResponse(false, "Order not found");
    }

    const oldStatus = order.status;

    // Validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED, OrderStatus.FAILED],
      [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.FAILED]: [],
    };

    if (!validTransitions[oldStatus]?.includes(status)) {
      return serviceResponse(false, `Invalid status transition from ${oldStatus} to ${status}`);
    }

    // Handle shipping tracking
    if (status === OrderStatus.SHIPPED && !order.trackingNumber) {
      // Generate tracking number if not set
      order.trackingNumber = `TRK-${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    }

    order.status = status;
    order.adminNotes = note || order.adminNotes;
    
    if (status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Send notification to user
    await notificationService.create({
      userId: order?.userId?.toString() ?? "",
      title: `Order Status Updated: ${status}`,
      message: `Your order #${order._id?.toString().slice(-8).toUpperCase()} has been updated to ${status}. ${note || ""}`
    });

    return serviceResponse(true, "Order status updated", {
      order,
      oldStatus,
      newStatus: status,
    });
  }

  async updateTrackingNumber(orderId: string, trackingNumber: string, adminId: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return serviceResponse(false, "Order not found");
    }

    order.trackingNumber = trackingNumber;
    await order.save();

    await notificationService.create({
      userId: order?.userId?.toString() ?? "",
      title: "Tracking Number Updated",
      message: `Your order #${order._id?.toString().slice(-8).toUpperCase()} has been assigned tracking number: ${trackingNumber}`
  });

    return serviceResponse(true, "Tracking number updated", order);
  }

  async addAdminNote(orderId: string, note: string, adminId: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return serviceResponse(false, "Order not found");
    }

    order.adminNotes = note;
    await order.save();

    return serviceResponse(true, "Admin note added", order);
  }

  async getOrderStats() {
    const stats = await OrderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalOrders = await OrderModel.countDocuments();
    const totalRevenue = await OrderModel.aggregate([
      { $match: { status: { $in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    return serviceResponse(true, "Order stats fetched", {
      byStatus: stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  }
}