import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SavingsService, dummyGroups } from "@/services/savings.service";
import { Button, Card, Badge, Spinner, Avatar } from "@/ui";
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Wallet, 
  Clock,
  Crown,
  Shield,
  User,
  Calendar,
  Lock,
} from "lucide-react";
import { GoalProgress } from "@/components/goals/GoalProgress";
import { GroupContributionModal } from "@/components/groups/GroupContributionModal";
import { GroupTreasuryCard } from "@/components/groups/GroupTreasuryCard";
import { GroupPenaltyCard } from "@/components/groups/GroupPenaltyCard";
import Container from "@/ui/components/Container";
import { useAuthStore } from "@/store/auth.store";
import { GroupMembers } from "@/components/groups/GroupMembers";

const USE_DUMMY_DATA = false;

export default function GroupDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showContributeModal, setShowContributeModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["savings-group", id],
    queryFn: () =>
      USE_DUMMY_DATA
        ? Promise.resolve({ 
            success: true, 
            data: dummyGroups.find(g => g._id === id) || dummyGroups[0] 
          })
        : SavingsService.getGroupDetails(id!),
  });

  const group = data?.data;

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

  if (!group) {
    return (
      <Container>
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-2">
            Group Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The savings group you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/savings/groups")}>
            Back to Groups
          </Button>
        </div>
      </Container>
    );
  }

  const percentage = Math.floor((group.currentAmount / group.targetAmount) * 100);
  const isOwner = group.ownerId?._id === user?._id;
  const currentUserMember = group.members?.find((m: any) => m.userId?._id === user?._id);
  const isMember = !!currentUserMember;
  const memberRole = currentUserMember?.role;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "FOOD": return "🍽️";
      case "GADGET": return "📱";
      case "RENT": return "🏠";
      case "BUSINESS": return "💼";
      default: return "🎯";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER": return <Crown size={14} className="text-yellow-500" />;
      case "TREASURER": return <Shield size={14} className="text-blue-500" />;
      default: return <User size={14} className="text-gray-400" />;
    }
  };

  return (
    <Container>
      <div className="py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/savings/groups")}
          className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-brand-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Groups
        </button>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{getCategoryIcon(group.goal?.category)}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-brand-text)]">
                {group.name}
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {group.isLocked ? (
                <Badge variant="warning">Locked</Badge>
              ) : (
                <Badge variant="success">Active</Badge>
              )}
              <Badge variant="primary">{group.members?.length || 0} Members</Badge>
              {group.penaltiesEnabled && <Badge variant="secondary">Penalties Enabled</Badge>}
            </div>
            <p className="text-gray-600 mt-2 max-w-2xl">
              {group.goal?.description || "Save together towards a common goal"}
            </p>
          </div>
          {isMember && !group.isLocked && (
            <Button onClick={() => setShowContributeModal(true)}>
              <Wallet size={18} className="mr-2" />
              Contribute
            </Button>
          )}
        </div>

        {/* Main Stats Card */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-3xl font-bold text-[var(--color-brand-primary)]">
                ₦{group.currentAmount?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                of ₦{group.targetAmount?.toLocaleString()} target
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Per Member Contribution</p>
              <p className="text-2xl font-semibold">
                ₦{group.contributionAmount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lock Period</p>
              <p className="text-2xl font-semibold flex items-center gap-2">
                <Clock size={20} />
                {group.lockPeriodDays} days
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Progress</p>
              <p className="text-2xl font-semibold">{percentage}%</p>
            </div>
          </div>
          
          <div className="mt-6">
            <GoalProgress current={group.currentAmount} target={group.targetAmount} showPercentage />
          </div>
        </Card>

        {/* Your Role Card */}
        {isMember && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-[var(--color-brand-primary)]/5 to-transparent">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {getRoleIcon(memberRole)}
                <div>
                  <p className="text-sm text-gray-500">Your Role</p>
                  <p className="font-semibold capitalize">{memberRole?.toLowerCase()}</p>
                </div>
              </div>
              {isOwner && (
                <Button variant="secondary" size="sm">
                  <Shield size={16} className="mr-2" />
                  Manage Group
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goal Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
                <Target size={20} className="text-[var(--color-brand-primary)]" />
                Goal Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Goal Title</span>
                  <span className="font-medium">{group.goal?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium capitalize">{group.goal?.category?.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Amount</span>
                  <span className="font-medium">₦{group.goal?.targetAmount?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Description</span>
                  <p className="mt-1 text-gray-600">{group.goal?.description}</p>
                </div>
              </div>
            </Card>

            {/* Group Members */}
            <GroupMembers members={group.members} isOwner={isOwner} />

            {/* Treasury Card */}
            <GroupTreasuryCard 
              currentAmount={group.currentAmount} 
              targetAmount={group.targetAmount}
              contributionAmount={group.contributionAmount}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Penalty Info */}
            <GroupPenaltyCard penaltiesEnabled={group.penaltiesEnabled} />

            {/* Timeline Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-[var(--color-brand-primary)]" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lock Period</span>
                  <span className="font-medium">{group.lockPeriodDays} days</span>
                </div>
                {group.isLocked && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Unlock Date</span>
                    <span className="font-medium">
                      {/* Calculate unlock date based on creation + lock period */}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Info Box */}
            <div className="p-4 bg-yellow-50 rounded-xl flex items-start gap-3">
              <Lock size={20} className="text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-700">About Group Savings</p>
                <p className="text-sm text-yellow-600 mt-1">
                  {group.penaltiesEnabled 
                    ? "Breaking this group before the lock period ends will incur a 10% penalty on your savings."
                    : "This group has penalties disabled. Breaking early won't incur fees."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Modal */}
        <GroupContributionModal
          open={showContributeModal}
          groupId={group._id}
          groupName={group.name}
          contributionAmount={group.contributionAmount}
          currentAmount={group.currentAmount}
          targetAmount={group.targetAmount}
          onClose={() => setShowContributeModal(false)}
          onSuccess={() => {
            setShowContributeModal(false);
            refetch();
          }}
        />
      </div>
    </Container>
  );
}