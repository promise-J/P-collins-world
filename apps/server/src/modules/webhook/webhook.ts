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
import { SavingsPlanModel } from "../savings/saving-plan.model";
import { SavingsGroupModel } from "../savings/saving-group.model";

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

    // Handle Wallet Funding
    if (
      (metadata?.fundWallet === true || metadata?.fundWallet === "true") &&
      metadata?.userId
    ) {
      try {
        const userObjectId = new Types.ObjectId(metadata.userId);
        const amountInNaira = amount / 100;

        // Find or create wallet
        let wallet = await WalletModel.findOne({ userId: userObjectId });
        if (wallet) {
          wallet.balance += amountInNaira;
          await wallet.save();
        } else {
          wallet = await WalletModel.create({
            userId: metadata.userId,
            balance: amountInNaira,
            pendingBalance: 0,
          });
        }

        // Create transaction record
        const transaction = await TransactionModel.create({
          walletId: wallet._id,
          userId: metadata.userId,
          type: TransactionType.CREDIT,
          amount: amountInNaira,
          reference: `WALLET_FUND_${reference}`,
          status: TransactionStatus.SUCCESS,
          metadata: {
            originalReference: reference,
            paidAt: new Date().toISOString(),
            source: "paystack",
          },
        });

        console.log(
          `✅ Wallet funded: ${amountInNaira} for user ${metadata.userId}`
        );

        // Check if this funding was for a savings goal contribution
        if (metadata?.savingsGoalContribution) {
          try {
            const contributionData = JSON.parse(
              metadata.savingsGoalContribution
            );
            await this.processSavingsGoalContribution(
              userObjectId,
              amountInNaira,
              contributionData
            );
          } catch (parseError) {
            console.error(
              "Failed to parse savings goal contribution metadata:",
              parseError
            );
          }
        }
      } catch (error) {
        console.error(
          `❌ Failed to process wallet funding for user ${metadata.userId}:`,
          error
        );
      }
      return;
    }

    // Handle Order Payment
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
      return;
    }

    // Handle Direct Savings Goal Contribution (without wallet funding)
    if (metadata?.savingsGoalContribution && metadata?.userId) {
      try {
        const userObjectId = new Types.ObjectId(metadata.userId);
        const amountInNaira = amount / 100;
        const contributionData = JSON.parse(metadata.savingsGoalContribution);

        await this.processSavingsGoalContribution(
          userObjectId,
          amountInNaira,
          contributionData
        );
      } catch (error) {
        console.error("Failed to process savings goal contribution:", error);
      }
      return;
    }

    console.log(`⚠️ Unhandled charge success for reference: ${reference}`);
  }

  private async processSavingsGoalContribution(
    userId: Types.ObjectId,
    amount: number,
    contributionData: {
      goalId?: string;
      goalType: "individual" | "group";
      goalName?: string;
    }
  ) {
    const { goalId, goalType, goalName } = contributionData;

    if (goalType === "individual") {
      // Individual Savings Plan
      const savingsPlan = await SavingsPlanModel.findOne({
        _id: goalId,
        userId: userId,
        isCompleted: false,
      });

      if (!savingsPlan) {
        console.log(
          `❌ Savings plan not found or already completed: ${goalId}`
        );
        return;
      }

      const newAmount = savingsPlan.currentAmount + amount;
      if (newAmount > (savingsPlan?.targetAmount ?? 0)) {
        const target = savingsPlan?.targetAmount ?? 0;
        const current = savingsPlan?.currentAmount ?? 0;

        const adjustedAmount = target - current;

        savingsPlan.currentAmount = target;
        savingsPlan.isCompleted = true;

        console.log(
          `⚠️ Contribution adjusted from ${amount} to ${adjustedAmount} to match target`
        );
      } else {
        savingsPlan.currentAmount = newAmount;
        if (newAmount === savingsPlan.targetAmount) {
          savingsPlan.isCompleted = true;
        }
      }

      await savingsPlan.save();

      // Create contribution record if you have a Contributions model
      await this.createContributionRecord({
        userId,
        goalId: savingsPlan._id,
        goalType: "individual",
        amount: Math.min(
          amount,
          (savingsPlan?.targetAmount ?? 0) -
            (savingsPlan.currentAmount - amount)
        ),
        reference: `SAVINGS_CONTRIB_${Date.now()}`,
        paymentReference: (contributionData as any)?.paymentReference,
      });

      console.log(
        `✅ Contribution added to savings plan ${savingsPlan._id}. ` +
          `New balance: ${savingsPlan.currentAmount}/${savingsPlan.targetAmount}`
      );
    } else if (goalType === "group") {
      // Group Savings
      const group = await SavingsGroupModel.findOne({
        _id: goalId,
        "members.userId": userId,
      });

      if (!group) {
        console.log(
          `❌ Group savings not found or user not a member: ${goalId}`
        );
        return;
      }

      // Check if contribution would exceed target
      const newAmount = group.currentAmount + amount;
      if (newAmount > (group?.targetAmount ?? 0)) {
        const targetAmount = group?.targetAmount ?? 0;
        const currentAmount = group?.currentAmount ?? 0;
        const adjustedAmount = targetAmount - currentAmount;
        group.currentAmount = targetAmount;

        console.log(
          `⚠️ Group contribution adjusted from ${amount} to ${adjustedAmount} to match target`
        );
      } else {
        group.currentAmount = newAmount;
      }

      await group.save();

      // Create contribution record
      await this.createContributionRecord({
        userId,
        goalId: group._id,
        goalType: "group",
        amount: Math.min(
          amount,
          (group?.targetAmount ?? 0) - (group.currentAmount - amount)
        ),
        reference: `GROUP_CONTRIB_${Date.now()}`,
        paymentReference: (contributionData as any)?.paymentReference,
      });

      console.log(
        `✅ Contribution added to group savings ${group._id}. ` +
          `New balance: ${group.currentAmount}/${group.targetAmount}`
      );
    }
  }

  private async createContributionRecord(data: {
    userId: Types.ObjectId;
    goalId: Types.ObjectId;
    goalType: "individual" | "group";
    amount: number;
    reference: string;
    paymentReference?: string;
  }) {
    console.log("Contribution record:", data);
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
