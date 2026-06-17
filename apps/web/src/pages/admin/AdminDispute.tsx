import { useState } from "react";
import { Card, Button, Badge } from "@/ui";
import { Search, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const dummyDisputes = [
  {
    _id: "1",
    title: "Order Not Delivered",
    description: "Customer claims order was marked delivered but never received.",
    status: "PENDING",
    priority: "HIGH",
    type: "ORDER",
    orderId: "ORD-12345",
    customer: { firstName: "John", lastName: "Doe", email: "john@example.com" },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Property Misrepresentation",
    description: "Tenant claims property conditions don't match listing description.",
    status: "IN_REVIEW",
    priority: "MEDIUM",
    type: "PROPERTY",
    propertyId: "PROP-001",
    customer: { firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    title: "Payment Dispute",
    description: "Vendor claims payment not received for completed order.",
    status: "RESOLVED",
    priority: "HIGH",
    type: "PAYMENT",
    orderId: "ORD-67890",
    customer: { firstName: "Mike", lastName: "Johnson", email: "mike@example.com" },
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AdminDisputes() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleResolve = (id: string) => {
    toast.success("Dispute resolved successfully");
  };

  const handleEscalate = (id: string) => {
    toast.success("Dispute escalated to support team");
  };

  const filteredDisputes = dummyDisputes.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
    d.customer.lastName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="warning">Pending</Badge>;
      case "IN_REVIEW": return <Badge variant="primary">In Review</Badge>;
      case "RESOLVED": return <Badge variant="success">Resolved</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH": return <Badge variant="danger">High</Badge>;
      case "MEDIUM": return <Badge variant="warning">Medium</Badge>;
      case "LOW": return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="default">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Disputes</h1>
        <p className="text-gray-500 mt-1">Manage and resolve disputes on the platform</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search disputes..."
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
          <option value="PENDING">Pending</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]">
          <option value="">All Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.map((dispute) => (
          <Card key={dispute._id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle size={20} className={
                    dispute.priority === "HIGH" ? "text-red-500" :
                    dispute.priority === "MEDIUM" ? "text-yellow-500" : "text-blue-500"
                  } />
                  <h3 className="font-semibold text-[var(--color-brand-text)]">{dispute.title}</h3>
                  {getPriorityBadge(dispute.priority)}
                  {getStatusBadge(dispute.status)}
                </div>
                <p className="text-gray-600 text-sm">{dispute.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span>Customer: {dispute.customer.firstName} {dispute.customer.lastName}</span>
                  <span>Type: {dispute.type}</span>
                  {dispute.orderId && <span>Order: {dispute.orderId}</span>}
                  {dispute.propertyId && <span>Property: {dispute.propertyId}</span>}
                  <span>Created: {new Date(dispute.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {dispute.status !== "RESOLVED" && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleResolve(dispute._id)}
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEscalate(dispute._id)}
                    >
                      <Clock size={14} className="mr-1" />
                      Escalate
                    </Button>
                  </>
                )}
                {dispute.status === "RESOLVED" && (
                  <Badge variant="success">Resolved ✓</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDisputes.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No disputes found</p>
        </div>
      )}
    </div>
  );
}