import { serviceResponse } from "@/utils/apiResponse";
import { LocationModel } from "./location.model";

export class LocationService {
  async getAllLocations() {
    const locations = await LocationModel.find().sort({ state: 1 });
    return serviceResponse(true, "Locations fetched", locations);
  }

  // Get active locations (for checkout)
  async getActiveLocations() {
    const locations = await LocationModel.find({ isActive: true })
      .sort({ state: 1 })
      .lean();

    // Only return active LGAs
    const filteredLocations = locations.map((location) => ({
      ...location,
      lgas: location.lgas.filter((lga) => lga.isActive),
    }));

    return serviceResponse(true, "Active locations fetched", filteredLocations);
  }

  // Get location by state
  async getLocationByState(state: string) {
    const location = await LocationModel.findOne({ state });
    if (!location) {
      return serviceResponse(false, "State not found");
    }
    return serviceResponse(true, "Location fetched", location);
  }

  // Create or update location
  async upsertLocation(data: any, userId: string) {
    const { state, lgas, deliveryFee, estimatedDays, isActive } = data;

    if (!state) {
      return serviceResponse(false, "State is required");
    }

    const existing = await LocationModel.findOne({ state });

    if (existing) {
      // Update existing
      existing.lgas = lgas || existing.lgas;
      existing.deliveryFee = deliveryFee !== undefined ? deliveryFee : existing.deliveryFee;
      existing.estimatedDays = estimatedDays || existing.estimatedDays;
      existing.isActive = isActive !== undefined ? isActive : existing.isActive;
      existing.updatedBy = userId as any;
      await existing.save();
      return serviceResponse(true, "Location updated", existing);
    } else {
      // Create new
      const location = await LocationModel.create({
        state,
        lgas: lgas || [],
        deliveryFee: deliveryFee || 0,
        estimatedDays: estimatedDays || 3,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: userId,
        updatedBy: userId,
      });
      return serviceResponse(true, "Location created", location);
    }
  }

  // Toggle state status
  async toggleState(state: string, userId: string) {
    const location = await LocationModel.findOne({ state });
    if (!location) {
      return serviceResponse(false, "State not found");
    }

    location.isActive = !location.isActive;
    location.updatedBy = userId as any;
    await location.save();

    return serviceResponse(true, `State ${location.isActive ? "activated" : "deactivated"}`, location);
  }

  // Toggle LGA status
  async toggleLGA(state: string, lgaName: string, userId: string) {
    const location = await LocationModel.findOne({ state });
    if (!location) {
      return serviceResponse(false, "State not found");
    }

    const lga = location.lgas.find((l) => l.name === lgaName);
    if (!lga) {
      return serviceResponse(false, "LGA not found");
    }

    lga.isActive = !lga.isActive;
    location.updatedBy = userId as any;
    await location.save();

    return serviceResponse(true, `LGA ${lga.isActive ? "activated" : "deactivated"}`, location);
  }

  // Update LGA details
  async updateLGA(state: string, lgaName: string, data: any, userId: string) {
    const location = await LocationModel.findOne({ state });
    if (!location) {
      return serviceResponse(false, "State not found");
    }

    const lga = location.lgas.find((l) => l.name === lgaName);
    if (!lga) {
      return serviceResponse(false, "LGA not found");
    }

    if (data.deliveryFee !== undefined) lga.deliveryFee = data.deliveryFee;
    if (data.estimatedDays !== undefined) lga.estimatedDays = data.estimatedDays;
    if (data.isActive !== undefined) lga.isActive = data.isActive;

    location.updatedBy = userId as any;
    await location.save();

    return serviceResponse(true, "LGA updated", location);
  }

  // Add new LGA to state
  async addLGA(state: string, lgaData: any, userId: string) {
    const location = await LocationModel.findOne({ state });
    if (!location) {
      return serviceResponse(false, "State not found");
    }

    const existing = location.lgas.find((l) => l.name === lgaData.name);
    if (existing) {
      return serviceResponse(false, "LGA already exists in this state");
    }

    location.lgas.push({
      name: lgaData.name,
      isActive: lgaData.isActive !== undefined ? lgaData.isActive : true,
      deliveryFee: lgaData.deliveryFee || 0,
      estimatedDays: lgaData.estimatedDays || 3,
    });
    location.updatedBy = userId as any;
    await location.save();

    return serviceResponse(true, "LGA added", location);
  }

  // Remove LGA from state
  async removeLGA(state: string, lgaName: string, userId: string) {
    const location = await LocationModel.findOne({ state });
    if (!location) {
      return serviceResponse(false, "State not found");
    }

    const lgaIndex = location.lgas.findIndex((l) => l.name === lgaName);
    if (lgaIndex === -1) {
      return serviceResponse(false, "LGA not found");
    }

    location.lgas.splice(lgaIndex, 1);
    location.updatedBy = userId as any;
    await location.save();

    return serviceResponse(true, "LGA removed", location);
  }

  // Delete state
  async deleteState(state: string, userId: string) {
    const result = await LocationModel.findOneAndDelete({ state });
    if (!result) {
      return serviceResponse(false, "State not found");
    }
    return serviceResponse(true, "State deleted");
  }

  // Seed default locations
  async seedDefaultLocations() {
    const defaultStates = [
      { state: "Lagos", lgas: ["Agege", "Alimosho", "Apapa", "Eti-Osa", "Ikeja", "Ikorodu", "Surulere", "Victoria Island"] },
      { state: "FCT", lgas: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal"] },
      { state: "Rivers", lgas: ["Obio/Akpor", "Port Harcourt", "Eleme", "Ikwerre", "Oyigbo"] },
      { state: "Kano", lgas: ["Dala", "Fagge", "Gwarzo", "Kano Municipal", "Kumbotso", "Nasarawa", "Tarauni", "Ungogo"] },
      { state: "Oya", lgas: ["Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Egbeda", "Lagelu", "Ona Ara"] },
      { state: "Edo", lgas: ["Egor", "Ikpoba-Okha", "Oredo", "Ovia North-East", "Ovia South-West"] },
      { state: "Enugu", lgas: ["Enugu East", "Enugu North", "Enugu South", "Nsukka", "Udi"] },
    ];

    for (const defaultState of defaultStates) {
      const existing = await LocationModel.findOne({ state: defaultState.state });
      if (!existing) {
        await LocationModel.create({
          state: defaultState.state,
          lgas: defaultState.lgas.map((name) => ({
            name,
            isActive: true,
            deliveryFee: 0,
            estimatedDays: 3,
          })),
          isActive: true,
          deliveryFee: 0,
          estimatedDays: 3,
        });
      }
    }

    return serviceResponse(true, "Default locations seeded");
  }
}