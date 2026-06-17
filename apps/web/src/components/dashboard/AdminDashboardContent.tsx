import { Card } from "@/ui";
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

interface AdminDashboardContentProps {
  metrics: any;
  loading: boolean;
}

export function AdminDashboardContent({ metrics }: AdminDashboardContentProps) {
  const stats = [
    { title: "Total Users", value: metrics?.users?.toLocaleString() || "0", icon: Users, color: "bg-blue-500", link: "/admin/users" },
    { title: "Total Products", value: metrics?.products?.toLocaleString() || "0", icon: Package, color: "bg-green-500", link: "/admin/products" },
    { title: "Total Properties", value: metrics?.properties?.toLocaleString() || "0", icon: Home, color: "bg-purple-500", link: "/admin/properties" },
    { title: "Total Orders", value: metrics?.orders?.toLocaleString() || "0", icon: ShoppingBag, color: "bg-orange-500", link: "/admin/orders" },
    { title: "Savings Plans", value: metrics?.savingsPlans?.toLocaleString() || "0", icon: Wallet, color: "bg-teal-500", link: "/admin/savings" },
    { title: "Total Revenue", value: `₦${metrics?.revenue?.toLocaleString() || "0"}`, icon: DollarSign, color: "bg-emerald-500", link: "/admin/revenue" },
  ];

  const quickActions = [
    { label: "Manage Users", path: "/admin/users", icon: Users },
    { label: "Review KYC", path: "/admin/kyc", icon: Shield },
    { label: "Properties", path: "/admin/properties", icon: Building2 },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Transactions", path: "/admin/transactions", icon: CreditCard },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">Quick Actions</h2>
        <QuickActions actions={quickActions} columns={6} />
      </Card>
    </div>
  );
}