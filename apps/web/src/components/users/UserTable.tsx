import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';
import { Card, Badge, Spinner, Pagination } from '@/ui';
import { UserActions } from './UserActions';
import { Mail, Calendar } from 'lucide-react';

interface UserTableProps {
  role?: string;
  showActions?: boolean;
}

export function UserTable({ role, showActions = true }: UserTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', page, limit, role],
    queryFn: () => AdminService.getUsers({ page, limit, role }),
  });

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Joined</th>
              {showActions && <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user: any) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || '/avatar.png'}
                      alt={user.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-[var(--color-brand-text)]">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Mail size={12} />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {user.isSuspended ? (
                    <Badge variant="danger">Suspended</Badge>
                  ) : user.isVerified ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="warning">Unverified</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                {showActions && (
                  <td className="px-4 py-3">
                    <UserActions userId={user._id} onActionComplete={() => refetch()} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}