import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, Spinner } from "@/ui";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { Wallet, ShoppingBag, Building2, Target, Plus } from "lucide-react";
import { WalletService } from "@/services/wallet.service";
import { OrderService } from "@/services/order.service";
import { SavingsService } from "@/services/savings.service";
import { useAuthStore } from "@/store/auth.store";

interface UserDashboardContentProps {
  properties: any[];
  loading: boolean;
}

export function UserDashboardContent({
  properties,
  loading,
}: UserDashboardContentProps) {
  const { user } = useAuthStore();

  // Fetch wallet balance
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: () => WalletService.getWallet(),
    enabled: !!user,
  });

  // Fetch orders count
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders-count"],
    queryFn: () => OrderService.getMyOrders({ limit: 1 }),
    enabled: !!user,
  });

  // Fetch savings
  const { data: savingsData, isLoading: savingsLoading } = useQuery({
    queryKey: ["savings-total"],
    queryFn: () => SavingsService.getMyPlans(),
    enabled: !!user,
  });

  const wallet = walletData?.data?.wallet || walletData?.wallet || { balance: 0 };
  const balance = wallet.balance || 0;
  
  const orders = ordersData?.data?.data || ordersData?.data || [];
  const activeOrders = orders.filter((order: any) => 
    order.status === "PENDING" || order.status === "PAID" || order.status === "SHIPPED"
  ).length;

  const savings = savingsData?.data || [];
  const totalSavings = savings.reduce((sum: number, plan: any) => sum + (plan.currentAmount || 0), 0);

  const stats = [
    {
      label: "Wallet Balance",
      value: `₦${balance.toLocaleString()}`,
      icon: Wallet,
      color: "bg-green-500",
      link: "/wallet",
    },
    {
      label: "Active Orders",
      value: activeOrders,
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
      label: "Total Savings",
      value: `₦${totalSavings.toLocaleString()}`,
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

  // Show loading state
  if (walletLoading || ordersLoading || savingsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-10 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-xl" />
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

      {/* Quick Actions */}
      <QuickActions actions={quickActions} columns={4} />

      {/* Recent Properties */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-brand-text">
            Recent Properties
          </h2>
          <Link
            to="/properties"
            className="text-sm text-brand-primary hover:underline"
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
                    <p className="text-sm font-bold text-brand-primary">
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