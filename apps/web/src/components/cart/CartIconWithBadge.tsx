import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart.store";

interface CartIconWithBadgeProps {
  size?: number;
  className?: string;
}

export function CartIconWithBadge({ size = 20, className = "" }: CartIconWithBadgeProps) {
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  return (
    <div className="relative inline-block">
      <ShoppingBag size={size} className={className} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-md">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </div>
  );
}