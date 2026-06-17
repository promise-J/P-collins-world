import { Link } from "react-router-dom";
import { Card } from "@/ui";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  link?: string;
  subtitle?: string;
}

export function StatsCard({ title, value, icon: Icon, color, link, subtitle }: StatsCardProps) {
  const content = (
    <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-brand-text)] mt-1">
            {value}
          </p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className={`${color.replace("bg-", "text-")}`} size={20} />
        </div>
      </div>
    </Card>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
}