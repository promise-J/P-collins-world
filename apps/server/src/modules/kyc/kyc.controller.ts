import { Request, Response } from "express";

import { KYCService } from "./kyc.service";
import { apiResponse } from "../../utils/apiResponse";

export class KYCController {
  private service = new KYCService();

  submit = async (req: any, res: Response) => {
    const kyc = await this.service.submitKyc(
      req.user._id,
      req.body
    );

    return apiResponse(res, true, "KYC submitted", kyc);
  };

  review = async (req: any, res: Response) => {
    const kyc = await this.service.reviewKyc(
      req.params.id,
      req.body.status,
      req.user._id,
      req.body.reason
    );

    return apiResponse(res, true, "KYC reviewed", kyc);
  };
}