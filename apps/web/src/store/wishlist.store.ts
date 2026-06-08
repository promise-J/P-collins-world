import { create } from "zustand";

interface Store {
  items: string[];

  add: (id: string) => void;

  remove: (id: string) => void;
}

export const wishlistStore = create<Store>((set) => ({
  items: [],

  add: (id) =>
    set((state) => ({
      items: [...new Set([...state.items, id])],
    })),

  remove: (id) =>
    set((state) => ({
      items: state.items.filter((x) => x !== id),
    })),
}));
