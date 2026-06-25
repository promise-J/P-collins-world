import { Request, Response } from "express";
import os from "node:os";
import fs from "node:fs";
import mongoose from "mongoose";
import { UserModel } from "../../users/user.model";
import { PropertyModel } from "../../properties/property.model";
import { ProductModel } from "../../market/products/product.model";
import { OrderModel } from "../../market/orders/order.model";
import { SavingsPlanModel } from "../../savings/saving-plan.model";
import { KYCModel, KYCStatus } from "../../kyc/kyc.model";
import { TransactionModel, TransactionStatus } from "../../wallet/transaction.model";
import { AuditService } from "../../audit/audit.service";
import { emailQueue } from "../../jobs/queues/email.queue";
import { getRedis } from "../../../config/redis";
import { serviceResponse } from "@/utils/apiResponse";
import { AuthRepository } from "../../auth/auth.repository";
import { UserRole } from "@/enum/role.enum";
import bcrypt from "bcryptjs";
import { JwtService } from "../../services/jwt.service";

const auditService = new AuditService();

export class AdminService {
    private authRepository = new AuthRepository();


  async login(email: string, password: string) {
      if (!password) {
        return serviceResponse(false, "Invalid credentials");
      }
  
      const user = await this.authRepository.findByEmail(email);
  
      if (!user) {
        return serviceResponse(false, "Admin not found");
      }
  
      if (user?.role !== UserRole.ADMIN &&  user?.role !== UserRole.SUPER_ADMIN) {
        return serviceResponse(false, "Access denied. Administrative privileges required.");
      }
  
      if (!user.isVerified) {
        return serviceResponse(
          false,
          "Please verify your email before logging in"
        );
      }
  
      if (user.isSuspended) {
        return serviceResponse(
          false,
          `Account suspended. Reason: ${
            user.suspensionReason || "Violation of terms"
          }`
        );
      }
  
      const valid = await bcrypt.compare(password, user.password);
  
      if (!valid) {
        return serviceResponse(false, "Invalid credentials");
      }
  
      const accessToken = JwtService.signAccessToken(user._id.toString());
      const refreshToken = JwtService.signRefreshToken(user._id.toString());
  
      await this.authRepository.updateRefreshToken(user._id.toString(), refreshToken);
  
      const userObj = user.toObject();
  
      const {
        password: _,
        refreshToken: __,
        verificationToken,
        verificationExpires,
        passwordResetToken,
        passwordResetExpires,
        ...userData
      } = userObj as any;
  
      return serviceResponse(true, "Login successful", {
        user: userData,
        accessToken,
        refreshToken,
      });
    }

  async getSystemMetrics(req: Request, res: Response){
  try {
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : "Unknown";
    const cpuCount = cpus.length;
    const loadAverage = os.loadavg();

    const totalMemBytes = os.totalmem();
    const freeMemBytes = os.freemem();
    const memory = {
      totalMB: Math.round(totalMemBytes / (1024 * 1024)),
      freeMB: Math.round(freeMemBytes / (1024 * 1024)),
      usagePercentage: Math.round(((totalMemBytes - freeMemBytes) / totalMemBytes) * 100),
    };

    let diskUsage = { totalGB: 0, freeGB: 0, usagePercentage: 0, error: "Unavailable" };
    try {
      const stats = fs.statfsSync("/");
      const totalSpace = stats.bsize * stats.blocks;
      const freeSpace = stats.bsize * stats.bfree;
      diskUsage = {
        totalGB: Math.round(totalSpace / (1024 * 1024 * 1024)),
        freeGB: Math.round(freeSpace / (1024 * 1024 * 1024)),
        usagePercentage: Math.round(((totalSpace - freeSpace) / totalSpace) * 100),
        error: "None",
      };
    } catch (err) {
    }

    const redisClient = getRedis();
    const redisStatus = redisClient.status;

    const mongoStateMap = ["disconnected", "connected", "connecting", "disconnecting"];
    const mongoStatus = mongoStateMap[mongoose.connection.readyState] || "unknown";

    let queueSize = 0;
    let failedJobsCount = 0;
    try {
      const counts = await emailQueue.getJobCounts("wait", "active", "failed");
      queueSize = (counts.wait || 0) + (counts.active || 0);
      failedJobsCount = counts.failed || 0;
    } catch (queueError) {
    }

    const metricsPayload = {
      cpu: {
        model: cpuModel,
        cores: cpuCount,
        loadPast1Min: loadAverage[0],
      },
      memory,
      diskUsage,
      mongoStatus,
      redisStatus,
      queueSize,
      failedJobs: failedJobsCount,
    };

    return serviceResponse(true, "Metrics fetched", metricsPayload)
  } catch (error: any) {
    console.error("Error fetching system metrics:", error);
  }
  };

  async dashboardMetrics() {
    const [
      users,
      properties,
      products,
      orders,
      savingsPlans
    ] = await Promise.all([
      UserModel.countDocuments(),
      PropertyModel.countDocuments(),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(),
      SavingsPlanModel.countDocuments()
    ]);

    return serviceResponse(true, "Dashboad metrics", 
      {
        users,
        properties,
        products,
        orders,
        savingsPlans
      }
    )
  }
  async getUsers(query: any) {
    const {
      page = 1,
      limit = 20,
      role,
      search
    } = query;
  
    const filter: any = {};
  
    if (role) {
      filter.role = role;
    }
  
    if (search) {
      filter.$or = [
        {
          email: {
            $regex: search,
            $options: "i"
          }
        },
        {
          firstName: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }
  
    const users = UserModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    return serviceResponse(true, "User fetched", users)

  }
  async pendingKyc() {
    const kycs = await KYCModel.find({
      status: KYCStatus.PENDING
    });

    return serviceResponse(true, "Kyc fetched", kycs)

  }
  async monthlyRevenue() {
    const result = TransactionModel.aggregate([
      {
        $match: {
          status: TransactionStatus.SUCCESS
        }
      },
  
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt"
            }
          },
  
          revenue: {
            $sum: "$amount"
          }
        }
      }
    ]);

    return serviceResponse(true, "Monthly revenue fetched", result)

  }
  async topProducts() {
    const topProducts = await ProductModel.find()
      .sort({
        salesCount: -1
      })
      .limit(10);

    return serviceResponse(true, "Product fetched", topProducts)
  }
  async totalSavings() {
    const totalSavings = await SavingsPlanModel.aggregate([
        {
          $group:{
             _id:{
                month:{
                   $month:"$createdAt"
                }
             },
             totalSaved:{
                $sum:"$currentAmount"
             }
          }
        }
       ]);
    return serviceResponse(true, "Total savings fetched", totalSavings)
  }
  async orderTrend() {
    const orderTrend = await OrderModel.aggregate([
        {
          $group:{
             _id:{
                month:{
                   $month:"$createdAt"
                }
             },
             totalOrders:{
                $sum:1
             }
          }
        }
       ]);

    return serviceResponse(true, "Order trend fetched", orderTrend)
  }
  async propertyTrend() {
    const propertyTrend = await PropertyModel.aggregate([
        {
          $group:{
             _id:{
                month:{
                  $month:"$createdAt"
                }
             },
             listings:{
                $sum:1
             }
          }
        }
       ]);

    return serviceResponse(true, "Property trend", propertyTrend)
  }
  async userTrend() {
    const userTrend = await UserModel.aggregate([
        {
          $group:{
             _id:{
                month:{
                  $month:"$createdAt"
                }
             },
             users:{
                $sum:1
             }
          }
        }
       ]);

    return serviceResponse(true, "User Trend", userTrend)
  }
  async suspendUser(
    userId:string,
    reason:string
  ){
    const user =
      await UserModel.findByIdAndUpdate(
        userId,
        {
          isSuspended:true,
          suspensionReason:reason
        },
        {new:true}
      );
  
    await auditService.log({
      userId,
      module:"ADMIN",
      action:"USER_SUSPENDED"
    });
  
    return serviceResponse(true, "User suspended", user);
  }
  async activateUser(userId:string){
    await UserModel.findByIdAndUpdate(
      userId,
      {
        isSuspended:false,
        suspensionReason:null
      }
    );

    return serviceResponse(true, "User activated successfully")
  }
  async verifyAgent(userId:string){
    await UserModel.findByIdAndUpdate(
       userId,
       { verifiedAgent:true }
    );

    return serviceResponse(true, "Agent verified successfully")
 }
 async verifyLandlord(userId:string){
    await UserModel.findByIdAndUpdate(
       userId,
       { verifiedLandlord:true }
    );
    return serviceResponse(true, "Landlord verified successfully")
 }
}