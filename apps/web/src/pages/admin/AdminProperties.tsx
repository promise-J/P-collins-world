import { useState } from "react";
import { Card, Button, Badge, Spinner } from "@/ui";
import { Search, Plus, Edit, Trash2, Eye, Home, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const dummyProperties = [
  {
    _id: "1",
    title: "Luxury Apartment in Victoria Island",
    description: "Beautiful 3-bedroom apartment with ocean view",
    price: 150000000,
    location: { address: "123 Ahmadu Bello Way", city: "Lagos", state: "Lagos" },
    type: "APARTMENT",
    status: "AVAILABLE",
    approvalStatus: "approved",
    landlordId: { firstName: "John", lastName: "Doe" },
    media: [{ url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400" }],
    views: 245,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Modern 4-Bedroom House in Lekki",
    description: "Spacious family home with swimming pool",
    price: 250000000,
    location: { address: "45 Admiralty Way", city: "Lagos", state: "Lagos" },
    type: "HOUSE",
    status: "AVAILABLE",
    approvalStatus: "pending",
    landlordId: { firstName: "Jane", lastName: "Smith" },
    media: [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400" }],
    views: 189,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Commercial Space in Ikeja",
    description: "Prime commercial space suitable for office",
    price: 80000000,
    location: { address: "10 Allen Avenue", city: "Lagos", state: "Lagos" },
    type: "COMMERCIAL",
    status: "RESERVED",
    approvalStatus: "approved",
    landlordId: { firstName: "Mike", lastName: "Johnson" },
    media: [{ url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400" }],
    views: 67,
    createdAt: new Date().toISOString(),
  },
];

export default function AdminProperties() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleApprove = (id: string) => {
    toast.success("Property approved successfully");
  };

  const handleReject = (id: string) => {
    toast.success("Property rejected");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      toast.success("Property deleted successfully");
    }
  };

  const filteredProperties = dummyProperties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Properties</h1>
          <p className="text-gray-500 mt-1">Manage all properties on the platform</p>
        </div>
        <Link to="/properties/create" className="flex items-center">
            <Plus size={18} className="mr-2" />
            <span className="text-[10px]">Add Property</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
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
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="OCCUPIED">Occupied</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]">
          <option value="">All Approval Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={property.media[0]?.url || "https://via.placeholder.com/400x250"}
                alt={property.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {property.approvalStatus === "pending" && (
                  <Badge variant="warning">Pending</Badge>
                )}
                {property.approvalStatus === "approved" && (
                  <Badge variant="success">Approved</Badge>
                )}
                {property.approvalStatus === "rejected" && (
                  <Badge variant="danger">Rejected</Badge>
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
              <p className="text-sm text-gray-500">{property.location.city}, {property.location.state}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xl font-bold text-[var(--color-brand-primary)]">
                  ₦{property.price.toLocaleString()}
                </p>
                <Badge variant={property.status === "AVAILABLE" ? "success" : "warning"}>
                  {property.status}
                </Badge>
              </div>
              <div className="flex gap-2 mt-4">
                <Link to={`/properties/${property._id}`} className="flex-1">
                  <Button variant="ghost" className="w-full">
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                </Link>
                {property.approvalStatus === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(property._id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(property._id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Reject"
                    >
                      <XCircle size={16} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(property._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Home size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No properties found</p>
        </div>
      )}
    </div>
  );
}