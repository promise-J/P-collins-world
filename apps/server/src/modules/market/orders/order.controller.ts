import { Response } from "express";

import { OrderService } from "./order.service";
import { apiResponse } from "../../../utils/apiResponse";


export class OrderController {
  private service = new OrderService();

  createFromCart = async (req: any, res: Response) => {
    const result = await this.service.createOrderFromCart(
      req.user._id
    );

    return apiResponse(res, result.success, result.message, result.data);
  };

  getMyOrders = async (req: any, res: Response) => {
    const result = await this.service.getUserOrders(req.user._id);

    return apiResponse(res, result.success, result.message, result.data);
  };

  markAsPaid = async (req: any, res: Response) => {
    const result = await this.service.markAsPaid(
      req.params.id,
      req.body.reference
    );

    return apiResponse(res, result.success, result.message, result.data);
  };
}