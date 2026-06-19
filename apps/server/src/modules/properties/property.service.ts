import { PropertyRepository } from "./property.repository";

import { ApiError } from "../../utils/apiError";
import { serviceResponse } from "@/utils/apiResponse";

export class PropertyService {
  private repo = new PropertyRepository();

  async createProperty(data: any, userId: string) {
    const result = await this.repo.create({
      ...data,
      landlordId: userId
    });
    return serviceResponse(true, 'Property created', result)
  }

  async getProperty(id: string) {
    const property = await this.repo.findById(id);

    if (!property) {
      return serviceResponse(false, "Property not found");
    }

    await this.repo.incrementViews(id);

    return serviceResponse(true, 'Property fetched', property);
  }

  async listProperties(query: any) {
    const {
      page = 1,
      limit = 10,
      city,
      type,
      minPrice,
      maxPrice
    } = query;

    const filter: any = {};

    if (city) filter["location.city"] = city;

    if (type) filter.type = type;

    if (minPrice || maxPrice) {
      filter.price = {
        $gte: minPrice || 0,
        $lte: maxPrice || 999999999
      };
    }

    const result = await this.repo.findAll(filter, page, limit);
    return serviceResponse(true, 'Properties fetched', result)
  }

  async searchProperties(search: string) {
    const result = await this.repo.search(search);
    return serviceResponse(true, 'Properties fetched', result)
  }

  async updateProperty(
    id: string,
    userId: string,
    data: any
  ) {
    const property = await this.repo.findById(id);

    if (!property) {
      return serviceResponse(false, "Property not found");
    }

    if (property?.landlordId?.toString() !== userId) {
      return serviceResponse(false, "Not authorized");
    }

    const result = await this.repo.update(id, data);
    return serviceResponse(true, 'Property updated', result)
  }
}