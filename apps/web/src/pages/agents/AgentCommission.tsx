import { useState } from "react";
import { Card, Badge, Button } from "@/ui";
import { Search, DollarSign, TrendingUp, Wallet, Calendar, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const dummyCommissionData = [
  {
    _id: "1",
    propertyId: {
      _id: "prop_001",
      title: "Luxury Apartment in Victoria Island",
    },
    amount: 3000000,
    rate: 2.5,
    status: "PAID",
    transactionDate: new Date().toISOString(),
    paidDate: new Date().toISOString(),
    reference: "COMM_001",
    buyer: "John Doe",
  },
  {
    _id: "2",
    propertyId: {
      _id: "prop_002",
      title: "Modern 4-Bedroom House in Lekki",
    },
    amount: 5000000,
    rate: 2.0,
    status: "PENDING",
    transactionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reference: "COMM_002",
    buyer: "Jane Smith",
  },
  {
    _id: "3",
    propertyId: {
      _id: "prop_003",
      title: "Commercial Space in Ikeja",
    },
    amount: 1600000,
    rate: 2.0,
    status: "PROCESSING",
    transactionDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    reference: "COMM_003",
    buyer: "Mike Johnson",
  },
];

export default function AgentCommission() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleDownload = () => {
    toast.success("Commission report downloaded");
  };

  const filteredCommissions = dummyCommissionData.filter(comm =>
    comm.propertyId.title.toLowerCase().includes(search.toLowerCase()) ||
    comm.buyer.toLowerCase().includes(search.toLowerCase()) ||
    comm.reference.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID": return <Badge variant="success">Paid</Badge>;
      case "PENDING": return <Badge variant="warning">Pending</Badge>;
      case "PROCESSING": return <Badge variant="primary">Processing</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const totalCommission = dummyCommissionData
    .filter(c => c.status === "PAID")
    .reduce((sum, c) => sum + c.amount, 0);

  const pendingCommission = dummyCommissionData
    .filter(c => c.status !== "PAID")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Commission</h1>
          <p className="text-gray-500 mt-1">Track your earnings and commission history</p>
        </div>
        <Button onClick={handleDownload}>
          <Download size={18} className="mr-2" />
          Download Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Earned Commission</p>
          <p className="text-2xl font-bold text-green-600">₦{totalCommission.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-xs text-green-600">+12.5% from last month</span>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Pending Commission</p>
          <p className="text-2xl font-bold text-yellow-600">₦{pendingCommission.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2">
            <Wallet size={14} className="text-yellow-500" />
            <span className="text-xs text-yellow-600">Awaiting payment</span>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold text-[var(--color-brand-text)]">{dummyCommissionData.length}</p>
          <div className="flex items-center gap-1 mt-2">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500">This year</span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by property or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="">All Status</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
        </select>
      </div>

      {/* Commission Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Reference</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Property</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Buyer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rate</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCommissions.map((comm) => (
                <tr key={comm._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{comm.reference}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{comm.propertyId.title}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{comm.buyer}</td>
                  <td className="px-4 py-3 font-medium">
                    ₦{comm.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{comm.rate}%</td>
                  <td className="px-4 py-3">{getStatusBadge(comm.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(comm.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-gray-100" title="View Details">
                      <Eye size={16} className="text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredCommissions.length === 0 && (
        <div className="text-center py-12">
          <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No commission records found</p>
        </div>
      )}
    </div>
  );
}