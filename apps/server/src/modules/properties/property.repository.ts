import { PropertyModel } from "./property.model";

export class PropertyRepository {
  create(data: any) {
    return PropertyModel.create(data);
  }

  findById(id: string) {
    return PropertyModel.findById(id);
  }

  findAll(filter: any, page = 1, limit = 10) {
    return PropertyModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  search(query: any) {
    return PropertyModel.find({
      $text: { $search: query }
    });
  }

  update(id: string, data: any) {
    return PropertyModel.findByIdAndUpdate(id, data, {
      new: true
    });
  }

  incrementViews(id: string) {
    return PropertyModel.findByIdAndUpdate(id, {
      $inc: { views: 1 }
    });
  }
}