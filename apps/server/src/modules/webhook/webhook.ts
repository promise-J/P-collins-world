import crypto from "crypto";
import { Request, Response } from "express";
import { WalletService } from "../wallet/wallet.service";
import { OrderModel, OrderStatus } from "../market/orders/order.model";
import { ProductModel } from "../market/products/product.model";
import {
  TransactionModel,
  TransactionStatus,
  TransactionType,
} from "../wallet/transaction.model";
import { WalletModel } from "../wallet/wallet.model";
import { Types } from "mongoose";

const walletService = new WalletService();

// Extend Express Request interface to recognize rawBody securely
interface AuthenticatedWebhookRequest extends Request {
  rawBody?: Buffer;
}

export class PaymentWebhookController {
  handleWebhook = async (req: Request, res: Response) => {
    try {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      const signature = req.headers["x-paystack-signature"] as string;

      if (!req.body || Object.keys(req.body).length === 0) {
        console.error("❌ Webhook error: Empty request body received.");
        return res.status(400).json({ success: false, message: "Empty body" });
      }

      // Verify signature
      const hash = crypto
        .createHmac("sha512", secret!)
        .update(req.body)
        .digest("hex");

      if (hash !== signature) {
        console.warn("⚠️ Webhook unauthorized: Invalid signature mismatch.");
        return res.status(401).send("Unauthorized: Invalid signature");
      }

      const event = JSON.parse(req.body.toString());
      if (!event?.event || !event?.data) return res.sendStatus(200);

      console.log(`📨 Paystack Webhook Event: ${event.event}`, {
        reference: event.data.reference,
        amount: event.data.amount,
        metadata: event.data.metadata,
      });

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
          console.log(`ℹ️ Unhandled webhook event: ${event.event}`);
      }

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("❌ Webhook error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  private async handleChargeSuccess(data: any) {
    const { reference, metadata, amount } = data;

    console.log(`✅ Charge successful: ${reference}`, {
      amount: amount / 100,
      metadata,
    });

    if (
      (metadata?.fundWallet === true || metadata?.fundWallet === "true") &&
      metadata?.userId
    ) {
      try {
        const userObjectId = new Types.ObjectId(metadata.userId);

        let transactionFilter: any = {
          reference: reference,
          userId: userObjectId,
          type: TransactionType.CREDIT,
          status: TransactionStatus.PENDING,
        };

        let transaction = null

        // if (!transaction) {
        //   transactionFilter = {
        //     reference: metadata.reference || reference,
        //     userId: userObjectId,
        //   }

        //   transaction = await TransactionModel.findOne(transactionFilter);
        // }

        for (let attempt = 1; attempt <= 3; attempt++) {
            transaction = await TransactionModel.findOne(transactionFilter);
              
            if (!transaction) {
              transaction = await TransactionModel.findOne({ 
                reference: metadata.reference || reference,
                userId: userObjectId,
              });
            }
          
            if (transaction) {
              console.log(`✨ Transaction found on attempt #${attempt}`);
              break;
            }
          
            if (attempt < 3) {
              console.log(`⚠️ Attempt #${attempt} failed. Database might be busy. Retrying in 500ms...`);
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }

        const wallet = await WalletModel.findOne({ userId: userObjectId });
        if (wallet) {
          wallet.balance += amount / 100;
          await wallet.save();
          console.log(`✅ Wallet updated: ₦${wallet.balance}`);
        } else {
          const newWallet = await WalletModel.create({
            userId: metadata.userId,
            balance: amount / 100,
            pendingBalance: 0,
          });
          console.log(`✅ New wallet created: ₦${newWallet.balance}`);
        }
        console.log({ transaction });

        if (transaction) {
          transaction.status = TransactionStatus.SUCCESS;
          transaction.metadata = {
            ...transaction.metadata,
            paidAt: new Date().toISOString(),
            paymentReference: reference,
            webhookReceived: true,
          };
          await transaction.save();
          console.log(`✅ Transaction ${transaction._id} updated to SUCCESS`);
        } else {
          console.warn(
            `⚠️ Transaction not found for reference: ${reference}, creating new one`
          );
          transaction = await TransactionModel.create({
            walletId: wallet?._id,
            userId: metadata.userId,
            type: TransactionType.CREDIT,
            amount: amount / 100,
            reference: `WALLET_FUND_${reference}`,
            status: TransactionStatus.SUCCESS,
            metadata: {
              originalReference: reference,
              paidAt: new Date().toISOString(),
            },
          });
        }
      } catch (error) {
        console.error(
          `❌ Failed to process wallet funding for user ${metadata.userId}:`,
          error
        );
      }
      return;
    }

    if (metadata?.orderId) {
      const order = await OrderModel.findById(metadata.orderId);
      if (!order) {
        console.log(`❌ Order not found: ${metadata.orderId}`);
        return;
      }

      if (order.status === OrderStatus.PAID) {
        console.log(`⚠️ Order ${metadata.orderId} already paid`);
        return;
      }

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
  }

  private async handleChargeFailed(data: any) {
    const { reference, metadata } = data;
    console.log(`❌ Charge failed: ${reference}`, metadata);

    // Update transaction status if it exists
    if (metadata?.userId) {
      const transaction = await TransactionModel.findOne({
        userId: metadata.userId,
        reference: `WALLET_FUND_${reference}`,
      });
      if (transaction) {
        transaction.status = TransactionStatus.FAILED;
        await transaction.save();
        console.log(`❌ Transaction marked as failed: ${reference}`);
      }
    }

    if (metadata?.orderId) {
      // await orderService.markAsFailed(metadata.orderId, "Payment failed");
      console.log(`❌ Order ${metadata.orderId} marked as failed`);
    }
  }

  private async handleTransferSuccess(data: any) {
    const { reference, amount, recipient } = data;
    console.log(`✅ Transfer successful: ${reference}`, { amount, recipient });

    // Update withdrawal status
    // await withdrawalService.markAsCompleted(reference);
  }

  private async handleTransferFailed(data: any) {
    const { reference, reason } = data;
    console.log(`❌ Transfer failed: ${reference} - ${reason}`);
  }
}
