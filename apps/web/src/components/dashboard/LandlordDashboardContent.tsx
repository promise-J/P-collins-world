import { useQuery } from "@tanstack/react-query";
import { Card, Badge, Spinner } from "@/ui";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { RecentProperties } from "./RecentProperties";
import { Building2, Users, CreditCard, TrendingUp, Plus, UserCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { PropertyService } from "@/services/property.service";
import { WalletService } from "@/services/wallet.service";

interface LandlordDashboardContentProps {
  properties: any[];
  loading: boolean;
}

export function LandlordDashboardContent({ properties, loading }: LandlordDashboardContentProps) {
  const { user } = useAuthStore();

  // Fetch tenant count (you'll need to implement this endpoint)
  // For now, we'll calculate from properties
  const totalTenants = properties?.reduce((acc: number, prop: any) => {
    // If property has tenants array or tenant count
    return acc + (prop.tenantCount || prop.tenants?.length || 0);
  }, 0) || 0;

  // Fetch rent payments (you'll need to implement this endpoint)
  const { data: rentData, isLoading: rentLoading } = useQuery({
    queryKey: ["landlord-rent"],
    queryFn: () => WalletService.getTransactions(),
    enabled: !!user,
  });

  // Calculate monthly rent from wallet transactions
  const monthlyRent = rentData?.data?.data
    ?.filter((tx: any) => tx.type === "CREDIT" && tx.metadata?.rentPayment)
    ?.reduce((sum: number, tx: any) => sum + tx.amount, 0) || 0;

  // Calculate occupancy rate
  const totalProperties = properties?.length || 0;
  const occupiedProperties = properties?.filter((p: any) => 
    p.status === "OCCUPIED" || p.status === "RESERVED"
  ).length || 0;
  const occupancyRate = totalProperties > 0 
    ? Math.round((occupiedProperties / totalProperties) * 100) 
    : 0;

  const stats = [
    { 
      label: "Properties", 
      value: totalProperties, 
      icon: Building2, 
      color: "bg-blue-500",
      link: "/landlord/properties",
    },
    { 
      label: "Active Tenants", 
      value: totalTenants, 
      icon: Users, 
      color: "bg-green-500",
      link: "/landlord/tenants",
    },
    { 
      label: "Monthly Rent", 
      value: `₦${monthlyRent.toLocaleString()}`, 
      icon: CreditCard, 
      color: "bg-purple-500",
      link: "/landlord/rentals",
    },
    { 
      label: "Occupancy Rate", 
      value: `${occupancyRate}%`, 
      icon: TrendingUp, 
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    { 
      label: "Add Property", 
      path: "/landlord/properties/create", 
      icon: Plus, 
      variant: "primary" 
    },
    { 
      label: "Manage Tenants", 
      path: "/landlord/tenants", 
      icon: UserCheck, 
      variant: "secondary" 
    },
  ];

  if (loading || rentLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
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

      {/* Rent Collection */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)]">Recent Rent Payments</h2>
          <a href="/landlord/rentals" className="text-sm text-[var(--color-brand-primary)] hover:underline">
            View All
          </a>
        </div>
        <div className="space-y-3">
          {rentData?.data?.data?.slice(0, 5).map((tx: any) => (
            <div key={tx._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">
                  {tx.metadata?.propertyName || "Rent Payment"}
                </p>
                <p className="text-xs text-gray-500">
                  {tx.metadata?.tenantName || "Tenant"} • {new Date(tx.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₦{tx.amount.toLocaleString()}</p>
                <Badge variant={tx.status === "SUCCESS" ? "success" : "warning"}>
                  {tx.status || "Pending"}
                </Badge>
              </div>
            </div>
          ))}
          {(!rentData?.data?.data || rentData.data.data.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No rent payments recorded yet
            </div>
          )}
        </div>
      </Card>

      {/* Recent Properties */}
      <RecentProperties 
        properties={properties} 
        viewAllLink="/landlord/properties"
        addLink="/landlord/properties/create"
        showAddButton={true}
      />

      {/* Quick Actions */}
      <QuickActions actions={quickActions} columns={2} />
    </div>
  );
}