import crypto from 'crypto'
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { OrderService } from "../market/orders/order.service";
import { apiResponse } from "../../utils/apiResponse";
import { WalletService } from "../wallet/wallet.service";
import { OrderModel, OrderStatus } from "../market/orders/order.model";
import { ProductModel } from "../market/products/product.model";
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

  // Webhook handler
  handleWebhook = async (req: Request, res: Response) => {
    try {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      const signature = req.headers["x-paystack-signature"];

      // ✅ Ensure raw body for signature verification (middleware must provide rawBody)
      const hash = crypto
        .createHmac("sha512", secret!)
        .update(req.body) // raw body, not parsed JSON
        // .update(req.rawBody) // raw body, not parsed JSON
        .digest("hex");

      if (hash !== signature) {
        return res.status(401).send("Unauthorized: Invalid signature");
      }
      const event = JSON.parse(req.body.toString());
      if (!event?.event || !event?.data) return res.sendStatus(200);

      console.log("Paystack Webhook Event:", event.event);

      // ends

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

    console.log(`✅ Charge successful: ${reference}`);

    // Check if this is an order payment
    if (metadata?.orderId) {
      // Find the order
      const order = await OrderModel.findById(metadata.orderId);
      if (!order) {
        console.log(`❌ Order not found: ${metadata.orderId}`);
        return;
      }

      // Check if already paid
      if (order.status === "PAID") {
        console.log(`⚠️ Order ${metadata.orderId} already paid`);
        return;
      }

      // Update order status
      order.status = OrderStatus.PAID;
      order.paymentReference = reference;
      order.paidAt = new Date();
      await order.save();

      // Update product stock
      for (const item of order.items) {
        await ProductModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity, salesCount: item.quantity },
        });
      }

      console.log(`✅ Order ${metadata.orderId} marked as paid`);

      // Send notification to user
      // await notificationService.create(
      //   order.userId,
      //   "Payment Successful",
      //   `Your order #${order._id} has been paid successfully.`
      // );
    }

    // Handle wallet funding
    if (metadata?.fundWallet && metadata?.userId) {
      await walletService.credit(
        metadata.userId,
        amount / 100,
        `WALLET_FUND_${reference}`
      );
      console.log(`✅ Wallet funded for user ${metadata.userId}`);
    }
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
