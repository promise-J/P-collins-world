import { PropertyRepository } from "./property.repository";

import { ApiError } from "../../utils/apiError";

export class PropertyService {
  private repo = new PropertyRepository();

  async createProperty(data: any, userId: string) {
    return this.repo.create({
      ...data,
      landlordId: userId
    });
  }

  async getProperty(id: string) {
    const property = await this.repo.findById(id);

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    await this.repo.incrementViews(id);

    return property;
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

    return this.repo.findAll(filter, page, limit);
  }

  async searchProperties(search: string) {
    return this.repo.search(search);
  }

  async updateProperty(
    id: string,
    userId: string,
    data: any
  ) {
    const property = await this.repo.findById(id);

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    if (property?.landlordId?.toString() !== userId) {
      throw new ApiError(403, "Not authorized");
    }

    return this.repo.update(id, data);
  }
}