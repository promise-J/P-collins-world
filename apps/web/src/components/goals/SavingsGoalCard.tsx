import { useState } from "react";
import { Card, Button, Badge } from "@/ui";
import { Target, Calendar, TrendingUp, Clock, Wallet } from "lucide-react";
import { GoalProgress } from "./GoalProgress";
import { GoalContributionModal } from "./GoalContributionModal";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export function SavingsGoalCard({ goal }: any) {
  const [showContributeModal, setShowContributeModal] = useState(false);
  
  const percentage = Math.floor((goal.currentAmount / goal.targetAmount) * 100);
  const isCompleted = goal.isCompleted || percentage >= 100;
  const daysRemaining = goal.endDate 
    ? Math.ceil((new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "DAILY": return "Daily";
      case "WEEKLY": return "Weekly";
      case "MONTHLY": return "Monthly";
      default: return frequency;
    }
  };

  return (
    <>
      <Card className="p-5 hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[var(--color-brand-primary)]/10">
              <Target size={18} className="text-[var(--color-brand-primary)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-brand-text)] line-clamp-1">
              {goal.targetAmount?.toLocaleString()} Goal
            </h3>
          </div>
          {isCompleted ? (
            <Badge variant="success">Completed</Badge>
          ) : (
            <Badge variant="primary">In Progress</Badge>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <GoalProgress current={goal.currentAmount} target={goal.targetAmount} />
        </div>

        {/* Amounts */}
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500">Saved</p>
            <p className="font-semibold text-[var(--color-brand-primary)]">
              ₦{goal.currentAmount?.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Target</p>
            <p className="font-semibold">
              ₦{goal.targetAmount?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>
              {goal.frequency ? `${getFrequencyLabel(goal.frequency)} savings` : "Flexible savings"}
            </span>
          </div>
          {goal.autoDebit && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Wallet size={14} />
              <span>Auto-debit enabled</span>
            </div>
          )}
          {daysRemaining && daysRemaining > 0 && !isCompleted && (
            <div className="flex items-center gap-2 text-sm text-orange-500">
              <Calendar size={14} />
              <span>{daysRemaining} days remaining</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowContributeModal(true)}
            className="flex-1"
            disabled={isCompleted}
          >
            Contribute
          </Button>
          <Link to={`/savings/plan/${goal._id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              Details
            </Button>
          </Link>
        </div>
      </Card>

      <GoalContributionModal
        open={showContributeModal}
        goalId={goal._id}
        goalName={`₦${goal.targetAmount?.toLocaleString()} Goal`}
        currentAmount={goal.currentAmount}
        targetAmount={goal.targetAmount}
        onClose={() => setShowContributeModal(false)}
        onSuccess={() => {
          setShowContributeModal(false);
          window.location.reload();
        }}
      />
    </>
  );
}