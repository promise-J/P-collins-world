import { create }
from "zustand";

interface Store {
 propertyIds: string[];

 add: (
  propertyId: string
 ) => void;
}

export const useRecentlyViewed =
create<Store>((set) => ({

 propertyIds: [],

 add: (propertyId) =>
  set((state) => ({

   propertyIds: [

    propertyId,

    ...state.propertyIds.filter(
      id => id !== propertyId
    )

   ].slice(0, 20)

  }))

}));