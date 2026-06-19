import { Response } from "express";
import { CouponService } from "./coupon.service";
import { CouponModel } from "./coupon.model";
import { apiResponse } from "../../../utils/apiResponse";

export class CouponController {
  private service = new CouponService();

  validateCoupon = async (req: any, res: Response) => {
    const { code, orderAmount } = req.body;
    const result = await this.service.validateCoupon(code, orderAmount);
    return apiResponse(res, result.success, result.message, result.data);
  };

  createCoupon = async (req: any, res: Response) => {
    const result = await CouponModel.create(req.body);
    return apiResponse(res, true, 'Coupon created', result);
  };

  listCoupons = async (req: any, res: Response) => {
    const result = await CouponModel.find().sort({ createdAt: -1 });
    return apiResponse(res, true, 'Coupon fetched', result);
  };

  updateCoupon = async (req: any, res: Response) => {
    const result = await CouponModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return apiResponse(res, true, 'Coupon updated');
  };

  deleteCoupon = async (req: any, res: Response) => {
    const result = await CouponModel.findByIdAndDelete(req.params.id);
    return apiResponse(res, true, 'Coupon deleted');
  };
}