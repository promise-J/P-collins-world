import { api } from "@/lib/axios";

export class CategoryService {
  static async getAllCategories() {
    const response = await api.get("/categories");
    return response.data;
  }

  static async getCategoryBySlug(slug: string) {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  }

  static async createCategory(payload: {
    name: string;
    description?: string;
    image?: string;
    parentId?: string;
    order?: number;
  }) {
    const response = await api.post("/categories", payload);
    return response.data;
  }

  static async updateCategory(id: string, payload: any) {
    const response = await api.patch(`/categories/${id}`, payload);
    return response.data;
  }

  static async deleteCategory(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }

  static async getDummyCategories() {
    return {
      success: true,
      data: [
        { _id: "cat1", name: "Electronics", slug: "electronics" },
        { _id: "cat2", name: "Audio", slug: "audio" },
        { _id: "cat3", name: "Fashion", slug: "fashion" },
        { _id: "cat4", name: "Home & Kitchen", slug: "home-kitchen" },
      ],
    };
  }
}