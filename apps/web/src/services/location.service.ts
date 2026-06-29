import { api } from "../lib/axios";

export interface LGA {
  name: string;
  isActive: boolean;
  deliveryFee: number;
  estimatedDays: number;
}

export interface Location {
  _id: string;
  state: string;
  isActive: boolean;
  lgas: LGA[];
  deliveryFee: number;
  estimatedDays: number;
  createdAt: string;
  updatedAt: string;
}

export class LocationService {
  // Get active locations (for checkout)
  static async getActiveLocations() {
    const response = await api.get("/locations/active");
    return response.data;
  }

  // Get location by state
  static async getLocationByState(state: string) {
    const response = await api.get(`/locations/state/${state}`);
    return response.data;
  }

  // Admin: Get all locations
  static async getAllLocations() {
    const response = await api.get("/locations");
    return response.data;
  }

  // Admin: Create or update location
  static async upsertLocation(data: Partial<Location>) {
    const response = await api.post("/locations", data);
    return response.data;
  }

  // Admin: Toggle state
  static async toggleState(state: string) {
    const response = await api.patch(`/locations/${state}/toggle`);
    return response.data;
  }

  // Admin: Delete state
  static async deleteState(state: string) {
    const response = await api.delete(`/locations/${state}`);
    return response.data;
  }

  // Admin: Add LGA
  static async addLGA(state: string, lgaData: Partial<LGA>) {
    const response = await api.post(`/locations/${state}/lgas`, lgaData);
    return response.data;
  }

  // Admin: Toggle LGA
  static async toggleLGA(state: string, lga: string) {
    const response = await api.patch(`/locations/${state}/lgas/${lga}/toggle`);
    return response.data;
  }

  // Admin: Update LGA
  static async updateLGA(state: string, lga: string, data: Partial<LGA>) {
    const response = await api.patch(`/locations/${state}/lgas/${lga}`, data);
    return response.data;
  }

  // Admin: Remove LGA
  static async removeLGA(state: string, lga: string) {
    const response = await api.delete(`/locations/${state}/lgas/${lga}`);
    return response.data;
  }

  // Admin: Seed default locations
  static async seedLocations() {
    const response = await api.post("/locations/seed");
    return response.data;
  }
}