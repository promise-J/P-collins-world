// 🟢 FIX: Explicitly import both Request and Response from Express
import { Request, Response } from "express"; 
import { apiResponse } from "../../../utils/apiResponse";
import { CategoryService } from "./category.service";

export class CategoryController {
  private service = new CategoryService();

  create = async (req: any, res: Response) => {
    const result = await this.service.create(req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  list = async (req: Request, res: Response) => {
    const result = await this.service.list();
    return apiResponse(res, result.success, result.message, result.data);
  };

  getBySlug = async (req: Request, res: Response) => {
    const result = await this.service.getBySlug(req.params.slug as string);
    return apiResponse(res, result.success, result.message, result.data);
  };

  update = async (req: any, res: Response) => {
    const result = await this.service.update(req.params.id, req.body);
    return apiResponse(res, result.success, result.message, result.data);
  };

  delete = async (req: any, res: Response) => {
    const result = await this.service.delete(req.params.id);
    return apiResponse(res, result.success, result.message, result.data);
  };
}
