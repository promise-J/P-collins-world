import { Response } from "express";

import { CartService } from "./cart.service";
import { apiResponse } from "../../../utils/apiResponse";


export class CartController {
  private service = new CartService();

  addToCart = async (req: any, res: Response) => {
    const cart = await this.service.addToCart(
      req.user.userId,
      req.body.productId,
      req.body.quantity,
      req.body.price
    );

    return apiResponse(res, true, "Added to cart", cart);
  };

  getCart = async (req: any, res: Response) => {
    const cart = await this.service.getCart(req.user.userId);

    return apiResponse(res, true, "Cart fetched", cart);
  };

  clearCart = async (req: any, res: Response) => {
    await this.service.clearCart(req.user.userId);

    return apiResponse(res, true, "Cart cleared");
  };
}