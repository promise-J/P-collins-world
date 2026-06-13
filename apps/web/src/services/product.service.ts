import { api } from "@/lib/axios";

export interface ProductData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  stock: number;
  status?: "ACTIVE" | "OUT_OF_STOCK" | "DISABLED";
}

export class ProductService {
  static async list(params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    rating?: number;
    inStock?: boolean;
  }) {
    const response = await api.get("/products", { params });
    return response.data;
  }

  static async getOne(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  static async search(query: string) {
    const response = await api.get("/products/search", { params: { q: query } });
    return response.data;
  }

  static async create(data: FormData | ProductData) {
    const response = await api.post("/products", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  }

  static async update(id: string, data: Partial<ProductData>) {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  }

  static async delete(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }

  static async getRecommendations(productId: string) {
    const response = await api.get(`/products/${productId}/recommendations`);
    return response.data;
  }

  static async getDummyProducts(): Promise<any> {
    return {
      success: true,
      data: dummyProducts,
      total: dummyProducts.length,
      totalPages: 1,
    };
  }

}


export const dummyProducts = [
  {
    _id: "1",
    name: "iPhone 15 Pro Max",
    description: "The latest iPhone with A17 Pro chip, titanium design, and amazing camera system. 256GB storage, Deep Purple color.",
    price: 1450000,
    categoryId: "cat1",
    category: { _id: "cat1", name: "Electronics" },
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      "https://images.unsplash.com/photo-1695048133500-6c0c6b8b8b8b?w=400",
    ],
    stock: 15,
    status: "ACTIVE",
    rating: 4.8,
    totalReviews: 124,
    salesCount: 45,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android phone with 200MP camera, S Pen, and AI features. 512GB storage, Titanium Black.",
    price: 1350000,
    categoryId: "cat1",
    category: { _id: "cat1", name: "Electronics" },
    images: [
      "https://images.unsplash.com/photo-1705172017423-919dd7b59e5c?w=400",
      "https://images.unsplash.com/photo-1705172017424-5b4e8a0b8b8b?w=400",
    ],
    stock: 8,
    status: "ACTIVE",
    rating: 4.7,
    totalReviews: 89,
    salesCount: 32,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "MacBook Pro M3",
    description: "14-inch MacBook Pro with M3 chip, 16GB RAM, 512GB SSD. Perfect for professionals.",
    price: 2450000,
    categoryId: "cat1",
    category: { _id: "cat1", name: "Electronics" },
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
    ],
    stock: 5,
    status: "ACTIVE",
    rating: 4.9,
    totalReviews: 56,
    salesCount: 23,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones with 30-hour battery life.",
    price: 350000,
    categoryId: "cat2",
    category: { _id: "cat2", name: "Audio" },
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    ],
    stock: 25,
    status: "ACTIVE",
    rating: 4.8,
    totalReviews: 234,
    salesCount: 78,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "Nike Air Max 90",
    description: "Classic sneakers with premium comfort and style. Available in multiple colors.",
    price: 85000,
    categoryId: "cat3",
    category: { _id: "cat3", name: "Fashion" },
    images: [
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400",
    ],
    stock: 50,
    status: "ACTIVE",
    rating: 4.6,
    totalReviews: 312,
    salesCount: 145,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    name: "Apple Watch Series 9",
    description: "Smartwatch with advanced health features, always-on display, and fitness tracking.",
    price: 450000,
    categoryId: "cat1",
    category: { _id: "cat1", name: "Electronics" },
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
    ],
    stock: 30,
    status: "ACTIVE",
    rating: 4.7,
    totalReviews: 189,
    salesCount: 67,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "7",
    name: "Dyson V15 Detect",
    description: "Powerful cordless vacuum with laser detection and LCD screen.",
    price: 550000,
    categoryId: "cat4",
    category: { _id: "cat4", name: "Home & Kitchen" },
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400",
    ],
    stock: 12,
    status: "ACTIVE",
    rating: 4.9,
    totalReviews: 67,
    salesCount: 34,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "8",
    name: "Instant Pot Duo",
    description: "7-in-1 electric pressure cooker, slow cooker, rice cooker, steamer, and more.",
    price: 120000,
    categoryId: "cat4",
    category: { _id: "cat4", name: "Home & Kitchen" },
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400",
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400",
    ],
    stock: 40,
    status: "ACTIVE",
    rating: 4.7,
    totalReviews: 456,
    salesCount: 234,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "9",
    name: "Gucci GG Marmont Bag",
    description: "Luxury matelassé leather shoulder bag with chain strap.",
    price: 1250000,
    categoryId: "cat3",
    category: { _id: "cat3", name: "Fashion" },
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    ],
    stock: 3,
    status: "ACTIVE",
    rating: 4.9,
    totalReviews: 23,
    salesCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "10",
    name: "iPad Pro 12.9-inch",
    description: "M2 chip, Liquid Retina XDR display, 256GB storage, Wi-Fi + Cellular.",
    price: 1250000,
    categoryId: "cat1",
    category: { _id: "cat1", name: "Electronics" },
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    ],
    stock: 7,
    status: "ACTIVE",
    rating: 4.8,
    totalReviews: 98,
    salesCount: 45,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "11",
    name: "Nintendo Switch OLED",
    description: "7-inch OLED screen, enhanced audio, 64GB storage, includes white Joy-Con controllers.",
    price: 380000,
    categoryId: "cat1",
    category: { _id: "cat1", name: "Electronics" },
    images: [
      "https://images.unsplash.com/photo-1621259182978-fbf93132d3c9?w=400",
      "https://images.unsplash.com/photo-1621259182978-fbf93132d3c9?w=400",
    ],
    stock: 20,
    status: "ACTIVE",
    rating: 4.7,
    totalReviews: 145,
    salesCount: 89,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "12",
    name: "Bose QuietComfort 45",
    description: "Wireless headphones with noise cancelling, comfortable fit, and 24-hour battery life.",
    price: 320000,
    categoryId: "cat2",
    category: { _id: "cat2", name: "Audio" },
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    ],
    stock: 18,
    status: "ACTIVE",
    rating: 4.8,
    totalReviews: 167,
    salesCount: 56,
    createdAt: new Date().toISOString(),
  },
];