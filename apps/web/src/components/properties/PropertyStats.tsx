import { Card } from '@/ui';
import { Eye, Heart, Share2, CalendarCheck, TrendingUp } from 'lucide-react';

interface PropertyStatsProps {
  views: number;
  favorites: number;
  shares: number;
  inspections: number;
  viewsTrend?: number;
}

export function PropertyStats({ views, favorites, shares, inspections, viewsTrend }: PropertyStatsProps) {
  const stats = [
    {
      label: 'Total Views',
      value: views.toLocaleString(),
      icon: Eye,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      trend: viewsTrend,
    },
    {
      label: 'Favorites',
      value: favorites.toLocaleString(),
      icon: Heart,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      label: 'Shares',
      value: shares.toLocaleString(),
      icon: Share2,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      label: 'Inspection Requests',
      value: inspections.toLocaleString(),
      icon: CalendarCheck,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-[var(--color-brand-text)] mt-1">
                  {stat.value}
                </p>
                {stat.trend && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-xs text-green-500">+{stat.trend}%</span>
                  </div>
                )}
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <Icon size={20} className={stat.color} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}