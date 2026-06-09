import { Response } from "express";

import { OrderService } from "./order.service";
import { apiResponse } from "../../../utils/apiResponse";


export class OrderController {
  private service = new OrderService();

  createFromCart = async (req: any, res: Response) => {
    const order = await this.service.createOrderFromCart(
      req.user.userId
    );

    return apiResponse(res, true, "Order created", order);
  };

  getMyOrders = async (req: any, res: Response) => {
    const orders = await this.service.getUserOrders(req.user.userId);

    return apiResponse(res, true, "Orders fetched", orders);
  };

  markAsPaid = async (req: any, res: Response) => {
    const order = await this.service.markAsPaid(
      req.params.id,
      req.body.reference
    );

    return apiResponse(res, true, "Order updated", order);
  };
}