import { Response } from "express";

import { CartService } from "./cart.service";
import { apiResponse } from "../../../utils/apiResponse";


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
}