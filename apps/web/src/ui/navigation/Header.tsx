import { useState } from "react";
import { Search, Menu, Bell, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";

interface HeaderProps {
  userName: string;
  avatar?: string;
  onMenuClick?: () => void;
}

export function Header({ userName, avatar, onMenuClick }: HeaderProps) {
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shadow-sm lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 min-w-[300px]">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search products, properties..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        {/* Cart Button */}
        <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ShoppingBag size={20} className="text-gray-600" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-[var(--color-brand-primary)] text-white text-xs rounded-full flex items-center justify-center">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
        
        <NotificationDropdown />
        <UserDropdown userName={userName} avatar={avatar} />
      </div>
    </header>
  );
}