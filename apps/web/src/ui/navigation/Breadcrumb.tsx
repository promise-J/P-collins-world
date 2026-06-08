import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({
  items
}: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="flex items-center gap-2"
        >
          <span>{item.label}</span>

          {index !==
            items.length - 1 && (
            <ChevronRight size={16} />
          )}
        </div>
      ))}
    </div>
  );
}