import { Request, Response } from "express";


import { PropertyService } from "./property.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export class PropertyController {
  private service = new PropertyService();

  create = async (req: Request, res: Response) => {
    const property = await this.service.createProperty(
      req.body,
      req.user?.id || ""
    );

    return apiResponse(res, true, "Property created", property);
  };

  getOne = async (req: Request, res: Response) => {
    const property = await this.service.getProperty(req.params.id as string);

    return apiResponse(res, true, "Property fetched", property);
  };

  list = async (req: Request, res: Response) => {
    const properties = await this.service.listProperties(req.query);

    return apiResponse(res, true, "Properties fetched", properties);
  };

  search = async (req: Request, res: Response) => {
    const results = await this.service.searchProperties(
      req.query.q as string
    );

    return apiResponse(res, true, "Search results", results);
  };

  update = async (req: any, res: Response) => {
    const updated = await this.service.updateProperty(
      req.params.id,
      req.user.userId,
      req.body
    );

    return apiResponse(res, true, "Property updated", updated);
  };
}