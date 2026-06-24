import { WalletModel } from "./wallet.model";
import { TransactionModel, TransactionStatus, TransactionType } from "./transaction.model";
import { serviceResponse } from "@/utils/apiResponse";
import { PaymentService } from "../payments/payment.service";

export class WalletService {
  private paystack = new PaymentService();

  async getWallet(userId: string) {
    let wallet = await WalletModel.findOne({ userId });

    if (!wallet) {
      wallet = await WalletModel.create({ userId, balance: 0, pendingBalance: 0 });
    }

    const transactions = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return serviceResponse(true, 'Wallet transactions fetched', { wallet, transactions });
  }

  async initializeFunding(userId: string, email: string, amount: number) {
    if (amount < 100) return serviceResponse(false, "Minimum funding amount is ₦100");

    const payment = await this.paystack.initializePayment(email, amount);

    // Create pending transaction
    const transaction = await TransactionModel.create({
      userId,
      type: TransactionType.CREDIT,
      amount,
      reference: payment.data.reference,
      status: TransactionStatus.PENDING,
      metadata: { accessCode: payment.data.access_code }
    });

    return serviceResponse(true, 'Attempt to fund successful', {
      authorizationUrl: payment.data.authorization_url,
      reference: payment.data.reference,
      transactionId: transaction._id
    });
  }

  // async verifyFunding(reference: string) {
  //   const transaction = await TransactionModel.findOne({ reference });
  //   if (!transaction) return serviceResponse(false, "Transaction not found");

  //   if (transaction.status === TransactionStatus.SUCCESS) {
  //     return serviceResponse(false, "Transaction already verified");
  //   }

  //   // Verify with Paystack
  //   transaction.status = TransactionStatus.SUCCESS;
  //   await transaction.save();

  //   // Update wallet balance
  //   const wallet = await WalletModel.findOne({ userId: transaction.userId });
  //   if (wallet) {
  //     wallet.balance += transaction.amount;
  //     await wallet.save();
  //   }

  //   return serviceResponse(true, 'Funding verified', transaction);
  // }

  async credit(userId: string, amount: number, reference: string, metadata?: any) {
    // ✅ Get the actual wallet document
    const wallet = await this.getOrCreateWallet(userId);

    const transaction = await TransactionModel.create({
      walletId: wallet._id,
      userId,
      type: TransactionType.CREDIT,
      amount,
      reference,
      status: TransactionStatus.SUCCESS,
      metadata
    });

    // Update balance
    wallet.balance += amount;
    await wallet.save();

    return serviceResponse(true, 'Credit successful', transaction);
  }

  async debit(userId: string, amount: number, reference: string, metadata?: any) {
    // ✅ Get the actual wallet document
    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      return serviceResponse(false, "Insufficient balance");
    }

    const transaction = await TransactionModel.create({
      walletId: wallet._id,
      userId,
      type: TransactionType.DEBIT,
      amount,
      reference,
      status: TransactionStatus.SUCCESS,
      metadata
    });

    // Update balance
    wallet.balance -= amount;
    await wallet.save();

    return serviceResponse(true, 'Debit successful', transaction);
  }

  async withdraw(userId: string, amount: number, bankDetails: any) {
    // ✅ Get the actual wallet document
    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      return serviceResponse(false, "Insufficient balance");
    }

    const transaction = await TransactionModel.create({
      walletId: wallet._id,
      userId,
      type: TransactionType.DEBIT,
      amount,
      reference: `WITHDRAW-${Date.now()}`,
      status: TransactionStatus.PENDING,
      metadata: { bankDetails, withdrawalRequest: true }
    });

    // Deduct from balance immediately
    wallet.balance -= amount;
    wallet.pendingBalance += amount;
    await wallet.save();

    return serviceResponse(true, 'Withdrawal initiated', transaction);
  }

  async getTransactions(userId: string, page: number = 1, limit: number = 20) {
    const transactions = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await TransactionModel.countDocuments({ userId });

    return serviceResponse(true, 'Transactions fetched', {
      data: transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  }

  // ✅ FIX: Return the wallet document directly, not serviceResponse
  private async getOrCreateWallet(userId: string) {
    let wallet = await WalletModel.findOne({ userId });

    if (!wallet) {
      wallet = await WalletModel.create({ userId, balance: 0, pendingBalance: 0 });
    }

    // ✅ Return the wallet document directly
    return wallet;
  }
}