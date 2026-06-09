// 🟢 FIX: Explicitly import both Request and Response from Express
import { Request, Response } from "express"; 
import { apiResponse } from "../../../utils/apiResponse";
import { CategoryService } from "./category.service";

export class CategoryController {
  private service = new CategoryService();

  create = async (req: any, res: Response) => {
    const category = await this.service.create(req.body);
    return apiResponse(res, true, "Category created", category);
  };

  // 🟢 This will now resolve perfectly to Express Request
  list = async (req: Request, res: Response) => {
    const categories = await this.service.list();
    return apiResponse(res, true, "Categories fetched", categories);
  };

  getBySlug = async (req: Request, res: Response) => {
    const category = await this.service.getBySlug(req.params.slug as string);
    return apiResponse(res, true, "Category fetched", category);
  };

  update = async (req: any, res: Response) => {
    const category = await this.service.update(req.params.id, req.body);
    return apiResponse(res, true, "Category updated", category);
  };

  delete = async (req: any, res: Response) => {
    await this.service.delete(req.params.id);
    return apiResponse(res, true, "Category deleted");
  };
}
