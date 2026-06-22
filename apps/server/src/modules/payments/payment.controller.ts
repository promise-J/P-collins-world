import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { OrderService } from "../market/orders/order.service";
import { apiResponse } from "../../utils/apiResponse";
import { WalletService } from "../wallet/wallet.service";

const paymentService = new PaymentService();
const orderService = new OrderService();
const walletService = new WalletService();

export class PaymentController {
  // Initialize payment
  initializePayment = async (req: any, res: Response) => {
    try {
      const { email, amount, metadata } = req.body;

      if (!email || !amount) {
        return apiResponse(res, false, "Email and amount are required");
      }

      if (amount < 100) {
        return apiResponse(res, false, "Minimum payment amount is ₦100");
      }

      const result = await paymentService.initializePayment(email, amount, {
        ...metadata,
        userId: req.user?._id,
      });

      if (result.success) {
        return apiResponse(res, true, "Payment initialized successfully", result.data);
      } else {
        return apiResponse(res, false, result.message || "Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Initialize payment error:", error);
      return apiResponse(res, false, error.message || "Failed to initialize payment");
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
            await orderService.markAsPaid(result.data.metadata.orderId, reference as string);
          }

          // Credit user's wallet if metadata contains wallet funding
          if (result.data.metadata?.fundWallet && result.data.metadata?.userId) {
            await walletService.credit(
              result.data.metadata.userId,
              result.data.amount,
              `WALLET_FUND_${reference}`
            );
          }
        }

        return apiResponse(res, true, "Payment verified successfully", result.data);
      } else {
        return apiResponse(res, false, result.message || "Failed to verify payment");
      }
    } catch (error: any) {
      console.error("Verify payment error:", error);
      return apiResponse(res, false, error.message || "Failed to verify payment");
    }
  };

  // Webhook handler
  handleWebhook = async (req: Request, res: Response) => {
    try {
      const signature = req.headers["x-paystack-signature"] as string;
      const payload = JSON.stringify(req.body);

      // Verify webhook signature
      const isValid = paymentService.verifyWebhookSignature(payload, signature);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid signature" });
      }

      const event = req.body;

      console.log("Paystack Webhook Event:", event.event);

      switch (event.event) {
        case "charge.success":
          await this.handleChargeSuccess(event.data);
          break;

        case "charge.failed":
          await this.handleChargeFailed(event.data);
          break;

        case "transfer.success":
          await this.handleTransferSuccess(event.data);
          break;

        case "transfer.failed":
          await this.handleTransferFailed(event.data);
          break;

        default:
          console.log("Unhandled webhook event:", event.event);
      }

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  private async handleChargeSuccess(data: any) {
    const { reference, metadata, amount } = data;

    console.log(`Charge successful: ${reference}`);

    // Update order if metadata contains orderId
    if (metadata?.orderId) {
      await orderService.markAsPaid(metadata.orderId, reference);
    }

    // Fund wallet if metadata indicates wallet funding
    if (metadata?.fundWallet && metadata?.userId) {
      await walletService.credit(
        metadata.userId,
        amount / 100,
        `WALLET_FUND_${reference}`
      );
    }

    // You can also send notifications here
    // await notificationService.create(userId, "Payment Successful", "Your payment was successful");
  }

  private async handleChargeFailed(data: any) {
    const { reference, metadata } = data;
    console.log(`Charge failed: ${reference}`);

    // Update order status to failed if metadata contains orderId
    if (metadata?.orderId) {
      // await orderService.markAsFailed(metadata.orderId, "Payment failed");
    }
  }

  private async handleTransferSuccess(data: any) {
    const { reference, amount, recipient } = data;
    console.log(`Transfer successful: ${reference}`);

    // Update withdrawal status
    // await withdrawalService.markAsCompleted(reference);
  }

  private async handleTransferFailed(data: any) {
    const { reference, reason } = data;
    console.log(`Transfer failed: ${reference} - ${reason}`);
  }
}