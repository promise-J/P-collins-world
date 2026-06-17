import { useState } from "react";
import { Card, Badge, Button } from "@/ui";
import { Search, FileText, User, Shield, Package, Home, Wallet, Download } from "lucide-react";
import toast from "react-hot-toast";

const dummyAuditLogs = [
  {
    _id: "1",
    userId: { firstName: "Admin", lastName: "User", email: "admin@example.com" },
    action: "USER_CREATED",
    module: "AUTH",
    metadata: { userId: "user_123", email: "john@example.com" },
    ipAddress: "192.168.1.1",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    userId: { firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
    action: "PROPERTY_APPROVED",
    module: "PROPERTY",
    metadata: { propertyId: "prop_456", title: "Luxury Apartment" },
    ipAddress: "192.168.1.2",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    userId: { firstName: "Mike", lastName: "Johnson", email: "mike@example.com" },
    action: "ORDER_COMPLETED",
    module: "ORDER",
    metadata: { orderId: "ord_789", amount: 250000 },
    ipAddress: "192.168.1.3",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "4",
    userId: { firstName: "Sarah", lastName: "Brown", email: "sarah@example.com" },
    action: "KYC_SUBMITTED",
    module: "KYC",
    metadata: { userId: "user_321", idType: "NIN" },
    ipAddress: "192.168.1.4",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const actionIcons: Record<string, any> = {
  USER_CREATED: User,
  USER_SUSPENDED: Shield,
  PROPERTY_APPROVED: Home,
  PROPERTY_REJECTED: Home,
  ORDER_COMPLETED: Package,
  KYC_SUBMITTED: FileText,
  PAYMENT_RECEIVED: Wallet,
};

const actionColors: Record<string, string> = {
  USER_CREATED: "text-green-500",
  USER_SUSPENDED: "text-red-500",
  PROPERTY_APPROVED: "text-blue-500",
  PROPERTY_REJECTED: "text-red-500",
  ORDER_COMPLETED: "text-purple-500",
  KYC_SUBMITTED: "text-yellow-500",
  PAYMENT_RECEIVED: "text-green-500",
};

export default function AdminAuditLog() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  const handleExport = () => {
    toast.success("Audit logs exported successfully");
  };

  const filteredLogs = dummyAuditLogs.filter(log =>
    log.userId.firstName.toLowerCase().includes(search.toLowerCase()) ||
    log.userId.lastName.toLowerCase().includes(search.toLowerCase()) ||
    log.userId.email.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Audit Logs</h1>
          <p className="text-gray-500 mt-1">Monitor all system activities and user actions</p>
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
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="">All Modules</option>
          <option value="AUTH">Authentication</option>
          <option value="PROPERTY">Property</option>
          <option value="ORDER">Order</option>
          <option value="KYC">KYC</option>
          <option value="PAYMENT">Payment</option>
          <option value="USER">User</option>
        </select>
      </div>

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
              {filteredLogs.map((log) => {
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
                        <p className="text-sm">{log.userId.firstName} {log.userId.lastName}</p>
                        <p className="text-xs text-gray-400">{log.userId.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default">{log.module}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {Object.entries(log.metadata).map(([key, value]) => (
                        <span key={key} className="text-xs text-gray-500">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm">{log.ipAddress}</td>
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

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No audit logs found</p>
        </div>
      )}
    </div>
  );
}