import { Response, Request } from "express";

import { CartService } from "./cart.service";
import { apiResponse } from "../../../utils/apiResponse";
import { Types } from "mongoose";

export class CartController {
  private service = new CartService();

  addToCart = async (req: any, res: Response) => {
    const result = await this.service.addToCart(
      req.user._id,
      req.body.productId,
      req.body.quantity,
      req.body.price
    );

    return apiResponse(res, result.success, result.message, result.data);
  };

  getCart = async (req: any, res: Response) => {
    const result = await this.service.getCart(req.user._id);

    return apiResponse(res, result.success, result.message, result.data);
  };

  clearCart = async (req: any, res: Response) => {
    const result = await this.service.clearCart(req.user._id);

    return apiResponse(res, result.success, result.message, result.data);
  };

  removeItem = async (req: any, res: Response) => {
    const { productId } = req.params;

    if (!productId) {
      return apiResponse(res, false, "Product ID is required");
    }

    const result = await this.service.removeItem(req.user._id, productId);
    return apiResponse(res, result.success, result.message, result.data);
  };
  updateQuantity = async (req: any, res: Response) => {
    const productId = req.params.productId as string;
    const { quantity } = req.body;

    if (!productId) {
      return apiResponse(res, false, "Product ID is required");
    }
    
    if (quantity === undefined || quantity < 0) {
      return apiResponse(res, false, "Valid quantity is required");
    }


    const result = await this.service.updateQuantity(
      req.user && req.user._id ? req.user._id.toString() : "",
      productId,
      quantity
    );


    return apiResponse(res, result.success, result.message, result.data);
  };

  getCartCount = async (req: any, res: Response) => {
    const result = await this.service.getCartCount(req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };
}
