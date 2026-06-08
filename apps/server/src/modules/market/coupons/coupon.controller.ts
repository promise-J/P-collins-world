import { Response } from "express";
import { CouponService } from "./coupon.service";
import { CouponModel } from "./coupon.model";
import { apiResponse } from "../../../utils/apiResponse";

export class CouponController {
  private service = new CouponService();

  validateCoupon = async (req: any, res: Response) => {
    const { code, orderAmount } = req.body;
    const result = await this.service.validateCoupon(code, orderAmount);
    return apiResponse(res, true, "Coupon validated", result);
  };

  createCoupon = async (req: any, res: Response) => {
    const coupon = await CouponModel.create(req.body);
    return apiResponse(res, true, "Coupon created", coupon);
  };

  listCoupons = async (req: any, res: Response) => {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    return apiResponse(res, true, "Coupons fetched", coupons);
  };

  updateCoupon = async (req: any, res: Response) => {
    const coupon = await CouponModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return apiResponse(res, true, "Coupon updated", coupon);
  };

  deleteCoupon = async (req: any, res: Response) => {
    await CouponModel.findByIdAndDelete(req.params.id);
    return apiResponse(res, true, "Coupon deleted");
  };
}