import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SavingsService, dummyPersonalPlans } from "@/services/savings.service";
import { Button, Card, Spinner } from "@/ui";
import { Plus, Target, Calendar, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/ui/components/Container";
import { CreateSavingsGoalModal } from "@/components/goals/CreateSavingsGoalModal";
import { SavingsGoalCard } from "@/components/goals/SavingsGoalCard";

// Set to true to use dummy data for testing
const USE_DUMMY_DATA = true;

export default function SavingsGoalPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["savings-plans"],
    queryFn: () =>
      USE_DUMMY_DATA
        ? SavingsService.getDummyPlans()
        : SavingsService.getMyPlans(),
  });

  const plans = data?.data || [];
  const totalSaved = plans.reduce((sum: number, plan: any) => sum + plan.currentAmount, 0);
  const activePlans = plans.filter((p: any) => !p.isCompleted).length;
  const completedPlans = plans.filter((p: any) => p.isCompleted).length;

  const stats = [
    {
      label: "Total Saved",
      value: `₦${totalSaved.toLocaleString()}`,
      icon: Wallet,
      color: "bg-green-500",
    },
    {
      label: "Active Plans",
      value: activePlans,
      icon: Target,
      color: "bg-blue-500",
    },
    {
      label: "Completed",
      value: completedPlans,
      icon: TrendingUp,
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
              Personal Savings
            </h1>
            <p className="text-gray-500 mt-1">
              Track and manage your savings goals
            </p>
            {USE_DUMMY_DATA && (
              <div className="mt-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                ⚡ Demo Mode - Using Sample Data
              </div>
            )}
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={18} className="mr-2" />
            New Savings Goal
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

        {/* Savings Plans Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-brand-text)] mb-2">
              No Savings Goals Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start saving towards your financial goals today
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan: any) => (
              <SavingsGoalCard key={plan._id} goal={plan} />
            ))}
          </div>
        )}

        {/* Create Modal */}
        <CreateSavingsGoalModal
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