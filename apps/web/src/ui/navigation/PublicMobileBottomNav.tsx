import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Building2, Target, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export function PublicMobileBottomNav() {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
      active: location.pathname === "/",
    },
    {
      path: "/products",
      label: "Market",
      icon: ShoppingBag,
      active: location.pathname === "/products" || location.pathname.startsWith("/products/"),
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
      path: "/login",
      label: "Sign In",
      icon: LogIn,
      active: location.pathname === "/login",
    },
  ];

  return (
    <>
      {/* Spacer */}
      <div className="h-16 lg:hidden" />
      
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg lg:hidden"
      >
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-1 group"
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--color-brand-primary)] text-white shadow-md"
                      : "text-gray-500 hover:text-[var(--color-brand-primary)]"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive ? "text-[var(--color-brand-primary)]" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="publicActiveNav"
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