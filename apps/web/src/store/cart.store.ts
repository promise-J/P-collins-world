import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { CartService } from '@/services/cart.service';

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  stock: number;
  status?: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  coupon: {
    code: string;
    discount: number;
    type: 'FIXED' | 'PERCENTAGE';
  } | null;
  cartId: string | null;
  
  // API Actions
  fetchCart: () => Promise<void>;
  addToCart: (product: CartItem, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string, discount: number, type: 'FIXED' | 'PERCENTAGE') => void;
  removeCoupon: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      coupon: null,
      cartId: null,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await CartService.getCart();
          if (response.success && response.data) {
            const cartData = response.data;
            const items = cartData.items?.map((item: any) => ({
              _id: item.productId._id || item.productId,
              productId: item.productId._id || item.productId,
              name: item.productId.name || 'Product',
              price: item.price || item.productId.price || 0,
              quantity: item.quantity || 1,
              images: item.productId.images?.map((img: any) => 
                typeof img === 'string' ? img : img.url
              ) || [],
              stock: item.productId.stock || 0,
              status: item.productId.status || 'ACTIVE',
            }));
            set({ 
              items, 
              cartId: cartData._id,
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ isLoading: false });
        }
      },

      addToCart: async (product, quantity = 1) => {
        set({ isLoading: true });
        try {
          const response = await CartService.addToCart(product.productId, quantity, product.price);
          if (response.success) {
            await get().fetchCart();
            toast.success(`${product.name} added to cart`);
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to add to cart');
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Fix: Update quantity with proper async handling
      updateQuantity: async (productId, quantity) => {
        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
          await get().removeFromCart(productId);
          return;
        }
        
        set({ isLoading: true });
        try {
          // Find the item to check stock limits
          const item = get().items.find(i => i._id === productId);
          if (!item) {
            toast.error('Item not found in cart');
            return;
          }
          
          // Check if requested quantity exceeds stock
          if (quantity > item.stock) {
            toast.error(`Only ${item.stock} items available in stock`);
            return;
          }
          
          // Update quantity via API
          const response = await CartService.updateQuantity(productId, quantity);
          if (response.success) {
            // Refresh the entire cart after successful update
            await get().fetchCart();
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to update quantity');
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (productId) => {
        set({ isLoading: true });
        try {
          const product = get().items.find(item => item._id === productId);
          const response = await CartService.removeItem(productId);
          if (response.success) {
            await get().fetchCart();
            if (product) {
              toast.success(`${product.name} removed from cart`);
            }
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to remove from cart');
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          const response = await CartService.clearCart();
          if (response.success) {
            set({ items: [], coupon: null, cartId: null });
            // toast.success('Cart cleared');
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to clear cart');
        } finally {
          set({ isLoading: false });
        }
      },

      applyCoupon: (code, discount, type) => {
        set({ coupon: { code, discount, type } });
        toast.success(`Coupon ${code} applied!`);
      },

      removeCoupon: () => {
        set({ coupon: null });
        toast.success('Coupon removed');
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
        const { getSubtotal, getDiscountAmount } = get();
        return getSubtotal() - getDiscountAmount();
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        coupon: state.coupon,
        cartId: state.cartId,
      }),
    }
  )
);