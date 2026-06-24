import { Response } from "express";
import { OrderService } from "./order.service";
import { WalletService } from "../../wallet/wallet.service";
import { CartModel } from "../cart/cart.model";
import { apiResponse } from "../../../utils/apiResponse";
import { WalletModel } from "@/modules/wallet/wallet.model";

const orderService = new OrderService();
const walletService = new WalletService();

export class OrderController {
  createOrder = async (req: any, res: Response) => {
    try {
      const { shippingAddress, paymentMethod, deliveryFee, estimatedDays } = req.body;
      
      if (!shippingAddress || !paymentMethod) {
        return apiResponse(res, false, "Shipping address and payment method are required");
      }

      const cart = await CartModel.findOne({ userId: req.user._id });
      if (!cart || cart.items.length === 0) {
        return apiResponse(res, false, "Cart is empty");
      }
      
      let cartTotal = 0;
      for (const item of cart.items) {
        cartTotal += (item.price || 0) * (item.quantity || 0);
      }

      const totalWithDelivery = cartTotal + (deliveryFee || 0);

      if (paymentMethod === "wallet") {
        let walletResult = await walletService.getWallet(req.user._id);
        if(!walletResult.success){
          return apiResponse(res, false, 'Something went wrong fetching wallet')
        }
        const walletBalance = walletResult.data.wallet.balance
        console.log('wallet', walletBalance, totalWithDelivery)
        if (walletBalance < totalWithDelivery) {
          return apiResponse(res, false, "Insufficient wallet balance");
        }
      }

      const result = await orderService.createOrder(req.user._id, {
        shippingAddress,
        paymentMethod,
        deliveryFee,
        estimatedDays,
        cartTotal,
      });

      if (!result.success) {
        return apiResponse(res, false, result.message);
      }

      if (paymentMethod === "wallet") {
        try {
          await walletService.debit(
            req.user._id,
            result.data.totalAmount,
            `ORDER_PAYMENT_${result.data._id}`
          );
          
          await orderService.markAsPaid(
            result.data._id,
            `WALLET_${Date.now()}`
          );
          
          return apiResponse(res, true, "Order placed successfully", result.data);
        } catch (walletError: any) {
          await orderService.markAsFailed(
            result.data._id,
            walletError.message || "Wallet payment failed"
          );
          return apiResponse(res, false, walletError.message || "Wallet payment failed");
        }
      }

      return apiResponse(res, true, "Order created successfully", result.data);
    } catch (error: any) {
      console.error("Create order error:", error);
      return apiResponse(res, false, error.message || "Failed to create order");
    }
  };

  getOrder = async (req: any, res: Response) => {
    try {
      const result = await orderService.getOrder(req.params.id, req.user._id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch order");
    }
  };

  getMyOrders = async (req: any, res: Response) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await orderService.getUserOrders(req.user._id, page, limit);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch orders");
    }
  };

  markAsPaid = async (req: any, res: Response) => {
    try {
      const { reference } = req.body;
      if (!reference) {
        return apiResponse(res, false, "Payment reference is required");
      }
      const result = await orderService.markAsPaid(req.params.id, reference);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to mark order as paid");
    }
  };
}