import { api } from "@/lib/axios";

export interface PropertyData {
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  type: "APARTMENT" | "HOUSE" | "LAND" | "COMMERCIAL";
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED" | "MAINTENANCE" | "EXPIRED";
  features: {
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    furnished: boolean;
  };
  media: Array<{ url: string; publicId: string; type: string }>;
  isFeatured?: boolean;
}

export class PropertyService {
  static async list(params?: {
    page?: number;
    limit?: number;
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    status?: string;
    search?: string;
  }) {
    const response = await api.get("/properties", { params });
    return response.data;
  }

  static async getOne(id: string) {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  }

  static async search(query: string) {
    const response = await api.get("/properties/search", { params: { q: query } });
    return response.data;
  }

  static async create(data: FormData | PropertyData) {
    const response = await api.post("/properties", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  }

  static async update(id: string, data: Partial<PropertyData>) {
    const response = await api.patch(`/properties/${id}`, data);
    return response.data;
  }

  static async delete(id: string) {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  }

  static async getFavorites() {
    const response = await api.get("/favorites");
    return response.data;
  }

  static async addFavorite(propertyId: string) {
    const response = await api.post(`/favorites/${propertyId}`);
    return response.data;
  }

  static async removeFavorite(propertyId: string) {
    const response = await api.delete(`/favorites/${propertyId}`);
    return response.data;
  }

  static async checkFavorite(propertyId: string) {
    const response = await api.get(`/favorites/${propertyId}/check`);
    return response.data;
  }

  static async getRecentlyViewed() {
    const response = await api.get("/properties/recently-viewed");
    return response.data;
  }

  static async recommendations() {
    const response = await api.get("/properties/recommendations");
    return response.data;
  }

  static async getDummyProperties(): Promise<any> {
    return {
      success: true,
      data: dummyProperties,
      total: dummyProperties.length,
      totalPages: 1,
    };
  }
}


export const dummyProperties = [
  {
    _id: "1",
    title: "Luxury Apartment in Victoria Island",
    description: "Beautiful 3-bedroom apartment with ocean view, modern finishes, and 24/7 security.",
    price: 150000000,
    location: {
      address: "123 Ahmadu Bello Way",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    type: "APARTMENT",
    status: "AVAILABLE",
    features: {
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      furnished: true,
    },
    media: [
      {
        url: "https://media.licdn.com/dms/image/v2/C561BAQH-tIF8WZ5uaw/company-background_10000/company-background_10000/0/1609681191346/nigeria_property_deals_cover?e=2147483647&v=beta&t=jDgpn1OAZ927xRjjBR-tfaaQApHZ1LFswGFoOBDoHtQ",
        type: "image",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ842RyjeYhFbXVatz4RCy0FaDBOCC1T2yWw&s",
        type: "image",
      },
    ],
    isFeatured: true,
    views: 245,
    createdAt: new Date().toISOString(),
    landlordId: {
      _id: "landlord1",
      firstName: "John",
      lastName: "Doe",
    },
  },
  {
    _id: "2",
    title: "Modern 4-Bedroom House in Lekki",
    description: "Spacious family home with swimming pool, garden, and parking space.",
    price: 250000000,
    location: {
      address: "45 Admiralty Way",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    type: "HOUSE",
    status: "AVAILABLE",
    features: {
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      furnished: false,
    },
    media: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSat1L2UQEN4WcZgL4sorX0DAVaPrLcvqwzcw&s",
        type: "image",
      },
    ],
    isFeatured: true,
    views: 189,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Commercial Space in Ikeja",
    description: "Prime commercial space suitable for office, retail, or restaurant.",
    price: 80000000,
    location: {
      address: "10 Allen Avenue",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    type: "COMMERCIAL",
    status: "AVAILABLE",
    features: {
      bedrooms: 0,
      bathrooms: 2,
      toilets: 2,
      furnished: false,
    },
    media: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        type: "image",
      },
    ],
    isFeatured: false,
    views: 67,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Land for Sale in Abuja",
    description: "500sqm plot in a developing area, perfect for residential construction.",
    price: 35000000,
    location: {
      address: "Kado Estate",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
    },
    type: "LAND",
    status: "AVAILABLE",
    features: {
      bedrooms: 0,
      bathrooms: 0,
      toilets: 0,
      furnished: false,
    },
    media: [
      {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        type: "image",
      },
    ],
    isFeatured: false,
    views: 112,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Penthouse with Pool",
    description: "Stunning 5-bedroom penthouse with private pool and rooftop terrace.",
    price: 350000000,
    location: {
      address: "1 Banana Island",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    type: "APARTMENT",
    status: "RESERVED",
    features: {
      bedrooms: 5,
      bathrooms: 5,
      toilets: 6,
      furnished: true,
    },
    media: [
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1600607687644-c8f7f9d57a3a?w=800",
        type: "image",
      },
    ],
    isFeatured: true,
    views: 423,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Cozy 2-Bedroom Apartment",
    description: "Affordable apartment in a quiet neighborhood, perfect for small families.",
    price: 45000000,
    location: {
      address: "15 Surulere",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    type: "APARTMENT",
    status: "AVAILABLE",
    features: {
      bedrooms: 2,
      bathrooms: 2,
      toilets: 2,
      furnished: true,
    },
    media: [
      {
        url: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
        type: "image",
      },
    ],
    isFeatured: false,
    views: 56,
    createdAt: new Date().toISOString(),
  },
];