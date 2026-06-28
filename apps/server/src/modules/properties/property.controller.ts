import { Request, Response } from "express";


import { PropertyService } from "./property.service.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { parseFormData } from "@/utils/formDataParser.js";
import { UserRole } from "@/enum/role.enum.js";
import { MediaUploadService } from "../services/media-upload.service.js";

export class PropertyController {
  private service = new PropertyService();

  create = async (req: any, res: Response) => {
    try {
      
      const { user } = req;
      const files = req.files as Express.Multer.File[];
      
      // ✅ Parse form data
      const parsedData = parseFormData(req.body);
      
      // ✅ Upload files to Cloudinary using the helper service
      const uploadedMedia = await MediaUploadService.uploadMultiple(
        files,
        "properties",
        "image"
      );
      
      // ✅ Add uploaded media to parsed data
      parsedData.media = uploadedMedia;
      parsedData.landlordId = user?._id ?? "";
      parsedData.approvalStatus = "pending";

      const result = await this.service.createProperty(parsedData, user?._id.toString() ?? "");
      
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      console.error('❌ Error creating property:', error);
      return apiResponse(res, false, error.message || "Failed to create property");
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
      req.user.role,
      req.body
    );

    return apiResponse(res, result.success, result.message, result.data);
  };
}