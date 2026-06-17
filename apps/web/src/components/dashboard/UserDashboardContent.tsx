import { Link } from "react-router-dom";
import { Card, Button } from "@/ui";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { Wallet, ShoppingBag, Building2, Target, Plus } from "lucide-react";

interface UserDashboardContentProps {
  properties: any[];
  loading: boolean;
}

export function UserDashboardContent({
  properties,
}: UserDashboardContentProps) {
  const stats = [
    {
      label: "Wallet Balance",
      value: "₦25,000",
      icon: Wallet,
      color: "bg-green-500",
      link: "/wallet",
    },
    {
      label: "Active Orders",
      value: "3",
      icon: ShoppingBag,
      color: "bg-blue-500",
      link: "/orders",
    },
    {
      label: "Saved Properties",
      value: properties?.length || 0,
      icon: Building2,
      color: "bg-purple-500",
      link: "/properties/favorites",
    },
    {
      label: "Savings",
      value: "₦0",
      icon: Target,
      color: "bg-orange-500",
      link: "/savings",
    },
  ];

  const quickActions = [
    {
      label: "Fund Wallet",
      path: "/wallet/fund",
      icon: Wallet,
      variant: "primary",
    },
    {
      label: "Start Shopping",
      path: "/products",
      icon: ShoppingBag,
      variant: "secondary",
    },
    {
      label: "Browse Properties",
      path: "/properties",
      icon: Building2,
      variant: "secondary",
    },
    {
      label: "Create Savings",
      path: "/savings",
      icon: Target,
      variant: "secondary",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard
            key={stat.label}
            title={stat.label} 
            value={stat.value}
            icon={stat.icon as any}
            color={stat.color}
            link={stat.link}
          />
        ))}
      </div>

      <QuickActions actions={quickActions} columns={4} />

      {/* Recent Properties */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)]">
            Recent Properties
          </h2>
          <Link
            to="/properties"
            className="text-sm text-[var(--color-brand-primary)] hover:underline"
          >
            View All
          </Link>
        </div>
        {properties?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No properties to show</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {properties?.slice(0, 3).map((property: any) => (
              <Link key={property._id} to={`/properties/${property._id}`}>
                <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={
                      property.media?.[0]?.url ||
                      "https://via.placeholder.com/300x200"
                    }
                    alt={property.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-medium text-sm line-clamp-1">
                      {property.title}
                    </p>
                    <p className="text-sm font-bold text-[var(--color-brand-primary)]">
                      ₦{property.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
