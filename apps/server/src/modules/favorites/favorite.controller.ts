import { Response } from "express";
import { FavoriteService } from "./favorite.service";
import { apiResponse } from "../../utils/apiResponse";

export class FavoriteController {
  private service = new FavoriteService();

  addFavorite = async (req: any, res: Response) => {
    const result = await this.service.addFavorite(
      req.user._id,
      req.params.propertyId
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  removeFavorite = async (req: any, res: Response) => {
    const result = await this.service.removeFavorite(
      req.user._id,
      req.params.propertyId
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  getMyFavorites = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await this.service.getUserFavorites(req.user._id, page, limit);
    return apiResponse(res, result.success, result.message, result.data);

  };

  isFavorited = async (req: any, res: Response) => {
    const result = await this.service.isFavorited(
      req.user._id,
      req.params.propertyId
    );
    return apiResponse(res, result.success, result.message, { isFavorited: result.data });
  };
}