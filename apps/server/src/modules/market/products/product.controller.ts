import { Response } from "express";
import { ProductService } from "./product.service";
import { apiResponse } from "../../../utils/apiResponse";

export class ProductController {
  private service = new ProductService();

  create = async (req: any, res: Response) => {
    const product = await this.service.createProduct({
      name: req.body.name,
      price: req.body.price,
      categoryId: req.body.categoryId,
      images: req.body.images,
      stock: req.body.stock,
      status: req.body.status,
      description: req.body.description,
      createdBy: req.user.userId
    });
    return apiResponse(res, true, "Product created", product);
  };

  list = async (req: any, res: Response) => {
    const products = await this.service.listProducts(req.query);
    return apiResponse(res, true, "Products fetched", products);
  };

  search = async (req: any, res: Response) => {
    const results = await this.service.searchProducts(req.query.q as string);
    return apiResponse(res, true, "Search results", results); // FIXED: returns data
  };

  getOne = async (req: any, res: Response) => {
    const product = await this.service.getProduct(req.params.id); // FIXED: uses params.id
    return apiResponse(res, true, "Product fetched", product);
  };

  update = async (req: any, res: Response) => {
    const product = await this.service.updateProduct(req.params.id, req.body);
    return apiResponse(res, true, "Product updated", product);
  };

  delete = async (req: any, res: Response) => {
    await this.service.deleteProduct(req.params.id);
    return apiResponse(res, true, "Product deleted");
  };
}