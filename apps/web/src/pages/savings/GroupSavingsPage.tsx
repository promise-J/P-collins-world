import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SavingsService } from "@/services/savings.service";
import { Button, Card, Spinner } from "@/ui";
import { 
  Plus, 
  Users, 
  Target, 
  Wallet, 
  UsersRound,
  Search,
  Filter,
  Grid3X3,
  List
} from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/ui/components/Container";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { GroupCard } from "@/components/groups/GroupCard";

export default function GroupSavingsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all groups (public)
  const { data: allGroupsData, isLoading: allGroupsLoading, refetch: refetchAll } = useQuery({
    queryKey: ["all-groups"],
    queryFn: () => SavingsService.getAllGroups(),
  });

  // Fetch my groups
  const { data: myGroupsData, isLoading: myGroupsLoading, refetch: refetchMy } = useQuery({
    queryKey: ["my-groups"],
    queryFn: () => SavingsService.getMyGroups(),
  });

  const allGroups = allGroupsData?.data || [];
  const myGroups = myGroupsData?.data || [];

  // Filter groups based on search
  const filteredGroups = allGroups.filter((group: any) =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.goal?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGroupCreated = () => {
    refetchAll();
    refetchMy();
  };

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">
              Group Savings
            </h1>
            <p className="text-gray-500 mt-1">
              Join or create groups to save together towards common goals
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={18} className="mr-2" />
            Create Group
          </Button>
        </div>

        {/* My Groups Section */}
        {!myGroupsLoading && myGroups.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
              <Users size={20} className="text-[var(--color-brand-primary)]" />
              Your Groups
            </h2>
            <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
              {myGroups.map((group: any) => (
                <GroupCard key={group._id} group={group} isMember={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Groups Section */}
        <div>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] flex items-center gap-2">
              <UsersRound size={20} className="text-[var(--color-brand-primary)]" />
              All Groups
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] w-48 md:w-64"
                />
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {allGroupsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredGroups.length === 0 ? (
            <Card className="text-center py-12">
              <UsersRound size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-600">No Groups Available</h3>
              <p className="text-gray-400 mt-1">Be the first to create a savings group!</p>
              <Button onClick={() => setShowCreateModal(true)} className="mt-4">
                <Plus size={18} className="mr-2" />
                Create Group
              </Button>
            </Card>
          ) : (
            <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
              {filteredGroups.map((group: any) => (
                <GroupCard key={group._id} group={group} isMember={group.isMember} />
              ))}
            </div>
          )}
        </div>

        {/* Create Group Modal */}
        <CreateGroupModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleGroupCreated}
        />
      </div>
    </Container>
  );
}