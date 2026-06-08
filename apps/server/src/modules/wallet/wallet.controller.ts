import { Response } from "express";
import { WalletService } from "./wallet.service";
import { apiResponse } from "../../utils/apiResponse";

export class WalletController {
  private service = new WalletService();

  getWallet = async (req: any, res: Response) => {
    const wallet = await this.service.getWallet(req.user.userId);
    return apiResponse(res, true, "Wallet fetched", wallet);
  };

  fundWallet = async (req: any, res: Response) => {
    const result = await this.service.initializeFunding(
      req.user.userId,
      req.user.email,
      req.body.amount
    );
    return apiResponse(res, true, "Funding initialized", result);
  };

  verifyFunding = async (req: any, res: Response) => {
    const result = await this.service.verifyFunding(req.query.reference as string);
    return apiResponse(res, true, "Funding verified", result);
  };

  withdraw = async (req: any, res: Response) => {
    const result = await this.service.withdraw(
      req.user.userId,
      req.body.amount,
      req.body.bankDetails
    );
    return apiResponse(res, true, "Withdrawal initiated", result);
  };

  getTransactions = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const transactions = await this.service.getTransactions(req.user.userId, page, limit);
    return apiResponse(res, true, "Transactions fetched", transactions);
  };
}