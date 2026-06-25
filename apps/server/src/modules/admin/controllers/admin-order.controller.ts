import { Response } from "express";
import { AdminOrderService } from "../services/admin-order.service";
import { apiResponse } from "../../../utils/apiResponse";

const adminOrderService = new AdminOrderService();

export class AdminOrderController {
  getAllOrders = async (req: any, res: Response) => {
    try {
      const result = await adminOrderService.getAllOrders(req.query);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch orders");
    }
  };

  getOrderDetails = async (req: any, res: Response) => {
    try {
      const result = await adminOrderService.getOrderDetails(req.params.id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch order");
    }
  };

  updateOrderStatus = async (req: any, res: Response) => {
    try {
      const { status, note } = req.body;
      const result = await adminOrderService.updateOrderStatus(
        req.params.id,
        status,
        req.user._id,
        note
      );
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to update order status");
    }
  };

  updateTrackingNumber = async (req: any, res: Response) => {
    try {
      const { trackingNumber } = req.body;
      const result = await adminOrderService.updateTrackingNumber(
        req.params.id,
        trackingNumber,
        req.user._id
      );
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to update tracking number");
    }
  };

  addAdminNote = async (req: any, res: Response) => {
    try {
      const { note } = req.body;
      const result = await adminOrderService.addAdminNote(
        req.params.id,
        note,
        req.user._id
      );
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to add admin note");
    }
  };

  getOrderStats = async (req: any, res: Response) => {
    try {
      const result = await adminOrderService.getOrderStats();
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch order stats");
    }
  };
}