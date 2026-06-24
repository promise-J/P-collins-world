import { Request, Response } from "express";
import { LocationService } from "./location.service";
import { apiResponse } from "@/utils/apiResponse";

const locationService = new LocationService();

export class LocationController {
  // Get all locations (admin)
  getAllLocations = async (req: any, res: Response) => {
    const result = await locationService.getAllLocations();
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Get active locations (checkout)
  getActiveLocations = async (req: Request, res: Response) => {
    const result = await locationService.getActiveLocations();
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Get location by state
  getLocationByState = async (req: Request, res: Response) => {
    const result = await locationService.getLocationByState(req.params.state as string);
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Create or update location
  upsertLocation = async (req: any, res: Response) => {
    const result = await locationService.upsertLocation(req.body, req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Toggle state status
  toggleState = async (req: any, res: Response) => {
    const result = await locationService.toggleState(req.params.state, req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Toggle LGA status
  toggleLGA = async (req: any, res: Response) => {
    const result = await locationService.toggleLGA(
      req.params.state,
      req.params.lga,
      req.user._id
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Update LGA details
  updateLGA = async (req: any, res: Response) => {
    const result = await locationService.updateLGA(
      req.params.state,
      req.params.lga,
      req.body,
      req.user._id
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Add LGA
  addLGA = async (req: any, res: Response) => {
    const result = await locationService.addLGA(
      req.params.state,
      req.body,
      req.user._id
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Remove LGA
  removeLGA = async (req: any, res: Response) => {
    const result = await locationService.removeLGA(
      req.params.state,
      req.params.lga,
      req.user._id
    );
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Delete state
  deleteState = async (req: any, res: Response) => {
    const result = await locationService.deleteState(req.params.state, req.user._id);
    return apiResponse(res, result.success, result.message, result.data);
  };

  // Seed default locations
  seedLocations = async (req: any, res: Response) => {
    const result = await locationService.seedDefaultLocations();
    return apiResponse(res, result.success, result.message, result.data);
  };
}