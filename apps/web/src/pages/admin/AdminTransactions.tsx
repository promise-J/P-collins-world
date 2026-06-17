import { useState } from "react";
import { Card, Badge, Button } from "@/ui";
import { Search, Download, Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import toast from "react-hot-toast";

const dummyTransactions = [
  {
    _id: "txn_1",
    type: "CREDIT",
    amount: 500000,
    status: "SUCCESS",
    description: "Wallet funding",
    user: { firstName: "John", lastName: "Doe", email: "john@example.com" },
    reference: "PAYSTACK_REF_001",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "txn_2",
    type: "DEBIT",
    amount: 250000,
    status: "SUCCESS",
    description: "Order payment",
    user: { firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
    reference: "ORD-12345",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "txn_3",
    type: "CREDIT",
    amount: 150000,
    status: "PENDING",
    description: "Savings contribution",
    user: { firstName: "Mike", lastName: "Johnson", email: "mike@example.com" },
    reference: "SAV_001",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "txn_4",
    type: "DEBIT",
    amount: 75000,
    status: "FAILED",
    description: "Property booking",
    user: { firstName: "Sarah", lastName: "Brown", email: "sarah@example.com" },
    reference: "INSP_001",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AdminTransactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredTransactions = dummyTransactions.filter(t =>
    t.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
    t.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
    t.user.email.toLowerCase().includes(search.toLowerCase()) ||
    t.reference.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    toast.success("Transactions exported successfully");
  };

  const totalCredit = dummyTransactions.filter(t => t.type === "CREDIT" && t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = dummyTransactions.filter(t => t.type === "DEBIT" && t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Transactions</h1>
          <p className="text-gray-500 mt-1">Monitor all transactions on the platform</p>
        </div>
        <Button onClick={handleExport}>
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Success</p>
          <p className="text-2xl font-bold text-green-600">₦{(totalCredit - totalDebit).toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Credit</p>
          <p className="text-2xl font-bold text-blue-600">₦{totalCredit.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Debit</p>
          <p className="text-2xl font-bold text-red-600">₦{totalDebit.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="">All Types</option>
          <option value="CREDIT">Credit</option>
          <option value="DEBIT">Debit</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Reference</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{tx.reference}</td>
                  <td className="px-4 py-3">
                    {tx.user.firstName} {tx.user.lastName}
                    <p className="text-xs text-gray-400">{tx.user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={tx.type === "CREDIT" ? "success" : "danger"}>
                      {tx.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₦{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      tx.status === "SUCCESS" ? "success" :
                      tx.status === "PENDING" ? "warning" : "danger"
                    }>
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Wallet size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No transactions found</p>
        </div>
      )}
    </div>
  );
}