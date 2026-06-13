import toast from 'react-hot-toast';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareProperty {
  _id: string;
  title: string;
  price: number;
  location: any;
  features: any;
  media: any[];
  status: string;
  type: string;
  description: string;
}

interface CompareState {
  compareList: CompareProperty[];
  addToCompare: (property: CompareProperty) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
  getCompareCount: () => number;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareList: [],

      addToCompare: (property) => {
        const { compareList } = get();
        if (compareList.length >= 4) {
          // Limit to 4 properties for comparison
          toast.error("You can compare up to 4 properties at once");
          return;
        }
        if (!compareList.find(p => p._id === property._id)) {
          set({ compareList: [...compareList, property] });
        }
      },

      removeFromCompare: (propertyId) => {
        set({ compareList: get().compareList.filter(p => p._id !== propertyId) });
      },

      clearCompare: () => {
        set({ compareList: [] });
      },

      isInCompare: (propertyId) => {
        return get().compareList.some(p => p._id === propertyId);
      },

      getCompareCount: () => {
        return get().compareList.length;
      },
    }),
    {
      name: 'compare-storage',
    }
  )
);