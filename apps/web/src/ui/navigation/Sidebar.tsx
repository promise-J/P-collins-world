import { NavLink } from "react-router-dom";
import { 
  Home, 
  Building2, 
  Wallet, 
  ShoppingBag, 
  Bell, 
  User, 
  Settings,
  Shield,
  Store,
  Package,
  BarChart3,
  Users,
  FileText,
  Plus,
  CreditCard,
  Star,
  MessageSquare,
  Calendar,
  Briefcase,
  LogOut,
  Heart
} from "lucide-react";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col border-r border-white/10 bg-[var(--color-brand-text)] text-white sticky left-0 top-0">
      <div className="border-b border-white/10 p-6">
        <h2 className="text-xl font-bold">P Collins</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          if (!Icon) {
            console.warn(`Icon missing for ${item.label}`);
            return null;
          }
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
                 ${isActive 
                   ? "bg-[var(--color-brand-primary)] text-white" 
                   : "text-white/80 hover:bg-white/10 hover:text-white"
                 }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}