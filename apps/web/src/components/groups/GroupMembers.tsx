import { Card, Avatar, Badge } from "@/ui";
import { Crown, Shield, User, Users, MoreVertical } from "lucide-react";

interface GroupMembersProps {
  members: Array<{
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
    };
    role: "OWNER" | "TREASURER" | "MEMBER";
  }>;
  isOwner?: boolean;
}

export function GroupMembers({ members, isOwner }: GroupMembersProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown size={14} className="text-yellow-500" />;
      case "TREASURER":
        return <Shield size={14} className="text-blue-500" />;
      default:
        return <User size={14} className="text-gray-400" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Badge variant="primary">Owner</Badge>;
      case "TREASURER":
        return <Badge variant="secondary">Treasurer</Badge>;
      default:
        return <Badge variant="default">Member</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[var(--color-brand-text)] flex items-center gap-2">
          <Users size={20} className="text-[var(--color-brand-primary)]" />
          Members ({members?.length || 0})
        </h3>
        {isOwner && (
          <button className="text-sm text-[var(--color-brand-primary)] hover:underline">
            + Invite
          </button>
        )}
      </div>

      <div className="space-y-3">
        {members?.map((member) => (
          <div key={member.userId._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar
                src={member.userId.avatar}
                name={`${member.userId.firstName} ${member.userId.lastName}`}
              />
              <div>
                <p className="font-medium text-[var(--color-brand-text)]">
                  {member.userId.firstName} {member.userId.lastName}
                </p>
                <p className="text-xs text-gray-500">{member.userId.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getRoleBadge(member.role)}
              {getRoleIcon(member.role)}
            </div>
          </div>
        ))}
      </div>

      {members?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No members yet. Share the group link to invite members.
        </div>
      )}
    </Card>
  );
}