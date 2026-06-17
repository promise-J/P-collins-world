import { useState } from "react";
import { Card, Button, Badge, Spinner } from "@/ui";
import { Search, Users, Mail, Phone, MessageSquare, Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const dummyClients = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+234 800 000 0000",
    preferences: { propertyType: "APARTMENT", budget: 150000000, location: "Victoria Island" },
    inquiriesCount: 5,
    appointmentsCount: 3,
    status: "ACTIVE",
    lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "+234 800 000 0001",
    preferences: { propertyType: "HOUSE", budget: 250000000, location: "Lekki" },
    inquiriesCount: 8,
    appointmentsCount: 5,
    status: "ACTIVE",
    lastContact: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike@example.com",
    phone: "+234 800 000 0002",
    preferences: { propertyType: "COMMERCIAL", budget: 80000000, location: "Ikeja" },
    inquiriesCount: 3,
    appointmentsCount: 1,
    status: "INACTIVE",
    lastContact: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AgentClients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleContact = (id: string) => {
    toast.success("Initiating contact with client");
  };

  const filteredClients = dummyClients.filter(client =>
    client.firstName.toLowerCase().includes(search.toLowerCase()) ||
    client.lastName.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge variant="success">Active</Badge>;
      case "INACTIVE": return <Badge variant="default">Inactive</Badge>;
      case "LEAD": return <Badge variant="warning">Lead</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your client relationships</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
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
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="LEAD">Lead</option>
        </select>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client._id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center text-white font-bold text-lg">
                  {client.firstName[0]}{client.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-brand-text)]">
                    {client.firstName} {client.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{client.phone}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(client.status)}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Preferences</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                <div>
                  <span className="block font-medium">Type</span>
                  {client.preferences.propertyType}
                </div>
                <div>
                  <span className="block font-medium">Budget</span>
                  ₦{client.preferences.budget.toLocaleString()}
                </div>
                <div>
                  <span className="block font-medium">Location</span>
                  {client.preferences.location}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Inquiries: {client.inquiriesCount}</span>
                <span>Appointments: {client.appointmentsCount}</span>
              </div>
              <span className="text-xs text-gray-400">
                Last contact: {new Date(client.lastContact).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleContact(client._id)}>
                <MessageSquare size={14} className="mr-1" />
                Contact
              </Button>
              <Link to={`/agent/clients/${client._id}`} className="flex-1">
                <Button size="sm" variant="ghost" className="w-full">
                  <Eye size={14} className="mr-1" />
                  View
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No clients found</p>
        </div>
      )}
    </div>
  );
}