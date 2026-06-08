import { ProductModel, ProductStatus } from "./product.model";
import { ApiError } from "../../../utils/apiError";

export class ProductService {
  async createProduct(data: any) {
    return ProductModel.create(data);
  }

  async getProduct(id: string) {
    const product = await ProductModel.findById(id).populate("categoryId");
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    return product;
  }

  async listProducts(query: any) {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search
    } = query;

    const filter: any = { status: ProductStatus.ACTIVE };

    if (category) filter.categoryId = category;
    if (minPrice || maxPrice) {
      filter.price = {
        $gte: minPrice || 0,
        $lte: maxPrice || 9999999
      };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const products = await ProductModel.find(filter)
      .populate("categoryId")
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ProductModel.countDocuments(filter);

    return {
      data: products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    };
  }

  async searchProducts(text: string) {
    if (!text) return [];
    return ProductModel.find({
      $text: { $search: text },
      status: ProductStatus.ACTIVE
    }).limit(20);
  }

  async updateProduct(id: string, data: any) {
    const product = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  }

  async deleteProduct(id: string) {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  }

  async decreaseStock(productId: string, qty: number) {
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error("Product not found");
    if (product.stock < qty) throw new Error("Insufficient stock");

    product.stock -= qty;
    if (product.stock === 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
    }
    await product.save();
    return product;
  }
}