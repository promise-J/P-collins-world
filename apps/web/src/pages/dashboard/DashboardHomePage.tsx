import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { Button, Spinner } from "@/ui";
import { 
  FileText, 
  ShoppingBag, 
  Plus,
  Home
} from "lucide-react";
import { AdminService } from "@/services/admin.service";
import { PropertyService } from "@/services/property.service";
import { AdminDashboardContent } from "@/components/dashboard/AdminDashboardContent";
import { AgentDashboardContent } from "@/components/dashboard/AgentDashboardContent";
import { LandlordDashboardContent } from "@/components/dashboard/LandlordDashboardContent";
import { UserDashboardContent } from "@/components/dashboard/UserDashboardContent";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dateRange] = useState<"week" | "month" | "year">("month");

  // Determine user role
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isAgent = user?.role === "AGENT";
  const isLandlord = user?.role === "LANDLORD";
  const isUser = user?.role === "USER";



  // Fetch data based on role
  const { data: adminMetrics, isLoading: adminLoading } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: () => AdminService.getDashboardMetrics(),
    enabled: isAdmin,
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["user-properties"],
    queryFn: () => PropertyService.list({ limit: 5 }),
    enabled: !isAdmin,
  });

  // Loading state
  if (adminLoading || propertiesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Render different dashboard content based on role
  return (
    <div className="space-y-6">
      {/* Welcome Section - Common for all roles */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-brand-text)]">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-500 mt-1">
            {isAdmin && "Here's an overview of platform performance"}
            {isAgent && "Manage your property listings and clients"}
            {isLandlord && "Track your properties and rent collections"}
            {isUser && "Discover new properties, shop, and save"}
          </p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Button variant="secondary" size="sm">
              <FileText size={16} className="mr-2" />
              Export Report
            </Button>
          )}
          {(isAgent || isLandlord) && (
            <Link to={isAgent ? "/agent/properties/create" : "/landlord/properties/create"}>
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Property
              </Button>
            </Link>
          )}
          {isUser && (
            <Link to="/products">
              <Button size="sm">
                <ShoppingBag size={16} className="mr-2" />
                Start Shopping
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Role-specific Content */}
      {isAdmin && <AdminDashboardContent metrics={adminMetrics?.data} loading={adminLoading} />}
      {isAgent && <AgentDashboardContent properties={properties?.data} loading={propertiesLoading} />}
      {isLandlord && <LandlordDashboardContent properties={properties?.data} loading={propertiesLoading} />}
      {isUser && <UserDashboardContent properties={properties?.data} loading={propertiesLoading} />}
    </div>
  );
}