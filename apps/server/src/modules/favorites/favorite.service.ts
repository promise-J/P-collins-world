import { FavoriteModel } from "./favorite.model";
import { PropertyModel } from "../properties/property.model";
import { serviceResponse } from "@/utils/apiResponse";

export class FavoriteService {
  async addFavorite(userId: string, propertyId: string) {
    const property = await PropertyModel.findById(propertyId);
    if (!property) return serviceResponse(false, "Property not found");

    const existing = await FavoriteModel.findOne({ userId, propertyId });
    if (existing) return serviceResponse(true, 'Property already Added to favorite', existing);

    await FavoriteModel.create({ userId, propertyId, itemType: 'property' });
    return serviceResponse(true, 'Property added to favorite')
  }

  async removeFavorite(userId: string, propertyId: string) {
    await FavoriteModel.findOneAndDelete({ userId, propertyId });
    return serviceResponse(true, 'Property added to favorite')
  }

  async getUserFavorites(userId: string, page: number = 1, limit: number = 10) {
    const favorites = await FavoriteModel.find({ userId, itemType: 'property' })
      .populate("propertyId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await FavoriteModel.countDocuments({ userId, itemType: 'property' });

    return serviceResponse(true, 'Favorite fetched', {
      data: favorites,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  }

  async isFavorited(userId: string, propertyId: string) {
    const fav = await FavoriteModel.findOne({ userId, propertyId });
    return serviceResponse(true, 'Favorite check', !!fav);
  }

  async getFavoriteCount(propertyId: string) {
    const count = await FavoriteModel.countDocuments({ propertyId, itemType: 'property' });
    return serviceResponse(true, 'Favorite fetched', count)
  }
}