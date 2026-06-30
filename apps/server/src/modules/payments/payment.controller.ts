import crypto from "crypto";
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { OrderService } from "../market/orders/order.service";
import { apiResponse } from "../../utils/apiResponse";
import { WalletService } from "../wallet/wallet.service";
const paymentService = new PaymentService();
const orderService = new OrderService();
const walletService = new WalletService();

export class PaymentController {
  initializePayment = async (req: any, res: Response) => {
    try {
      const { email, amount, goalId, goalType, goalName, purpose } = req.body;

      if (!email || !amount) {
        return apiResponse(res, false, "Email and amount are required");
      }

      if (amount < 100) {
        return apiResponse(res, false, "Minimum payment amount is ₦100");
      }

      // Build metadata based on purpose
      let metadata: any = {
        userId: req.user?._id,
        userEmail: email,
        timestamp: new Date().toISOString(),
      };

      // If it's a goal contribution
      if (goalId) {
        metadata = {
          ...metadata,
          savingsGoalContribution: JSON.stringify({
            goalId: goalId,
            goalType: goalType || "individual",
            goalName: goalName || "",
            purpose: purpose || "savings_contribution",
            paymentReference: `PAY_${Date.now()}`,
          }),
          goalContribution: true,
        };
      } else {
        metadata = {
          ...metadata,
          fundWallet: true,
          purpose: "wallet_funding",
        };
      }

      const result = await paymentService.initializePayment(
        email,
        amount,
        metadata
      );

      if (result.success) {
        return apiResponse(
          res,
          true,
          "Payment initialized successfully",
          result.data
        );
      } else {
        return apiResponse(
          res,
          false,
          result.message || "Failed to initialize payment"
        );
      }
    } catch (error: any) {
      console.error("Initialize payment error:", error);
      return apiResponse(
        res,
        false,
        error.message || "Failed to initialize payment"
      );
    }
  };

  // Verify payment
  verifyPayment = async (req: Request, res: Response) => {
    try {
      const { reference } = req.params;

      if (!reference) {
        return apiResponse(res, false, "Payment reference is required");
      }

      const result = await paymentService.verifyPayment(reference as string);

      if (result.success) {
        // Check if payment was successful
        if (result.data.status === "success") {
          // Update order status if metadata contains orderId
          if (result.data.metadata?.orderId) {
            await orderService.markAsPaid(
              result.data.metadata.orderId,
              reference as string
            );
          }

          // Credit user's wallet if metadata contains wallet funding
          if (
            result.data.metadata?.fundWallet &&
            result.data.metadata?.userId
          ) {
            await walletService.credit(
              result.data.metadata.userId,
              result.data.amount,
              `WALLET_FUND_${reference}`
            );
          }
        }

        return apiResponse(
          res,
          true,
          "Payment verified successfully",
          result.data
        );
      } else {
        return apiResponse(
          res,
          false,
          result.message || "Failed to verify payment"
        );
      }
    } catch (error: any) {
      console.error("Verify payment error:", error);
      return apiResponse(
        res,
        false,
        error.message || "Failed to verify payment"
      );
    }
  };
}
