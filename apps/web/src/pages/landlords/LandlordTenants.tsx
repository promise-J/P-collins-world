import { useState } from "react";
import { Card, Button, Badge, Spinner } from "@/ui";
import { Search, Users, Mail, Phone, Home, Calendar, Eye, Plus, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const dummyTenants = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+234 800 000 0000",
    propertyId: {
      _id: "prop_001",
      title: "Luxury Apartment in Victoria Island",
      address: "123 Ahmadu Bello Way",
    },
    unit: "Apartment 3B",
    leaseStart: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    leaseEnd: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    rentAmount: 250000,
    status: "ACTIVE",
    paymentHistory: [
      { month: "May 2024", paid: true, amount: 250000 },
      { month: "June 2024", paid: true, amount: 250000 },
      { month: "July 2024", paid: false, amount: 250000 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+234 800 000 0001",
    propertyId: {
      _id: "prop_002",
      title: "Modern 4-Bedroom House in Lekki",
      address: "45 Admiralty Way",
    },
    unit: "House",
    leaseStart: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    leaseEnd: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    rentAmount: 400000,
    status: "ACTIVE",
    paymentHistory: [
      { month: "May 2024", paid: true, amount: 400000 },
      { month: "June 2024", paid: true, amount: 400000 },
      { month: "July 2024", paid: true, amount: 400000 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phone: "+234 800 000 0002",
    propertyId: {
      _id: "prop_003",
      title: "Commercial Space in Ikeja",
      address: "10 Allen Avenue",
    },
    unit: "Shop 5",
    leaseStart: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    leaseEnd: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    rentAmount: 350000,
    status: "EXPIRING_SOON",
    paymentHistory: [
      { month: "May 2024", paid: true, amount: 350000 },
      { month: "June 2024", paid: false, amount: 350000 },
      { month: "July 2024", paid: false, amount: 350000 },
    ],
    createdAt: new Date().toISOString(),
  },
];

export default function LandlordTenants() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleContact = (id: string) => {
    toast.success("Initiating contact with tenant");
  };

  const handleViewDetails = (id: string) => {
    toast.success("Opening tenant details");
  };

  const filteredTenants = dummyTenants.filter(tenant =>
    tenant.firstName.toLowerCase().includes(search.toLowerCase()) ||
    tenant.lastName.toLowerCase().includes(search.toLowerCase()) ||
    tenant.email.toLowerCase().includes(search.toLowerCase()) ||
    tenant.propertyId.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge variant="success">Active</Badge>;
      case "EXPIRING_SOON": return <Badge variant="warning">Expiring Soon</Badge>;
      case "EXPIRED": return <Badge variant="danger">Expired</Badge>;
      case "INACTIVE": return <Badge variant="default">Inactive</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Tenants</h1>
          <p className="text-gray-500 mt-1">Manage your tenants and lease agreements</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Tenants</p>
          <p className="text-2xl font-bold text-[var(--color-brand-text)]">{dummyTenants.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active Tenants</p>
          <p className="text-2xl font-bold text-green-600">{dummyTenants.filter(t => t.status === "ACTIVE").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Leases Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-600">{dummyTenants.filter(t => t.status === "EXPIRING_SOON").length}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tenants..."
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
          <option value="EXPIRING_SOON">Expiring Soon</option>
          <option value="EXPIRED">Expired</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center text-white font-bold text-lg">
                  {tenant.firstName[0]}{tenant.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-brand-text)]">
                    {tenant.firstName} {tenant.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{tenant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{tenant.phone}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(tenant.status)}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Home size={14} className="text-gray-400" />
                <span className="text-sm font-medium">{tenant.propertyId.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>
                  <span className="block font-medium">Unit</span>
                  {tenant.unit}
                </div>
                <div>
                  <span className="block font-medium">Rent</span>
                  ₦{tenant.rentAmount.toLocaleString()}/month
                </div>
                <div>
                  <span className="block font-medium">Lease</span>
                  {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                </div>
                <div>
                  <span className="block font-medium">Status</span>
                  <Badge variant={tenant.paymentHistory.some(p => !p.paid) ? "warning" : "success"}>
                    {tenant.paymentHistory.some(p => !p.paid) ? "Has arrears" : "Up to date"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleContact(tenant._id)}>
                <Mail size={14} className="mr-1" />
                Contact
              </Button>
              <Button size="sm" variant="ghost" className="flex-1" onClick={() => handleViewDetails(tenant._id)}>
                <Eye size={14} className="mr-1" />
                Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No tenants found</p>
        </div>
      )}
    </div>
  );
}