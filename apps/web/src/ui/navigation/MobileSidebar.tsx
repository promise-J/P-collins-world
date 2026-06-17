import React, { useEffect } from "react"; // 1. Added useEffect for body scroll locks
import { LucideIcon, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarItem {
  path: string;
  label: string;
  // Type the icon as a component constructor function cleanly
  icon?: any;
  // icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface MobileSidebarProps {
  open: boolean;
  items: SidebarItem[]; // 2. Swapped any[] for clear contract definition
  onClose: () => void;
}

export function MobileSidebar({ open, items, onClose }: MobileSidebarProps) {
  const location = useLocation();

  // 3. FIX: Lock background window scrolling when sidebar drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset"; // Cleanup on unmount
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            // 4. FIX: Added flex, h-full, and overflow-y-auto so long lists scroll comfortably
            className="fixed left-0 top-0 bottom-0 h-full w-72 bg-[var(--color-brand-text)] text-white z-50 flex flex-col overflow-y-auto lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
              <h2 className="text-xl font-bold">P Collins</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* 5. FIX: flex-1 ensures navigation maps properly inside scrolling drawers */}
            <nav className="p-4 space-y-2 flex-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
                      ${isActive 
                        ? "bg-[var(--color-brand-primary)] text-white font-medium" 
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
