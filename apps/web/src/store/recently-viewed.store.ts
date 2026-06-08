import { create } from "zustand";

interface Store {
  ids: string[];

  add: (id: string) => void;
}

export const useRecentlyViewedProducts = create<Store>((set) => ({
  ids: [],

  add: (id) =>
    set((state) => ({
      ids: [id, ...state.ids.filter((x) => x !== id)].slice(0, 20),
    })),
}));
