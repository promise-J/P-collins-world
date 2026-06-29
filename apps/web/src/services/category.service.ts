import { api } from "../lib/axios";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | Category;
  isActive: boolean;
  order: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export class CategoryService {
  static async getAllCategories() {
    const response = await api.get("/categories");
    return response.data;
  }

  static async getCategoryBySlug(slug: string) {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  }

  static async createCategory(data: {
    name: string;
    description?: string;
    image?: string;
    parentId?: string;
    order?: number;
  }) {
    const response = await api.post("/categories", data);
    return response.data;
  }

  static async updateCategory(id: string, data: Partial<Category>) {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  }

  static async deleteCategory(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
}