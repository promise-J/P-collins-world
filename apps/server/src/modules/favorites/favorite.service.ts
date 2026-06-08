import { FavoriteModel } from "./favorite.model";
import { PropertyModel } from "../properties/property.model";

export class FavoriteService {
  async addFavorite(userId: string, propertyId: string) {
    const property = await PropertyModel.findById(propertyId);
    if (!property) throw new Error("Property not found");

    const existing = await FavoriteModel.findOne({ userId, propertyId });
    if (existing) return existing;

    return FavoriteModel.create({ userId, propertyId });
  }

  async removeFavorite(userId: string, propertyId: string) {
    return FavoriteModel.findOneAndDelete({ userId, propertyId });
  }

  async getUserFavorites(userId: string, page: number = 1, limit: number = 10) {
    const favorites = await FavoriteModel.find({ userId })
      .populate("propertyId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await FavoriteModel.countDocuments({ userId });

    return {
      data: favorites,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async isFavorited(userId: string, propertyId: string) {
    const fav = await FavoriteModel.findOne({ userId, propertyId });
    return !!fav;
  }

  async getFavoriteCount(propertyId: string) {
    return FavoriteModel.countDocuments({ propertyId });
  }
}