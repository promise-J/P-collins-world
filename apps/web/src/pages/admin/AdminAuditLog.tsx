import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Badge, Button, Spinner, Pagination } from "@/ui";
import { Search, FileText, User, Shield, Package, Home, Wallet, Download, Filter, X } from "lucide-react";
import { AdminService } from "@/services/admin.service";
import toast from "react-hot-toast";

const actionIcons: Record<string, any> = {
  USER_CREATED: User,
  USER_SUSPENDED: Shield,
  USER_ACTIVATED: User,
  PROPERTY_APPROVED: Home,
  PROPERTY_REJECTED: Home,
  ORDER_COMPLETED: Package,
  ORDER_CANCELLED: Package,
  KYC_SUBMITTED: FileText,
  KYC_VERIFIED: Shield,
  PAYMENT_RECEIVED: Wallet,
  PAYMENT_REFUNDED: Wallet,
  LOGIN: User,
  LOGOUT: User,
  ROLE_CHANGED: Shield,
};

const actionColors: Record<string, string> = {
  USER_CREATED: "text-green-500",
  USER_SUSPENDED: "text-red-500",
  USER_ACTIVATED: "text-green-500",
  PROPERTY_APPROVED: "text-blue-500",
  PROPERTY_REJECTED: "text-red-500",
  ORDER_COMPLETED: "text-purple-500",
  ORDER_CANCELLED: "text-red-500",
  KYC_SUBMITTED: "text-yellow-500",
  KYC_VERIFIED: "text-green-500",
  PAYMENT_RECEIVED: "text-green-500",
  PAYMENT_REFUNDED: "text-orange-500",
  LOGIN: "text-blue-500",
  LOGOUT: "text-gray-500",
  ROLE_CHANGED: "text-purple-500",
};

export default function AdminAuditLog() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-audit-logs", page, search, moduleFilter, actionFilter],
    queryFn: () =>
      AdminService.getAuditLogs({
        page,
        limit: 20,
        search: search || undefined,
        module: moduleFilter || undefined,
        action: actionFilter || undefined,
      }),
  });

  const auditLogs = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const handleExport = () => {
    toast.success("Audit logs export started. You'll receive the file shortly.");
    // Implement actual export logic
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setModuleFilter("");
    setActionFilter("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = moduleFilter || actionFilter || search;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Audit Logs</h1>
          <p className="text-gray-500 mt-1">Monitor all system activities and user actions</p>
          <p className="text-sm text-gray-400 mt-1">Total: {total} events</p>
        </div>
        <Button onClick={handleExport}>
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, action, or details..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Filter size={18} />
          <span>Filters</span>
          {(moduleFilter || actionFilter) && (
            <Badge variant="primary" className="ml-1">
              {[moduleFilter, actionFilter].filter(Boolean).length}
            </Badge>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[var(--color-brand-primary)] hover:underline flex items-center gap-1"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">All Modules</option>
                <option value="AUTH">Authentication</option>
                <option value="PROPERTY">Property</option>
                <option value="ORDER">Order</option>
                <option value="KYC">KYC</option>
                <option value="PAYMENT">Payment</option>
                <option value="USER">User</option>
                <option value="SAVINGS">Savings</option>
                <option value="WALLET">Wallet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">All Actions</option>
                <option value="USER_CREATED">User Created</option>
                <option value="USER_SUSPENDED">User Suspended</option>
                <option value="USER_ACTIVATED">User Activated</option>
                <option value="PROPERTY_APPROVED">Property Approved</option>
                <option value="PROPERTY_REJECTED">Property Rejected</option>
                <option value="ORDER_COMPLETED">Order Completed</option>
                <option value="ORDER_CANCELLED">Order Cancelled</option>
                <option value="KYC_SUBMITTED">KYC Submitted</option>
                <option value="KYC_VERIFIED">KYC Verified</option>
                <option value="PAYMENT_RECEIVED">Payment Received</option>
                <option value="PAYMENT_REFUNDED">Payment Refunded</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
                <option value="ROLE_CHANGED">Role Changed</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Audit Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Module</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Details</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">IP Address</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log: any) => {
                const Icon = actionIcons[log.action] || FileText;
                const colorClass = actionColors[log.action] || "text-gray-500";
                return (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={colorClass} />
                        <span className="text-sm font-medium">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm">
                          {log.userId?.firstName || "System"} {log.userId?.lastName || ""}
                        </p>
                        <p className="text-xs text-gray-400">{log.userId?.email || "System"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default">{log.module}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {log.metadata && Object.entries(log.metadata).map(([key, value]) => (
                        <span key={key} className="text-xs text-gray-500 block">
                          {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm">{log.ipAddress || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {auditLogs.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {hasActiveFilters ? "No audit logs found matching your filters" : "No audit logs available"}
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="ghost" className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}