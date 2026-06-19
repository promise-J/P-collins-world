import { ProductModel, ProductStatus } from "./product.model";
import { serviceResponse } from "@/utils/apiResponse";


export class ProductService {
  async createProduct(data: any) {
    const product = await ProductModel.create(data);
    return serviceResponse(true, 'Product created')
  }

  async getProduct(id: string) {
    const product = await ProductModel.findById(id).populate("categoryId");
    if (!product) {
      return serviceResponse(false, 'Product not found')
    }
    return serviceResponse(true, 'Product fetched', product)
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

    return serviceResponse(true, 'Products fetched', 
      {
        data: products,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    )
  }

  async searchProducts(text: string) {
    if (!text) return [];

    const products = await ProductModel.find({
      $text: { $search: text },
      status: ProductStatus.ACTIVE
    }).limit(20);

    return serviceResponse(true, 'Products fetched', products)
  }

  async updateProduct(id: string, data: any) {
    const product = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    if (!product) return serviceResponse(false, 'Product not found')
    return serviceResponse(true, 'Product found', product)
  }

  async deleteProduct(id: string) {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) return serviceResponse(false, 'Product not found')

    return serviceResponse(true, 'Product deleteed')
  }

  async decreaseStock(productId: string, qty: number) {
    const product = await ProductModel.findById(productId);
    if (!product) return serviceResponse(false, 'Product not found')
    if (product.stock < qty) return serviceResponse(false, 'Insufficient stock')

    product.stock -= qty;
    if (product.stock === 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
    }
    await product.save();
    return serviceResponse(true, 'Product stocked decreased', product)
  }
}