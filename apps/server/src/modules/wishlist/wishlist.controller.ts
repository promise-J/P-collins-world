import { Response } from "express";
import { WishlistService } from "./wishlist.service";
import { apiResponse } from "../../utils/apiResponse";

export class WishlistController {
  private service = new WishlistService();

  getWishlist = async (req: any, res: Response) => {
    try {
      const result = await this.service.getWishlist(req.user._id);
      return apiResponse(res, result.success, result.message, result.data);

    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch wishlist");
    }
  };

  addToWishlist = async (req: any, res: Response) => {
    try {
      const result = await this.service.addToWishlist(
        req.user._id,
        req.params.productId
      );
      return apiResponse(res, result.success, result.message, result.data);

    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to add to wishlist");
    }
  };

  removeFromWishlist = async (req: any, res: Response) => {
    try {
      const result = await this.service.removeFromWishlist(
        req.user._id,
        req.params.productId
      );
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to remove from wishlist");
    }
  };

  clearWishlist = async (req: any, res: Response) => {
    try {
      const result = await this.service.clearWishlist(req.user._id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to clear wishlist");
    }
  };

  checkInWishlist = async (req: any, res: Response) => {
    try {
      const result = await this.service.checkInWishlist(
        req.user._id,
        req.params.productId
      );
      return apiResponse(res, result.success,result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to check wishlist status");
    }
  };

  getWishlistCount = async (req: any, res: Response) => {
    try {
      const result = await this.service.getWishlistCount(req.user._id);
      return apiResponse(res, result.success, result.message, { count: result.data });
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to get wishlist count");
    }
  };
}