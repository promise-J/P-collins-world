import { useState } from "react";
import { Card, Button, Badge, Spinner } from "@/ui";
import { Search, MessageSquare, Eye, CheckCircle, XCircle, Clock, Reply } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const dummyInquiries = [
  {
    _id: "1",
    propertyId: {
      _id: "prop_001",
      title: "Luxury Apartment in Victoria Island",
      price: 150000000,
      location: { city: "Lagos" },
    },
    userId: { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+234 800 000 0000" },
    message: "Is this property still available? I would like to schedule a viewing.",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    propertyId: {
      _id: "prop_002",
      title: "Modern 4-Bedroom House in Lekki",
      price: 250000000,
      location: { city: "Lagos" },
    },
    userId: { firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "+234 800 000 0001" },
    message: "I'm interested in this property. Can you provide more details about the neighborhood?",
    status: "REPLIED",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    propertyId: {
      _id: "prop_003",
      title: "Commercial Space in Ikeja",
      price: 80000000,
      location: { city: "Lagos" },
    },
    userId: { firstName: "Mike", lastName: "Johnson", email: "mike@example.com", phone: "+234 800 000 0002" },
    message: "Is this property suitable for a restaurant? What are the zoning regulations?",
    status: "RESOLVED",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AgentInquiries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleReply = (id: string) => {
    toast.success("Reply sent to customer");
  };

  const handleResolve = (id: string) => {
    toast.success("Inquiry marked as resolved");
  };

  const handleClose = (id: string) => {
    toast.success("Inquiry closed");
  };

  const filteredInquiries = dummyInquiries.filter(inq =>
    inq.propertyId.title.toLowerCase().includes(search.toLowerCase()) ||
    inq.userId.firstName.toLowerCase().includes(search.toLowerCase()) ||
    inq.userId.lastName.toLowerCase().includes(search.toLowerCase()) ||
    inq.message.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="warning">Pending</Badge>;
      case "REPLIED": return <Badge variant="primary">Replied</Badge>;
      case "RESOLVED": return <Badge variant="success">Resolved</Badge>;
      case "CLOSED": return <Badge variant="default">Closed</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Inquiries</h1>
          <p className="text-gray-500 mt-1">Manage all property inquiries from potential clients</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="warning" className="px-3 py-1 text-sm">
            Pending: {dummyInquiries.filter(i => i.status === "PENDING").length}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search inquiries..."
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
          <option value="REPLIED">Replied</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => (
          <Card key={inquiry._id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare size={18} className="text-[var(--color-brand-primary)]" />
                  <h3 className="font-semibold text-[var(--color-brand-text)]">
                    {inquiry.propertyId.title}
                  </h3>
                  {getStatusBadge(inquiry.status)}
                </div>
                <p className="text-gray-600 text-sm">{inquiry.message}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span>
                    From: {inquiry.userId.firstName} {inquiry.userId.lastName}
                  </span>
                  <span>Email: {inquiry.userId.email}</span>
                  <span>Phone: {inquiry.userId.phone}</span>
                  <span>Property: ₦{inquiry.propertyId.price.toLocaleString()}</span>
                  <span>Location: {inquiry.propertyId.location.city}</span>
                  <span className="text-xs">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/agent/inquiries/${inquiry._id}`}>
                  <Button size="sm" variant="ghost">
                    <Eye size={14} className="mr-1" />
                    View
                  </Button>
                </Link>
                {inquiry.status === "PENDING" && (
                  <Button size="sm" variant="secondary" onClick={() => handleReply(inquiry._id)}>
                    <Reply size={14} className="mr-1" />
                    Reply
                  </Button>
                )}
                {inquiry.status === "REPLIED" && (
                  <Button size="sm" variant="secondary" onClick={() => handleResolve(inquiry._id)}>
                    <CheckCircle size={14} className="mr-1" />
                    Resolve
                  </Button>
                )}
                {inquiry.status === "RESOLVED" && (
                  <Button size="sm" variant="ghost" onClick={() => handleClose(inquiry._id)}>
                    <XCircle size={14} className="mr-1" />
                    Close
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredInquiries.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No inquiries found</p>
        </div>
      )}
    </div>
  );
}