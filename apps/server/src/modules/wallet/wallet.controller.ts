import { Response } from "express";
import { WalletService } from "./wallet.service";
import { apiResponse } from "../../utils/apiResponse";

export class WalletController {
  private service = new WalletService();

  getWallet = async (req: any, res: Response) => {
    const result = await this.service.getWallet(req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  fundWallet = async (req: any, res: Response) => {
    const result = await this.service.initializeFunding(
      req.user._id,
      req.user.email,
      req.body.amount
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  verifyFunding = async (req: any, res: Response) => {
    const result = await this.service.verifyFunding(req.query.reference as string);
    return apiResponse(res, result.success, result.message, result.data);
  };

  withdraw = async (req: any, res: Response) => {
    const result = await this.service.withdraw(
      req.user._id,
      req.body.amount,
      req.body.bankDetails
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  getTransactions = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const result = await this.service.getTransactions(req.user._id, page, limit);
    return apiResponse(res, result.success, result.message, result.data);
  };
}