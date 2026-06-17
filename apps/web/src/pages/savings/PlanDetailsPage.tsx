import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SavingsService, dummyPersonalPlans } from "@/services/savings.service";
import { Button, Card, Badge, Spinner } from "@/ui";
import {
  ArrowLeft,
  Target,
  Calendar,
  TrendingUp,
  Wallet,
  Clock,
  AlertCircle,
  CreditCard,
  CheckCircle,
  Lock,
} from "lucide-react";
import { GoalProgress } from "@/components/goals/GoalProgress";
import { BreakSavingsModal } from "@/components/goals/BreakingSavingModal";
import Container from "@/ui/components/Container";
import { GoalContributionModal } from "@/components/goals/GoalContributionModal";


const USE_DUMMY_DATA = true;

export default function PlanDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["savings-plan", id],
    queryFn: () =>
      USE_DUMMY_DATA
        ? Promise.resolve({
            success: true,
            data:
              dummyPersonalPlans.find((p) => p._id === id) ||
              dummyPersonalPlans[0],
          })
        : SavingsService.getPlanDetails(id!),
  });

  const plan = data?.data;

  if (isLoading) {
    return (
      <Container>
        <div className="py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="h-64 bg-gray-200 rounded-xl mb-6" />
            <div className="h-32 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container>
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-2">
            Plan Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The savings plan you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/savings")}>Back to Savings</Button>
        </div>
      </Container>
    );
  }

  const percentage = Math.floor((plan.currentAmount / plan.targetAmount) * 100);
  const isCompleted = plan.isCompleted || percentage >= 100;
  const remaining = plan.targetAmount - plan.currentAmount;

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "DAILY":
        return "Daily";
      case "WEEKLY":
        return "Weekly";
      case "MONTHLY":
        return "Monthly";
      default:
        return frequency;
    }
  };

  return (
    <Container>
      <div className="py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/savings")}
          className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-brand-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Savings
        </button>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[var(--color-brand-primary)]/10">
                <Target
                  size={24}
                  className="text-[var(--color-brand-primary)]"
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-brand-text)]">
                ₦{plan.targetAmount?.toLocaleString()} Goal
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <Badge variant="success">Completed ✓</Badge>
              ) : (
                <Badge variant="primary">In Progress</Badge>
              )}
              <Badge variant="default">
                {getFrequencyLabel(plan.frequency)} Savings
              </Badge>
              {plan.autoDebit && (
                <Badge variant="secondary">Auto-Debit ON</Badge>
              )}
            </div>
          </div>
          {!isCompleted && (
            <div className="flex gap-3">
              <Button onClick={() => setShowContributeModal(true)}>
                <Wallet size={18} className="mr-2" />
                Contribute
              </Button>
              <Button onClick={() => setShowBreakModal(true)} variant="danger">
                <Lock size={18} className="mr-2" />
                Break Savings
              </Button>
            </div>
          )}
        </div>

        {/* Main Stats Card */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-3xl font-bold text-[var(--color-brand-primary)]">
                ₦{plan.currentAmount?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                of ₦{plan.targetAmount?.toLocaleString()} target
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-2xl font-semibold text-orange-500">
                ₦{remaining.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Progress</p>
              <p className="text-2xl font-semibold">{percentage}%</p>
            </div>
          </div>

          <div className="mt-6">
            <GoalProgress
              current={plan.currentAmount}
              target={plan.targetAmount}
              showPercentage
            />
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
              <Calendar
                size={20}
                className="text-[var(--color-brand-primary)]"
              />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Start Date</span>
                <span className="font-medium">
                  {plan.startDate
                    ? new Date(plan.startDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">End Date</span>
                <span className="font-medium">
                  {plan.endDate
                    ? new Date(plan.endDate).toLocaleDateString()
                    : "Flexible"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="font-medium">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
              <TrendingUp
                size={20}
                className="text-[var(--color-brand-primary)]"
              />
              Savings Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Frequency</span>
                <span className="font-medium capitalize">
                  {plan.frequency?.toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Auto-Debit</span>
                <span
                  className={
                    plan.autoDebit ? "text-green-600" : "text-gray-500"
                  }
                >
                  {plan.autoDebit ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <Badge variant={isCompleted ? "success" : "primary"}>
                  {isCompleted ? "Completed" : "Active"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-700">
              About Personal Savings
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Personal savings have no penalties for breaking. You can withdraw
              your savings anytime. However, breaking a plan may affect your
              savings streak.
            </p>
          </div>
        </div>

        {/* Modals */}
        <GoalContributionModal
          open={showContributeModal}
          goalId={plan._id}
          goalName={`₦${plan.targetAmount?.toLocaleString()} Goal`}
          currentAmount={plan.currentAmount}
          targetAmount={plan.targetAmount}
          onClose={() => setShowContributeModal(false)}
          onSuccess={() => {
            setShowContributeModal(false);
            refetch();
          }}
        />

        <BreakSavingsModal
          open={showBreakModal}
          amount={plan.currentAmount}
          planId={plan._id}
          onClose={() => setShowBreakModal(false)}
          onSuccess={() => {
            setShowBreakModal(false);
            refetch();
            navigate("/savings");
          }}
        />
      </div>
    </Container>
  );
}
