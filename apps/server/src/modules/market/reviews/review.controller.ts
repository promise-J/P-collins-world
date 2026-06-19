import { Response } from "express";
import { ReviewService } from "./review.service";
import { apiResponse } from "../../../utils/apiResponse";

export class ReviewController {
  private service = new ReviewService();

  createReview = async (req: any, res: Response) => {
    const result = await this.service.createReview(
      req.user._id,
      req.params.productId,
      req.body.rating,
      req.body.comment
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  getProductReviews = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await this.service.getProductReviews(req.params.productId, page, limit);
    return apiResponse(res, result.success, result.message, result.data);
  };

  updateReview = async (req: any, res: Response) => {
    const result = await this.service.updateReview(
      req.params.id,
      req.user._id,
      req.body.rating,
      req.body.comment
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  deleteReview = async (req: any, res: Response) => {
    const isAdmin = req.user.role === "ADMIN" || req.user.role === "SUPER_ADMIN";
    const result = await this.service.deleteReview(req.params.id, req.user._id, isAdmin);
    return apiResponse(res, result.success, result.message);
  };

  getMyReviews = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await this.service.getUserReviews(req.user._id, page, limit);
    return apiResponse(res, result.success, result.message, result.data);
  };
}