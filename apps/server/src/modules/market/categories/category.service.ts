// modules/market/categories/category.service.ts
import { serviceResponse } from "@/utils/apiResponse";
import { CategoryModel } from "./category.model";

export class CategoryService {
  async create(data: any) {
    const slug = data.name.toLowerCase().replace(/ /g, "-");
    const categoryData = {...data, slug}
    console.log({categoryData})
    await CategoryModel.create(categoryData);
    return serviceResponse(true, 'Category created successfully')
  }

  async list() {
    const categories = await CategoryModel.find({ isActive: true }).sort({ order: 1 });
    return serviceResponse(true, 'Categories fetched successfully', categories)

  }

  async getBySlug(slug: string) {
    const category = await CategoryModel.findOne({ slug });
    if (!category) return serviceResponse(false, 'Category not found')
    return serviceResponse(true, 'Category fetched successfully', category)
  }

  async update(id: string, data: any) {
    if (data.name) {
      data.slug = data.name.toLowerCase().replace(/ /g, "-");
    }
    await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    return serviceResponse(true, 'Category updated successfully')
  }

  async delete(id: string) {
    CategoryModel.findByIdAndDelete(id);
    return serviceResponse(true, 'Category deleted successfully')

  }
}