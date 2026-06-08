import { create } from "zustand";

interface Search {
  id: string;
  name: string;
  filters: Record<string, any>;
}

interface Store {
  searches: Search[];

  addSearch: (search: Search) => void;

  removeSearch: (id: string) => void;
}

export const useSavedSearches = create<Store>((set) => ({
  searches: [],

  addSearch: (search) =>
    set((state) => ({
      searches: [search, ...state.searches],
    })),

  removeSearch: (id) =>
    set((state) => ({
      searches: state.searches.filter((s) => s.id !== id),
    })),
}));
