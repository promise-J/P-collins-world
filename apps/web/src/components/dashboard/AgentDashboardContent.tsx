import { Card } from "@/ui";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { RecentProperties } from "./RecentProperties";
import { Building2, Users, Calendar, Wallet, Plus, MessageSquare } from "lucide-react";

interface AgentDashboardContentProps {
  properties: any[];
  loading: boolean;
}

export function AgentDashboardContent({ properties }: AgentDashboardContentProps) {
  const stats = [
    { label: "Active Listings", value: properties?.length || 0, icon: Building2, color: "bg-blue-500" },
    { label: "Total Clients", value: "12", icon: Users, color: "bg-green-500" },
    { label: "Appointments", value: "8", icon: Calendar, color: "bg-purple-500" },
    { label: "Commission", value: "₦850,000", icon: Wallet, color: "bg-orange-500" },
  ];

  const quickActions = [
    { label: "Add Property", path: "/agent/properties/create", icon: Plus, variant: "primary" },
    { label: "View Inquiries", path: "/agent/inquiries", icon: MessageSquare, variant: "secondary" },
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

      <RecentProperties 
        properties={properties} 
        viewAllLink="/agent/properties"
        addLink="/agent/properties/create"
        showAddButton={true}
      />

      <QuickActions actions={quickActions} columns={2} />
    </div>
  );
}