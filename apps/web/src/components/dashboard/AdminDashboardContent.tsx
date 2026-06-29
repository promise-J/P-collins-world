import { useQuery } from "@tanstack/react-query";
import { Card, Spinner } from "@/ui";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { 
  Users, 
  Package, 
  Home, 
  ShoppingBag, 
  Wallet, 
  DollarSign,
  Shield,
  FileText,
  CreditCard,
  BarChart3,
  Building2,
  UserCheck
} from "lucide-react";
import { AdminService } from "@/services/admin.service";

interface AdminDashboardContentProps {
  metrics: any;
  loading: boolean;
}

export function AdminDashboardContent({ metrics, loading }: AdminDashboardContentProps) {
  // Fetch additional real-time data if needed
  const { data: kycData, isLoading: kycLoading } = useQuery({
    queryKey: ["admin-pending-kyc-count"],
    queryFn: () => AdminService.getPendingKyc(),
    enabled: !!metrics,
  });

  const pendingKycCount = kycData?.data?.length || kycData?.length || 0;

  // Calculate revenue from orders or transactions
  // This assumes metrics has revenue data from the dashboard endpoint
  const revenue = metrics?.revenue || 0;

  // Get user role counts if available
  const userRoles = metrics?.userRoles || {};
  const totalUsers = metrics?.users || 0;
  const totalProducts = metrics?.products || 0;
  const totalProperties = metrics?.properties || 0;
  const totalOrders = metrics?.orders || 0;
  const savingsPlans = metrics?.savingsPlans || 0;

  const stats = [
    { 
      title: "Total Users", 
      value: totalUsers.toLocaleString(), 
      icon: Users, 
      color: "bg-blue-500", 
      link: "/admin/users",
      subtitle: `${userRoles.USER || 0} Users, ${userRoles.AGENT || 0} Agents, ${userRoles.LANDLORD || 0} Landlords`,
    },
    { 
      title: "Total Products", 
      value: totalProducts.toLocaleString(), 
      icon: Package, 
      color: "bg-green-500", 
      link: "/admin/products" 
    },
    { 
      title: "Total Properties", 
      value: totalProperties.toLocaleString(), 
      icon: Home, 
      color: "bg-purple-500", 
      link: "/admin/properties" 
    },
    { 
      title: "Total Orders", 
      value: totalOrders.toLocaleString(), 
      icon: ShoppingBag, 
      color: "bg-orange-500", 
      link: "/admin/orders" 
    },
    { 
      title: "Savings Plans", 
      value: savingsPlans.toLocaleString(), 
      icon: Wallet, 
      color: "bg-teal-500", 
      link: "/admin/savings" 
    },
    { 
      title: "Total Revenue", 
      value: `₦${revenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: "bg-emerald-500", 
      link: "/admin/revenue" 
    },
  ];

  const quickActions = [
    { label: "Manage Users", path: "/admin/users", icon: Users },
    { label: `Review KYC (${pendingKycCount})`, path: "/admin/kyc", icon: Shield },
    { label: "Properties", path: "/admin/properties", icon: Building2 },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Transactions", path: "/admin/transactions", icon: CreditCard },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  if (loading || kycLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-16 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">Quick Actions</h2>
        <QuickActions actions={quickActions} columns={6} />
      </Card>

      {/* Optional: Show pending KYC count */}
      {pendingKycCount > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">
                {pendingKycCount} KYC submissions pending review
              </p>
              <p className="text-sm text-yellow-700">
                Please review and verify user KYC documents
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}