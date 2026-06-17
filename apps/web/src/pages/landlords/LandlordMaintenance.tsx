import { useState } from "react";
import { Card, Button, Badge } from "@/ui";
import { Search, Wrench, Plus, Eye, CheckCircle, Clock, AlertTriangle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const dummyMaintenanceRequests = [
  {
    _id: "1",
    propertyId: {
      _id: "prop_001",
      title: "Luxury Apartment in Victoria Island",
    },
    tenantId: {
      _id: "tenant_001",
      firstName: "John",
      lastName: "Doe",
      phone: "+234 800 000 0000",
    },
    title: "Leaking Faucet",
    description: "Kitchen faucet is leaking and causing water damage to cabinet",
    priority: "HIGH",
    status: "PENDING",
    category: "Plumbing",
    createdAt: new Date().toISOString(),
    scheduledDate: null,
    completedDate: null,
  },
  {
    _id: "2",
    propertyId: {
      _id: "prop_002",
      title: "Modern 4-Bedroom House in Lekki",
    },
    tenantId: {
      _id: "tenant_002",
      firstName: "Jane",
      lastName: "Smith",
      phone: "+234 800 000 0001",
    },
    title: "AC Not Cooling",
    description: "Air conditioner in master bedroom is blowing warm air",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    category: "HVAC",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: null,
  },
  {
    _id: "3",
    propertyId: {
      _id: "prop_003",
      title: "Commercial Space in Ikeja",
    },
    tenantId: {
      _id: "tenant_003",
      firstName: "Mike",
      lastName: "Johnson",
      phone: "+234 800 000 0002",
    },
    title: "Broken Window",
    description: "Window in shop front was broken during storm",
    priority: "LOW",
    status: "COMPLETED",
    category: "Glass",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function LandlordMaintenance() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const handleMarkInProgress = (id: string) => {
    toast.success("Request marked as in progress");
  };

  const handleComplete = (id: string) => {
    toast.success("Maintenance request marked as completed");
  };

  const handleContactTenant = (id: string) => {
    toast.success("Contacting tenant");
  };

  const filteredRequests = dummyMaintenanceRequests.filter(req =>
    req.title.toLowerCase().includes(search.toLowerCase()) ||
    req.tenantId.firstName.toLowerCase().includes(search.toLowerCase()) ||
    req.tenantId.lastName.toLowerCase().includes(search.toLowerCase()) ||
    req.propertyId.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="warning">Pending</Badge>;
      case "IN_PROGRESS": return <Badge variant="primary">In Progress</Badge>;
      case "COMPLETED": return <Badge variant="success">Completed</Badge>;
      case "CANCELLED": return <Badge variant="danger">Cancelled</Badge>;
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "HIGH": return <AlertTriangle size={16} className="text-red-500" />;
      case "MEDIUM": return <Clock size={16} className="text-yellow-500" />;
      case "LOW": return <Clock size={16} className="text-blue-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Maintenance</h1>
          <p className="text-gray-500 mt-1">Manage property maintenance requests</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-[var(--color-brand-text)]">{dummyMaintenanceRequests.length}</p>
        </Card>
        <Card className="p-4 border-yellow-200">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {dummyMaintenanceRequests.filter(r => r.status === "PENDING").length}
          </p>
        </Card>
        <Card className="p-4 border-blue-200">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">
            {dummyMaintenanceRequests.filter(r => r.status === "IN_PROGRESS").length}
          </p>
        </Card>
        <Card className="p-4 border-green-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {dummyMaintenanceRequests.filter(r => r.status === "COMPLETED").length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
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
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="">All Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Maintenance Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request._id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Wrench size={18} className="text-[var(--color-brand-primary)]" />
                  <h3 className="font-semibold text-[var(--color-brand-text)]">{request.title}</h3>
                  {getPriorityBadge(request.priority)}
                  {getStatusBadge(request.status)}
                </div>
                <p className="text-gray-600 text-sm">{request.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span>Property: {request.propertyId.title}</span>
                  <span>Tenant: {request.tenantId.firstName} {request.tenantId.lastName}</span>
                  <span>Category: {request.category}</span>
                  <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleContactTenant(request._id)}>
                  <MessageSquare size={14} className="mr-1" />
                  Contact
                </Button>
                {request.status === "PENDING" && (
                  <Button size="sm" variant="secondary" onClick={() => handleMarkInProgress(request._id)}>
                    <Clock size={14} className="mr-1" />
                    Start Work
                  </Button>
                )}
                {request.status === "IN_PROGRESS" && (
                  <Button size="sm" variant="secondary" onClick={() => handleComplete(request._id)}>
                    <CheckCircle size={14} className="mr-1" />
                    Complete
                  </Button>
                )}
                <Button size="sm" variant="ghost">
                  <Eye size={14} className="mr-1" />
                  Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Wrench size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No maintenance requests found</p>
        </div>
      )}
    </div>
  );
}