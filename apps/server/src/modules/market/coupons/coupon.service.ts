import { ApiError } from "@/utils/apiError";
import { CouponModel } from "./coupon.model";
import { serviceResponse } from "@/utils/apiResponse";


export class CouponService {
  async validateCoupon(code: string, orderAmount: number) {
    const coupon = await CouponModel.findOne({ code });

    if (!coupon || !coupon.isActive) {
      return serviceResponse(false, "Invalid coupon");
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return serviceResponse(false, "Coupon expired");
    }

    if (orderAmount < coupon.minOrderAmount) {
      return serviceResponse(false, "Order too small for coupon");
    }

    if (
      coupon.maxUsage &&
      coupon.usedCount >= coupon.maxUsage
    ) {
      return serviceResponse(false, "Coupon exhausted");
    }

    let discount = 0;

    if (coupon.type === "FIXED") {
      discount = coupon.value as number;
    } else {
      discount = (orderAmount * (coupon.value ?? 1)) / 100;
    }

    return serviceResponse(true, 'Coupon is valid', {
      discount,
      finalAmount: orderAmount - discount
    });
  }

  async incrementUsage(code: string) {
    await CouponModel.updateOne(
      { code },
      { $inc: { usedCount: 1 } }
    );

    return serviceResponse(true, 'Coupon updated')
  }
}