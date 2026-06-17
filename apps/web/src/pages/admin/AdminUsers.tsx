import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { Card, Button, Spinner, Badge, Input, Pagination } from "@/ui";
import { Search, UserCheck, UserX, Shield, Mail, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-users", page, search, role],
    queryFn: () => AdminService.getUsers({ page, limit: 20, search, role }),
  });

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleSuspend = async (userId: string) => {
    try {
      await AdminService.suspendUser(userId, "Violation of terms");
      toast.success("User suspended");
      refetch();
    } catch (error) {
      toast.error("Failed to suspend user");
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      await AdminService.activateUser(userId);
      toast.success("User activated");
      refetch();
    } catch (error) {
      toast.error("Failed to activate user");
    }
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
            label="Search using name or email"
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
                    <div className="flex gap-2">
                      {!user.isSuspended ? (
                        <button
                          onClick={() => handleSuspend(user._id)}
                          className="p-1 text-orange-500 hover:bg-orange-50 rounded"
                          title="Suspend User"
                        >
                          <UserX size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user._id)}
                          className="p-1 text-green-500 hover:bg-green-50 rounded"
                          title="Activate User"
                        >
                          <UserCheck size={16} />
                        </button>
                      )}
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Change Role">
                        <Shield size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}