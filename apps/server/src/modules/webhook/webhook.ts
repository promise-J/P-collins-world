import crypto from "crypto";
import { Request, Response } from "express";
import { WalletService } from "../wallet/wallet.service";
import { OrderModel, OrderStatus } from "../market/orders/order.model";
import { ProductModel } from "../market/products/product.model";

const walletService = new WalletService();

// Extend Express Request interface to recognize rawBody securely
interface AuthenticatedWebhookRequest extends Request {
  rawBody?: Buffer;
}

export class PaymentWebhookController {
  // Main Webhook entry point
  handleWebhook = async (req: AuthenticatedWebhookRequest, res: Response) => {
    try {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      const signature = req.headers["x-paystack-signature"];

      // 1. Guard against missing middleware rawBody capture
      const rawBody = req.rawBody;
      if (!rawBody) {
        console.error("❌ Webhook error: req.rawBody is missing. Ensure your express.json() config includes a verify fallback.");
        return res.status(500).json({ success: false, message: "Server configuration missing raw body parser." });
      }

      // 2. Validate cryptographic signature matching Paystack guidelines
      const hash = crypto
        .createHmac("sha512", secret!)
        .update(rawBody)
        .digest("hex");

      if (hash !== signature) {
        return res.status(401).send("Unauthorized: Invalid signature");
      }

      // 3. Extract the body data directly since express.json() already formatted it
      const event = req.body;
      if (!event?.event || !event?.data) return res.sendStatus(200);

      console.log("Paystack Webhook Event:", event.event);

      // 4. Delegate to appropriate event hander routines
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
      const order = await OrderModel.findById(metadata.orderId);
      if (!order) {
        console.log(`❌ Order not found: ${metadata.orderId}`);
        return;
      }

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
    }

    // Handle wallet funding
    if (metadata?.fundWallet && metadata?.userId) {
      await walletService.credit(
        metadata.userId,
        amount / 100, // Paystack amounts are in kobo, divide by 100 to save Naira
        `WALLET_FUND_${reference}`
      );
      console.log(`✅ Wallet funded for user ${metadata.userId}`);
    }
  }

  private async handleChargeFailed(data: any) {
    const { reference, metadata } = data;
    console.log(`Charge failed: ${reference}`);

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
