// 📄 File: QuickActions.tsx
import { Link } from "react-router-dom";
import { Button } from "@/ui";

export interface QuickAction {
  label: string;
  path: string;
  icon: any; // 🟢 Using 'any' so Lucide icons pass without complex generic errors
  variant?: any; // 🟢 Allows loose string matching while keeping your defaults
}

interface QuickActionsProps {
  actions: QuickAction[];
  columns?: 2 | 3 | 4 | 6;
}

export function QuickActions({ actions, columns = 4 }: QuickActionsProps) {
  const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-6",
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-3`}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.path} to={action.path} className="w-full block">
            <Button variant={action.variant || "secondary"} className="w-full">
              {/* {Icon && <Icon size={16} className="mr-2" />} */}
              {action.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
