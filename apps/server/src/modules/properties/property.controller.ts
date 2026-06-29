import { Request, Response } from "express";


import { PropertyService } from "./property.service.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { parseFormData } from "@/utils/formDataParser.js";
import { MediaUploadService } from "../services/media-upload.service.js";
import { toMongooseObjectId } from "@/utils/helper.js";
import { Types } from "mongoose";

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
    const propertyId = toMongooseObjectId(req.params.id as string ?? "")
    if(!propertyId && !(new Types.ObjectId(propertyId ?? ""))){
      return apiResponse(res, false, 'Property id is not found')
    }
    const result = await this.service.getProperty(propertyId?.toString() ?? "");
    console.log({result})

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

  delete = async (req: any, res: Response) => {
    try {
      const result = await this.service.deleteProperty(req.params.id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to delete property");
    }
  };

  approveProperty = async (req: any, res: Response) => {
    try {
      const result = await this.service.approveProperty(req.params.id, req.user?._id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to approve property");
    }
  };

  rejectProperty = async (req: any, res: Response) => {
    try {
      const { reason } = req.body;
      const result = await this.service.rejectProperty(req.params.id, reason, req.user?._id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to reject property");
    }
  };

  getFavorites = async (req: any, res: Response) => {
    try {
      const result = await this.service.getFavorites(req.user?._id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch favorites");
    }
  };

  addFavorite = async (req: any, res: Response) => {
    try {
      const result = await this.service.addFavorite(req.user?._id, req.params.id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to add favorite");
    }
  };

  removeFavorite = async (req: any, res: Response) => {
    try {
      const result = await this.service.removeFavorite(req.user?._id, req.params.id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to remove favorite");
    }
  };

  // Check if property is favorited
  checkFavorite = async (req: any, res: Response) => {
    try {
      const result = await this.service.checkFavorite(req.user?._id, req.params.id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to check favorite status");
    }
  };

  getRecentlyViewed = async (req: any, res: Response) => {
    try {
      const result = await this.service.getRecentlyViewed(req.user?._id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch recently viewed");
    }
  };

  recommendations = async (req: any, res: Response) => {
    try {
      const result = await this.service.getRecommendations(req.user?._id);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      return apiResponse(res, false, error.message || "Failed to fetch recommendations");
    }
  };
}