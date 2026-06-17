import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SavingsService, dummyGroups } from "@/services/savings.service";
import { Button, Card, Spinner } from "@/ui";
import { Plus, Users, Target, Wallet, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/ui/components/Container";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";

const USE_DUMMY_DATA = true;

export default function SavingsGroupsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["savings-groups"],
    queryFn: () =>
      USE_DUMMY_DATA
        ? SavingsService.getDummyGroups()
        : SavingsService.getMyGroups(),
  });

  const groups = data?.data || [];
  const totalMembers = groups.reduce((sum: number, group: any) => sum + group.members.length, 0);
  const totalSaved = groups.reduce((sum: number, group: any) => sum + group.currentAmount, 0);

  const stats = [
    {
      label: "Total Groups",
      value: groups.length,
      icon: UsersRound,
      color: "bg-blue-500",
    },
    {
      label: "Total Members",
      value: totalMembers,
      icon: Users,
      color: "bg-green-500",
    },
    {
      label: "Total Saved",
      value: `₦${totalSaved.toLocaleString()}`,
      icon: Wallet,
      color: "bg-purple-500",
    },
  ];

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">
              Group Savings
            </h1>
            <p className="text-gray-500 mt-1">
              Join or create groups to save together towards common goals
            </p>
            {USE_DUMMY_DATA && (
              <div className="mt-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                ⚡ Demo Mode - Using Sample Data
              </div>
            )}
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={18} className="mr-2" />
            Create Group
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-[var(--color-brand-text)] mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <Icon className={`${stat.color.replace("bg-", "text-")}`} size={24} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Groups Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersRound size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-brand-text)] mb-2">
              No Groups Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create a group or join an existing one to start saving together
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Group
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group: any) => (
              <GroupCard key={group._id} group={group} />
            ))}
          </div>
        )}

        {/* Create Modal */}
        <CreateGroupModal
          open={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      </div>
    </Container>
  );
}