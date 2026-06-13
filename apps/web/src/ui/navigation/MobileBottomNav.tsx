import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Target, User, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { motion } from "framer-motion";

export function MobileBottomNav() {
  const location = useLocation();
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  const navItems = [
    {
      path: "/dashboard",
      label: "Home",
      icon: Home,
      active: location.pathname === "/dashboard" || "/",
    },
    {
      path: "/products",
      label: "Market",
      icon: ShoppingBag,
      active: location.pathname === "/products" || location.pathname.startsWith("/products/"),
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      path: "/properties",
      label: "Properties",
      icon: Building2,
      active: location.pathname === "/properties" || location.pathname.startsWith("/properties/"),
    },
    {
      path: "/savings",
      label: "Savings",
      icon: Target,
      active: location.pathname === "/savings" || location.pathname.startsWith("/savings/"),
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
      active: location.pathname === "/profile",
    },
  ];

  // Simulate haptic feedback on click (vibration)
  const handleClick = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  return (
    <>
      {/* Spacer to prevent content from hiding behind the nav */}
      <div className="h-16 lg:hidden" />
      
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-lg lg:hidden"
      >
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleClick}
                className="relative flex flex-col items-center gap-1 group"
              >
                {/* Icon Container */}
                <div
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--color-brand-primary)] text-white shadow-md scale-105"
                      : "text-gray-500 hover:text-[var(--color-brand-primary)] hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                </div>
                
                {/* Label */}
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive ? "text-[var(--color-brand-primary)]" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
                
                {/* Badge for cart count */}
                {item.badge && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-md"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </motion.span>
                )}
                
                {/* Active indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-brand-primary)]"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}