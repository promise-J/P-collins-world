import { Product } from "@/types/product.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Updated interface to match properties used in functions (name, stock)
interface CartItem {
  _id: string;
  productId: string | Product;
  name: string;      
  stock: number;    
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  couponCode?: string;
  shippingFee: number;
  coupon?: {
    code: string;
    discount: number;
    type: 'FIXED' | 'PERCENTAGE';
  } | null;
  
  addToCart: (item: CartItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number, type: 'FIXED' | 'PERCENTAGE') => void;
  removeCoupon: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shippingFee: 0,
      coupon: null,

      // Aligned addToCart method signature to implement interface
      addToCart: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === item.productId);

        const targetProductId = typeof item.productId === "object" ? item.productId._id : item.productId;

        if (existing) {
          get().updateQuantity(targetProductId, existing.quantity + quantity);
          return;
        }

        set({ items: [...items, { ...item, quantity }] });
        console.log(`${item.name} added to cart`);
      },

      removeFromCart: (productId) => {
        const { items } = get();
        const product = items.find(item => item.productId === productId);
        set({ items: items.filter(item => item.productId !== productId) });
        if (product) {
          console.log(`${product.name} removed from cart`);
        }
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        const product = items.find(item => item.productId === productId);
        
        if (!product) return;
        
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        if (quantity > product.stock) {
          console.error(`Only ${product.stock} items available`);
          return;
        }
        
        set({
          items: items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
        console.log('Cart cleared');
      },

      applyCoupon: (code, discount, type) => {
        set({ coupon: { code, discount, type } });
        console.log(`Coupon ${code} applied!`);
      },

      removeCoupon: () => {
        set({ coupon: null });
        console.log('Coupon removed');
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getDiscountAmount: () => {
        const { coupon, getSubtotal } = get();
        if (!coupon) return 0;
        
        const subtotal = getSubtotal();
        if (coupon.type === 'FIXED') {
          return Math.min(coupon.discount, subtotal);
        }
        return (subtotal * coupon.discount) / 100;
      },

      getTotal: () => {
        const { getSubtotal, getDiscountAmount, shippingFee } = get();
        return getSubtotal() - getDiscountAmount() + shippingFee;
      },
    }),
    {
      name: 'marketplace-cart',
      partialize: (state) => ({ 
        items: state.items, 
        coupon: state.coupon,
        shippingFee: state.shippingFee
      }),
    }
  )
);
