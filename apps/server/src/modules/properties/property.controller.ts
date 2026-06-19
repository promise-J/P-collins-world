import { Request, Response } from "express";


import { PropertyService } from "./property.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export class PropertyController {
  private service = new PropertyService();

  create = async (req: Request, res: Response) => {
    try {
      const { body, files, user } = req;
      const fileList = files as Express.Multer.File[];

      const media = fileList?.map((file: any) => ({
        url: file.path,
        publicId: file.filename,
        type: "image"
      })) || [];
      
      const propertyData = {
        ...body,
        media,
        landlordId: user?._id ?? "",
        approvalStatus: "pending"
      };
      
      const result = await this.service.createProperty(propertyData, user?._id.toString() ?? "");
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error) {
      return apiResponse(res, false, "Failed to create property");
    }
  };

  getOne = async (req: Request, res: Response) => {
    const result = await this.service.getProperty(req.params.id as string);

    return apiResponse(res, result.success, result.message, result.data);
  };

  list = async (req: Request, res: Response) => {
    const result = await this.service.listProperties(req.query);

    return apiResponse(res, result.success, result.message, result.data);
  };

  search = async (req: Request, res: Response) => {
    const result = await this.service.searchProperties(
      req.query.q as string
    );

    return apiResponse(res, result.success, result.message, result.data);
  };

  update = async (req: any, res: Response) => {
    const result = await this.service.updateProperty(
      req.params.id,
      req.user._id,
      req.body
    );

    return apiResponse(res, result.success, result.message, result.data);
  };
}