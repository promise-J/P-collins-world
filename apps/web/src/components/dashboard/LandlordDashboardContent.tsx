import { Card, Badge } from "@/ui";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { RecentProperties } from "./RecentProperties";
import { Building2, Users, CreditCard, TrendingUp, Plus, UserCheck } from "lucide-react";

interface LandlordDashboardContentProps {
  properties: any[];
  loading: boolean;
}

export function LandlordDashboardContent({ properties }: LandlordDashboardContentProps) {
  const stats = [
    { label: "Properties", value: properties?.length || 0, icon: Building2, color: "bg-blue-500" },
    { label: "Active Tenants", value: "8", icon: Users, color: "bg-green-500" },
    { label: "Monthly Rent", value: "₦1,200,000", icon: CreditCard, color: "bg-purple-500" },
    { label: "Occupancy Rate", value: "94%", icon: TrendingUp, color: "bg-orange-500" },
  ];

  const quickActions = [
    { label: "Add Property", path: "/landlord/properties/create", icon: Plus, variant: "primary" },
    { label: "Manage Tenants", path: "/landlord/tenants", icon: UserCheck, variant: "secondary" },
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
          />
        ))}
      </div>

      {/* Rent Collection */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)]">Rent Collection</h2>
          <a href="/landlord/rentals" className="text-sm text-[var(--color-brand-primary)] hover:underline">
            View All
          </a>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Luxury Apartment - Unit 3</p>
              <p className="text-xs text-gray-500">Due: June 30, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₦250,000</p>
              <Badge variant="success">Paid</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Commercial Space - Shop 5</p>
              <p className="text-xs text-gray-500">Due: July 15, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₦400,000</p>
              <Badge variant="warning">Pending</Badge>
            </div>
          </div>
        </div>
      </Card>

      <RecentProperties 
        properties={properties} 
        viewAllLink="/landlord/properties"
        addLink="/landlord/properties/create"
        showAddButton={true}
      />

      <QuickActions actions={quickActions} columns={2} />
    </div>
  );
}