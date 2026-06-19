
import { serviceResponse } from "@/utils/apiResponse";
import { FavoriteModel } from "../favorites/favorite.model";
import { ProductModel } from "../market/products/product.model";

export class WishlistService {
  async getWishlist(userId: string) {
    const wishlist = await FavoriteModel.find({ userId, itemType: 'product' })
      .populate({
        path: "productId",
        select: "name description price images stock status rating totalReviews",
        model: "Product",
      })
      .sort({ createdAt: -1 });

    return serviceResponse(true, 'Wishlist fetched successfully', wishlist);
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await ProductModel.findById(productId);
    if (!product) {
    return serviceResponse(false, 'Product not found');
    }

    // Check if already in wishlist
    const existing = await FavoriteModel.findOne({ userId, productId });
    if (existing) {
    return serviceResponse(true, 'Product already exist in wishlist', existing);
    }

    const wishlistItem = new FavoriteModel({
      userId,
      productId,
    });

    await wishlistItem.save()

    return serviceResponse(true, 'Product added to Wishlist', wishlistItem.populate('productId'));
  }

  async removeFromWishlist(userId: string, productId: string) {
    const result = await FavoriteModel.findOneAndDelete({ userId, productId });
    if (!result) {
    return serviceResponse(false, 'Item not found on wishlist');
    }
    return serviceResponse(true, 'Item removed from Wishlist');
  }

  async clearWishlist(userId: string) {
    const result = await FavoriteModel.deleteMany({ userId });
    return serviceResponse(true, 'Wishlist cleared successfully');
  }

  async checkInWishlist(userId: string, productId: string) {
    const exists = await FavoriteModel.findOne({ userId, productId });
    return serviceResponse(true, 'Item in wishlist', {isFavorited: !!exists});
  }

  async getWishlistCount(userId: string) {
    const count = await FavoriteModel.countDocuments({ userId, itemType: 'product' });
    return serviceResponse(true, 'Wishlists fetched', count);
  }
}