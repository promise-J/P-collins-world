import { Link } from "react-router-dom";
import { Card, Button, Badge } from "@/ui";
import { Users, Target, Wallet, Lock, Clock } from "lucide-react";
import { GoalProgress } from "../goals/GoalProgress";

export function GroupCard({ group }: any) {
  const percentage = Math.floor((group.currentAmount / group.targetAmount) * 100);
  const memberCount = group.members.length;
  const isOwner = group.ownerId?._id === "currentUserId"; // Replace with actual user check

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "FOOD": return "🍽️";
      case "GADGET": return "📱";
      case "RENT": return "🏠";
      case "BUSINESS": return "💼";
      default: return "🎯";
    }
  };

  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(group.goal?.category)}</span>
          <h3 className="font-semibold text-[var(--color-brand-text)] line-clamp-1">
            {group.name}
          </h3>
        </div>
        {group.isLocked ? (
          <Badge variant="warning">Locked</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )}
      </div>

      {/* Goal */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {group.goal?.title || "Group Savings Goal"}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{percentage}%</span>
        </div>
        <GoalProgress current={group.currentAmount} target={group.targetAmount} />
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Users size={14} />
            <span>{memberCount} members</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Target size={14} />
            <span>₦{group.contributionAmount?.toLocaleString()}/ea</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Wallet size={14} />
            <span>₦{group.currentAmount?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={14} />
            <span>{group.lockPeriodDays} days lock</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link to={`/savings/groups/${group._id}`} className="flex-1">
          <Button className="w-full">View Details</Button>
        </Link>
        {isOwner && (
          <Button variant="secondary">
            Manage
          </Button>
        )}
      </div>
    </Card>
  );
}