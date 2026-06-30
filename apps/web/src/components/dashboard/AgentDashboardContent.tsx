import { useQuery } from "@tanstack/react-query";
import { Card, Badge, Spinner } from "@/ui";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { RecentProperties } from "./RecentProperties";
import { Building2, Users, Calendar, Wallet, Plus, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { WalletService } from "@/services/wallet.service";
import { InspectionService } from "@/services/inspection.service";

interface AgentDashboardContentProps {
  properties: any[];
  loading: boolean;
}

export function AgentDashboardContent({ properties, loading }: AgentDashboardContentProps) {
  const { user } = useAuthStore();

  // Active listings (properties that are available or active)
  const activeListings = properties?.filter((p: any) => 
    p.status === "AVAILABLE" || p.status === "ACTIVE" || p.approvalStatus === "approved"
  ).length || 0;

  // Total clients (unique clients from properties)
  const totalClients = properties?.reduce((acc: number, p: any) => {
    // If property has clientId or buyerId
    if (p.clientId) return acc + 1;
    if (p.buyerId) return acc + 1;
    // If property has inquiries or interested users
    return acc + (p.interestedUsers?.length || 0);
  }, 0) || 0;

  // Fetch appointments/inspections
  const { data: inspectionsData, isLoading: inspectionsLoading } = useQuery({
    queryKey: ["agent-inspections"],
    queryFn: () => InspectionService.getMyInspections(),
    enabled: !!user,
  });

  const appointments = inspectionsData?.data?.data || inspectionsData?.data || [];
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a: any) => 
    a.status === "PENDING" || a.status === "CONFIRMED"
  ).length;

  // Fetch commission from wallet transactions
  const { data: commissionData, isLoading: commissionLoading } = useQuery({
    queryKey: ["agent-commission"],
    queryFn: () => WalletService.getTransactions({limit: 50}),
    enabled: !!user,
  });

  const totalCommission = commissionData?.data?.data
    ?.filter((tx: any) => tx.type === "CREDIT" && tx.metadata?.commission)
    ?.reduce((sum: number, tx: any) => sum + tx.amount, 0) || 0;

  // Fetch inquiries count (you'll need to implement this endpoint)
  // For now using a placeholder or calculating from properties
  const totalInquiries = properties?.reduce((acc: number, p: any) => {
    return acc + (p.inquiries?.length || p.inquiryCount || 0);
  }, 0) || 0;

  const stats = [
    { 
      label: "Active Listings", 
      value: activeListings, 
      icon: Building2, 
      color: "bg-blue-500",
      link: "/agent/properties",
    },
    { 
      label: "Total Clients", 
      value: totalClients, 
      icon: Users, 
      color: "bg-green-500",
      link: "/agent/clients",
    },
    { 
      label: "Appointments", 
      value: pendingAppointments, 
      icon: Calendar, 
      color: "bg-purple-500",
      link: "/agent/appointments",
    },
    { 
      label: "Commission", 
      value: `₦${totalCommission.toLocaleString()}`, 
      icon: Wallet, 
      color: "bg-orange-500",
      link: "/agent/commission",
    },
  ];

  const quickActions = [
    { 
      label: "Add Property", 
      path: "/agent/properties/create", 
      icon: Plus, 
      variant: "primary" 
    },
    { 
      label: `View Inquiries (${totalInquiries})`, 
      path: "/agent/inquiries", 
      icon: MessageSquare, 
      variant: "secondary" 
    },
  ];

  // Show loading state
  if (loading || inspectionsLoading || commissionLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-xl" />
            </div>
          ))}
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

      {/* Recent Properties */}
      <RecentProperties 
        properties={properties} 
        viewAllLink="/agent/properties"
        addLink="/agent/properties/create"
        showAddButton={true}
      />

      {/* Recent Appointments (Optional) */}
      {appointments.length > 0 && (
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-brand-text)]">
              Recent Appointments
            </h2>
            <a href="/agent/appointments" className="text-sm text-[var(--color-brand-primary)] hover:underline">
              View All
            </a>
          </div>
          <div className="space-y-3">
            {appointments.slice(0, 3).map((appointment: any) => (
              <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">
                    {appointment.propertyId?.title || "Property Viewing"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {appointment.userId?.firstName} {appointment.userId?.lastName} • {new Date(appointment.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={
                    appointment.status === "CONFIRMED" ? "success" :
                    appointment.status === "PENDING" ? "warning" :
                    appointment.status === "CANCELLED" ? "danger" : "default"
                  }>
                    {appointment.status || "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <QuickActions actions={quickActions} columns={2} />
    </div>
  );
}