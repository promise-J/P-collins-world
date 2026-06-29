import { Link } from "react-router-dom";
import { Card, Button, Badge } from "@/ui";
import { Users, Target, Wallet, Clock, UserCheck, UserPlus } from "lucide-react";
import { GoalProgress } from "../goals/GoalProgress";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SavingsService } from "@/services/savings.service";
import toast from "react-hot-toast";

interface GroupCardProps {
  group: any;
  isMember?: boolean;
}

export function GroupCard({ group, isMember = false }: GroupCardProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const percentage = Math.floor((group.currentAmount / group.targetAmount) * 100);
  const memberCount = group.members?.length || 0;
  const isOwner = group.ownerId?._id === user?._id || group.ownerId === user?._id;

  const joinMutation = useMutation({
    mutationFn: () => SavingsService.joinGroup(group._id),
    onSuccess: () => {
      toast.success("Successfully joined the group!");
      queryClient.invalidateQueries({ queryKey: ["all-groups"] });
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to join group");
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => SavingsService.leaveGroup(group._id),
    onSuccess: () => {
      toast.success("Successfully left the group");
      queryClient.invalidateQueries({ queryKey: ["all-groups"] });
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to leave group");
    },
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "FOOD": return "🍽️";
      case "GADGET": return "📱";
      case "RENT": return "🏠";
      case "BUSINESS": return "💼";
      default: return "🎯";
    }
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    joinMutation.mutate();
  };

  const handleLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to leave "${group.name}"?`)) {
      leaveMutation.mutate();
    }
  };

  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-300">
      <Link to={`/savings/groups/${group._id}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(group.goal?.category)}</span>
            <h3 className="font-semibold text-[var(--color-brand-text)] line-clamp-1">
              {group.name}
            </h3>
          </div>
          {group.isLocked ? (
            <Badge variant="warning">Locked</Badge>
          ) : group.currentAmount >= group.targetAmount ? (
            <Badge variant="success">Completed</Badge>
          ) : (
            <Badge variant="primary">Active</Badge>
          )}
        </div>

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
          {group.isLocked && (
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <Clock size={14} />
              <span>Group is locked</span>
            </div>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="flex gap-2">
        <Link to={`/savings/groups/${group._id}`} className="flex-1">
          <Button className="w-full">View Details</Button>
        </Link>
        {isMember ? (
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={handleLeave}
            disabled={leaveMutation.isPending || isOwner}
          >
            {leaveMutation.isPending ? "Leaving..." : "Leave"}
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={handleJoin}
            disabled={joinMutation.isPending || group.isLocked}
          >
            {joinMutation.isPending ? "Joining..." : <><UserPlus size={14} className="mr-1" /> Join</>}
          </Button>
        )}
      </div>
    </Card>
  );
}