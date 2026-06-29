import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { Card, Button, Spinner, Badge, Input, Pagination, Modal } from "@/ui";
import { Search, UserCheck, UserX, Shield, Mail, Calendar, X, Save } from "lucide-react";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
    loading?: boolean;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-users", page, search, role],
    queryFn: () => AdminService.getUsers({ page, limit: 20, search, role }),
  });

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // Suspend mutation
  const suspendMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      AdminService.suspendUser(userId, reason),
    onSuccess: () => {
      toast.success("User suspended successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to suspend user");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  // Activate mutation
  const activateMutation = useMutation({
    mutationFn: (userId: string) => AdminService.activateUser(userId),
    onSuccess: () => {
      toast.success("User activated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to activate user");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      AdminService.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user role");
    },
  });

  // Verify Agent mutation
  const verifyAgentMutation = useMutation({
    mutationFn: (userId: string) => AdminService.verifyAgent(userId),
    onSuccess: () => {
      toast.success("User verified as agent successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify agent");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  // Verify Landlord mutation
  const verifyLandlordMutation = useMutation({
    mutationFn: (userId: string) => AdminService.verifyLandlord(userId),
    onSuccess: () => {
      toast.success("User verified as landlord successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify landlord");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  const handleSuspend = (userId: string, userName: string) => {
    setConfirmationModal({
      open: true,
      title: "Suspend User",
      message: `Are you sure you want to suspend "${userName}"? This user will not be able to access their account.`,
      confirmText: "Suspend User",
      variant: "danger",
      onConfirm: () => suspendMutation.mutate({ userId, reason: "Violation of terms" }),
    });
  };

  const handleActivate = (userId: string, userName: string) => {
    setConfirmationModal({
      open: true,
      title: "Activate User",
      message: `Are you sure you want to activate "${userName}"? This user will regain access to their account.`,
      confirmText: "Activate User",
      variant: "info",
      onConfirm: () => activateMutation.mutate(userId),
    });
  };

  const handleVerifyAgent = (userId: string, userName: string) => {
    setConfirmationModal({
      open: true,
      title: "Verify as Agent",
      message: `Are you sure you want to verify "${userName}" as an agent? They will have agent privileges.`,
      confirmText: "Verify as Agent",
      variant: "info",
      onConfirm: () => verifyAgentMutation.mutate(userId),
    });
  };

  const handleVerifyLandlord = (userId: string, userName: string) => {
    setConfirmationModal({
      open: true,
      title: "Verify as Landlord",
      message: `Are you sure you want to verify "${userName}" as a landlord? They will have landlord privileges.`,
      confirmText: "Verify as Landlord",
      variant: "info",
      onConfirm: () => verifyLandlordMutation.mutate(userId),
    });
  };

  const handleRoleChange = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleUpdateRole = () => {
    if (!selectedUser) return;
    if (newRole === selectedUser.role) {
      toast.error("No change in role");
      setShowRoleModal(false);
      return;
    }
    updateRoleMutation.mutate({ userId: selectedUser._id, role: newRole });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">User Management</h1>
        <p className="text-gray-500 mt-1">Manage all users on the platform</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            label="Enter name or email"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="AGENT">Agent</option>
          <option value="LANDLORD">Landlord</option>
          <option value="ADMIN">Admin</option>
          <option value="VENDOR">Vendor</option>
        </select>
        <Button onClick={() => refetch()}>Filter</Button>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Verified</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center text-white font-bold">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Mail size={12} />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "ADMIN" ? "primary" : "default"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {user.isSuspended ? (
                      <Badge variant="danger">Suspended</Badge>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.isVerified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {!user.isSuspended ? (
                        <button
                          onClick={() => handleSuspend(user._id, `${user.firstName} ${user.lastName}`)}
                          className="p-1 text-orange-500 hover:bg-orange-50 rounded transition-colors"
                          title="Suspend User"
                        >
                          <UserX size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user._id, `${user.firstName} ${user.lastName}`)}
                          className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                          title="Activate User"
                        >
                          <UserCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleRoleChange(user)}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="Change Role"
                      >
                        <Shield size={16} />
                      </button>
                      {user.role !== "AGENT" && (
                        <button
                          onClick={() => handleVerifyAgent(user._id, `${user.firstName} ${user.lastName}`)}
                          className="p-1 text-purple-500 hover:bg-purple-50 rounded transition-colors"
                          title="Verify as Agent"
                        >
                          <Shield size={16} />
                        </button>
                      )}
                      {user.role !== "LANDLORD" && (
                        <button
                          onClick={() => handleVerifyLandlord(user._id, `${user.firstName} ${user.lastName}`)}
                          className="p-1 text-emerald-500 hover:bg-emerald-50 rounded transition-colors"
                          title="Verify as Landlord"
                        >
                          <Shield size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {users.length === 0 && (
        <div className="text-center py-12">
          <UserCheck size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No users found</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText || "Confirm"}
        variant={confirmationModal.variant || "danger"}
        loading={
          suspendMutation.isPending ||
          activateMutation.isPending ||
          verifyAgentMutation.isPending ||
          verifyLandlordMutation.isPending
        }
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal(prev => ({ ...prev, open: false }))}
      />

      {/* Role Change Modal */}
      <Modal
        open={showRoleModal}
        title="Change User Role"
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUser(null);
          setNewRole("");
        }}
      >
        <div className="space-y-4">
          {selectedUser && (
            <>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">User</p>
                <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                <p className="text-sm text-gray-400">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select New Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                >
                  <option value="USER">User</option>
                  <option value="AGENT">Agent</option>
                  <option value="LANDLORD">Landlord</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                    setNewRole("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateRole}
                  disabled={updateRoleMutation.isPending || newRole === selectedUser.role}
                  className="flex-1"
                >
                  {updateRoleMutation.isPending ? <Spinner size="sm" /> : <><Save size={16} className="mr-2" /> Update Role</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}