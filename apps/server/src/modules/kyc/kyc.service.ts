import { KYCModel, KYCStatus } from "./kyc.model";

import { ApiError } from "../../utils/apiError";

export class KYCService {
  async submitKyc(userId: string, data: any) {
    const existing = await KYCModel.findOne({ userId });

    if (existing && existing.status === KYCStatus.PENDING) {
      throw new ApiError(400, "KYC already pending");
    }

    return KYCModel.create({
      userId,
      ...data,
      status: KYCStatus.PENDING
    });
  }

  async reviewKyc(
    kycId: string,
    status: KYCStatus,
    adminId: string,
    reason?: string
  ) {
    const kyc = await KYCModel.findById(kycId);

    if (!kyc) throw new ApiError(404, "KYC not found");

    kyc.status = status;
    kyc.reviewedBy = adminId as any;
    kyc.rejectionReason = reason;

    await kyc.save();

    return kyc;
  }
}