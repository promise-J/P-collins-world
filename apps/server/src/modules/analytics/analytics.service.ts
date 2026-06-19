import { UserModel } from "../users/user.model";
import { ProductModel } from "../market/products/product.model";
import { OrderModel } from "../market/orders/order.model";
import { PropertyModel } from "../properties/property.model";
import { TransactionModel, TransactionStatus } from "../wallet/transaction.model";
import { SavingsPlanModel } from "../savings/saving-plan.model";
import { SavingsGroupModel } from "../savings/saving-group.model";
import { serviceResponse } from "@/utils/apiResponse";

export class AnalyticsService {
  async getPlatformMetrics() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalProperties,
      totalSavingsPlans,
      totalSavingsGroups
    ] = await Promise.all([
      UserModel.countDocuments(),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(),
      PropertyModel.countDocuments(),
      SavingsPlanModel.countDocuments(),
      SavingsGroupModel.countDocuments()
    ]);

    return serviceResponse(true, 'Platform metrics', {
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      properties: totalProperties,
      savingsPlans: totalSavingsPlans,
      savingsGroups: totalSavingsGroups
    });
  }

  async getRevenueAnalytics(startDate?: Date, endDate?: Date) {
    const match: any = { status: TransactionStatus.SUCCESS };
    
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const revenue = await TransactionModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    const totalRevenue = revenue.reduce((sum, r) => sum + r.total, 0);

    return serviceResponse(true, 'Revenue analytics', { revenue, totalRevenue });
  }

  async getProductAnalytics() {
    const topProducts = await ProductModel.find()
      .sort({ salesCount: -1 })
      .limit(10)
      .select("name price salesCount rating totalReviews");

    const categoryStats = await ProductModel.aggregate([
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 },
          totalSales: { $sum: "$salesCount" }
        }
      }
    ]);

    return serviceResponse(true, 'Product analytics', { topProducts, categoryStats });
  }

  async getUserAnalytics() {
    const usersByRole = await UserModel.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    const verifiedUsers = await UserModel.countDocuments({ isVerified: true });
    const pendingKYC = await UserModel.countDocuments({ isVerified: false });

    return serviceResponse(true, 'User analytics', { usersByRole, verifiedUsers, pendingKYC });
  }

  async getPropertyAnalytics() {
    const propertiesByStatus = await PropertyModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const propertiesByType = await PropertyModel.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    const averagePrice = await PropertyModel.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: "$price" }
        }
      }
    ]);

    return serviceResponse(true, 'Property analytics', {
      byStatus: propertiesByStatus,
      byType: propertiesByType,
      averagePrice: averagePrice[0]?.avg || 0
    });
  }

  async getSavingsAnalytics() {
    const totalSavedPersonal = await SavingsPlanModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$currentAmount" }
        }
      }
    ]);

    const totalSavedGroup = await SavingsGroupModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$currentAmount" }
        }
      }
    ]);

    const completedPlans = await SavingsPlanModel.countDocuments({ isCompleted: true });
    const activePlans = await SavingsPlanModel.countDocuments({ isCompleted: false });

    return serviceResponse(true, 'Savings analytics', {
      personalSavings: totalSavedPersonal[0]?.total || 0,
      groupSavings: totalSavedGroup[0]?.total || 0,
      completedPlans,
      activePlans
    });
  }
}