import { PropertyRepository } from "./property.repository";

import { ApiError } from "../../utils/apiError";
import { serviceResponse } from "@/utils/apiResponse";
import { toMongooseObjectId } from "@/utils/helper";
import { UserRole } from "@/enum/role.enum";
import { PropertyModel } from "./property.model";
import { FavoriteModel } from "../favorites/favorite.model";
import { RecentlyViewedModel } from "./recently-viewed.model";

export class PropertyService {
  private repo = new PropertyRepository();

  async createProperty(data: any, userId: string) {
    const result = await this.repo.create({
      ...data,
      landlordId: userId
    });
    console.log({result})
    return serviceResponse(true, 'Property created', result)
  }

  async getProperty(id: string) {

    const property = await this.repo.findById(id.toString());

    if (!property) {
      return serviceResponse(false, "Property not found");
    }

    await this.repo.incrementViews(id);

    return serviceResponse(true, 'Property fetched', property);
  }

  async listProperties(query: any) {
    const {
      page = 1,
      limit = 10,
      city,
      type,
      minPrice,
      maxPrice
    } = query;

    const filter: any = {};

    if (city) filter["location.city"] = city;

    if (type) filter.type = type;

    if (minPrice || maxPrice) {
      filter.price = {
        $gte: minPrice || 0,
        $lte: maxPrice || 999999999
      };
    }

    const result = await this.repo.findAll(filter, page, limit);
    return serviceResponse(true, 'Properties fetched', result)
  }

  async searchProperties(search: string) {
    const result = await this.repo.search(search);
    return serviceResponse(true, 'Properties fetched', result)
  }

  async updateProperty(
    id: string,
    userId: string,
    userRole: string,
    data: any,
  ) {
    const property = await this.repo.findById(id);

    if (!property) {
      return serviceResponse(false, "Property not found");
    }

    if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN && property?.landlordId?.toString() !== userId) {
      return serviceResponse(false, "Not authorized");
    }

    const result = await this.repo.update(id, data);
    return serviceResponse(true, 'Property updated', result)
  }

  async deleteProperty(id: string) {
    try {
      const property = await PropertyModel.findByIdAndDelete(id);
      if (!property) {
        return serviceResponse(false, "Property not found");
      }
      return serviceResponse(true, "Property deleted successfully");
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to delete property");
    }
  }

  // Approve property
  async approveProperty(id: string, adminId: string) {
    try {
      const property = await PropertyModel.findByIdAndUpdate(
        id,
        {
          approvalStatus: "approved",
          approvedBy: adminId,
          approvedAt: new Date(),
        },
        { new: true }
      );

      if (!property) {
        return serviceResponse(false, "Property not found");
      }

      return serviceResponse(true, "Property approved successfully", property);
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to approve property");
    }
  }

  // Reject property
  async rejectProperty(id: string, reason: string, adminId: string) {
    try {
      const property = await PropertyModel.findByIdAndUpdate(
        id,
        {
          approvalStatus: "rejected",
          rejectionReason: reason || "No reason provided",
          rejectedBy: adminId,
          rejectedAt: new Date(),
        },
        { new: true }
      );

      if (!property) {
        return serviceResponse(false, "Property not found");
      }

      return serviceResponse(true, "Property rejected", property);
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to reject property");
    }
  }

  // Favorites
  async getFavorites(userId: string) {
    try {
      const favorites = await FavoriteModel.find({ userId })
        .populate("propertyId")
        .sort({ createdAt: -1 });

      return serviceResponse(true, "Favorites fetched", favorites);
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to fetch favorites");
    }
  }

  async addFavorite(userId: string, propertyId: string) {
    try {
      const property = await PropertyModel.findById(propertyId);
      if (!property) {
        return serviceResponse(false, "Property not found");
      }

      const existing = await FavoriteModel.findOne({ userId, propertyId });
      if (existing) {
        return serviceResponse(true, "Already in favorites", existing);
      }

      const favorite = await FavoriteModel.create({ userId, propertyId });
      return serviceResponse(true, "Added to favorites", favorite);
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to add favorite");
    }
  }

  async removeFavorite(userId: string, propertyId: string) {
    try {
      const result = await FavoriteModel.findOneAndDelete({ userId, propertyId });
      if (!result) {
        return serviceResponse(false, "Favorite not found");
      }
      return serviceResponse(true, "Removed from favorites");
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to remove favorite");
    }
  }

  async checkFavorite(userId: string, propertyId: string) {
    try {
      const favorite = await FavoriteModel.findOne({ userId, propertyId });
      return serviceResponse(true, "Favorite status", { isFavorited: !!favorite });
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to check favorite status");
    }
  }

  // Recently viewed
  async getRecentlyViewed(userId: string) {
    try {
      const recentlyViewed = await RecentlyViewedModel.findOne({ userId })
        .populate("properties.propertyId")
        .sort({ "properties.viewedAt": -1 });

      return serviceResponse(true, "Recently viewed fetched", recentlyViewed);
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to fetch recently viewed");
    }
  }

  // Recommendations
  async getRecommendations(userId: string) {
    try {
      // Simple recommendation: Get featured properties not in user's favorites
      const favorites = await FavoriteModel.find({ userId }).select("propertyId");
      const favoriteIds = favorites.map(f => f.propertyId);

      const properties = await PropertyModel.find({
        _id: { $nin: favoriteIds },
        isFeatured: true,
        approvalStatus: "approved",
        isRemoved: false,
      })
        .limit(6)
        .populate("landlordId", "firstName lastName email");

      return serviceResponse(true, "Recommendations fetched", properties);
    } catch (error: any) {
      return serviceResponse(false, error.message || "Failed to fetch recommendations");
    }
  }
}