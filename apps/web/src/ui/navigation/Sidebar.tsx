import { NavLink } from "react-router-dom";

interface SidebarProps {
  items: any[];
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
              {Icon && <Icon size={20} />}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}