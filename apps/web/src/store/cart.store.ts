import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];

  couponCode?: string;

  shippingFee: number;

  addItem: (item: CartItem) => void;

  updateQuantity: (productId: string, quantity: number) => void;

  removeItem: (productId: string) => void;

  clearCart: () => void;

  subtotal: () => number;

  total: () => number;
}

export const cartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      shippingFee: 0,

      addItem: (item) => {
        const items = get().items;

        const existing = items.find((i) => i.productId === item.productId);

        if (existing) {
          get().updateQuantity(
            item.productId,

            existing.quantity + 1
          );

          return;
        }

        set({
          items: [...items, item],
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity,
                }
              : item
          ),
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,

          0
        ),

      total: () => get().subtotal() + get().shippingFee,
    }),

    {
      name: "marketplace-cart",
    }
  )
);
