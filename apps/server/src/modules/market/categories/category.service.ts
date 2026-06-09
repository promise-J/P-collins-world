// modules/market/categories/category.service.ts
import { CategoryModel } from "./category.model";

export class CategoryService {
  async create(data: any) {
    const slug = data.name.toLowerCase().replace(/ /g, "-");
    return CategoryModel.create({ ...data, slug });
  }

  async list() {
    return CategoryModel.find({ isActive: true }).sort({ order: 1 });
  }

  async getBySlug(slug: string) {
    const category = await CategoryModel.findOne({ slug });
    if (!category) throw new Error("Category not found");
    return category;
  }

  async update(id: string, data: any) {
    if (data.name) {
      data.slug = data.name.toLowerCase().replace(/ /g, "-");
    }
    return CategoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return CategoryModel.findByIdAndDelete(id);
  }
}