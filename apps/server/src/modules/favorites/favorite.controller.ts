import { Response } from "express";
import { FavoriteService } from "./favorite.service";
import { apiResponse } from "../../utils/apiResponse";

export class FavoriteController {
  private service = new FavoriteService();

  addFavorite = async (req: any, res: Response) => {
    const result = await this.service.addFavorite(
      req.user.userId,
      req.params.propertyId
    );
    return apiResponse(res, true, "Added to favorites", result);
  };

  removeFavorite = async (req: any, res: Response) => {
    const result = await this.service.removeFavorite(
      req.user.userId,
      req.params.propertyId
    );
    return apiResponse(res, true, "Removed from favorites", result);
  };

  getMyFavorites = async (req: any, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const favorites = await this.service.getUserFavorites(req.user.userId, page, limit);
    return apiResponse(res, true, "Favorites fetched", favorites);
  };

  isFavorited = async (req: any, res: Response) => {
    const isFav = await this.service.isFavorited(
      req.user.userId,
      req.params.propertyId
    );
    return apiResponse(res, true, "Favorite status", { isFavorited: isFav });
  };
}