import { useState } from "react";
import { Card, Badge, Button } from "@/ui";
import { Search, Download, CreditCard, Calendar, Eye, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const dummyRentPayments = [
  {
    _id: "1",
    tenantId: {
      _id: "tenant_001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
    propertyId: {
      _id: "prop_001",
      title: "Luxury Apartment in Victoria Island",
    },
    amount: 250000,
    month: "July 2024",
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paidDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "PAID",
    reference: "RENT_001",
    method: "Bank Transfer",
  },
  {
    _id: "2",
    tenantId: {
      _id: "tenant_002",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
    },
    propertyId: {
      _id: "prop_002",
      title: "Modern 4-Bedroom House in Lekki",
    },
    amount: 400000,
    month: "July 2024",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paidDate: null,
    status: "PENDING",
    reference: "RENT_002",
    method: "-",
  },
  {
    _id: "3",
    tenantId: {
      _id: "tenant_003",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@example.com",
    },
    propertyId: {
      _id: "prop_003",
      title: "Commercial Space in Ikeja",
    },
    amount: 350000,
    month: "June 2024",
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    paidDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: "OVERDUE",
    reference: "RENT_003",
    method: "Wallet",
  },
];

export default function LandlordRentPayments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleMarkPaid = (id: string) => {
    toast.success("Payment marked as paid");
  };

  const handleSendReminder = (id: string) => {
    toast.success("Reminder sent to tenant");
  };

  const handleExport = () => {
    toast.success("Rent report exported successfully");
  };

  const filteredPayments = dummyRentPayments.filter(p =>
    p.tenantId.firstName.toLowerCase().includes(search.toLowerCase()) ||
    p.tenantId.lastName.toLowerCase().includes(search.toLowerCase()) ||
    p.propertyId.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID": return <Badge variant="success">Paid</Badge>;
      case "PENDING": return <Badge variant="warning">Pending</Badge>;
      case "OVERDUE": return <Badge variant="danger">Overdue</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const totalCollected = dummyRentPayments
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = dummyRentPayments
    .filter(p => p.status === "PENDING" || p.status === "OVERDUE")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Rent Payments</h1>
          <p className="text-gray-500 mt-1">Track and manage tenant rent payments</p>
        </div>
        <Button onClick={handleExport}>
          <Download size={18} className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Collected</p>
          <p className="text-2xl font-bold text-green-600">₦{totalCollected.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Pending Payments</p>
          <p className="text-2xl font-bold text-yellow-600">₦{totalPending.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Payment Rate</p>
          <p className="text-2xl font-bold text-[var(--color-brand-text)]">
            {Math.round((dummyRentPayments.filter(p => p.status === "PAID").length / dummyRentPayments.length) * 100)}%
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tenant or property..."
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
          <option value="OVERDUE">Overdue</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]">
          <option value="">All Months</option>
          <option value="July 2024">July 2024</option>
          <option value="June 2024">June 2024</option>
          <option value="May 2024">May 2024</option>
        </select>
      </div>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Reference</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tenant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Property</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Month</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{payment.reference}</td>
                  <td className="px-4 py-3">
                    {payment.tenantId.firstName} {payment.tenantId.lastName}
                    <p className="text-xs text-gray-400">{payment.tenantId.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <p className="line-clamp-1">{payment.propertyId.title}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₦{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{payment.month}</td>
                  <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {payment.status === "PENDING" && (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => handleMarkPaid(payment._id)}>
                            <CheckCircle size={14} className="mr-1" />
                            Mark Paid
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleSendReminder(payment._id)}>
                            Remind
                          </Button>
                        </>
                      )}
                      {payment.status === "OVERDUE" && (
                        <Button size="sm" variant="danger" onClick={() => handleSendReminder(payment._id)}>
                          <XCircle size={14} className="mr-1" />
                          Send Notice
                        </Button>
                      )}
                      {payment.status === "PAID" && (
                        <Button size="sm" variant="ghost">
                          <Eye size={14} className="mr-1" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <CreditCard size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No rent payments found</p>
        </div>
      )}
    </div>
  );
}