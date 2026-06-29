import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Button, Badge, Spinner, Pagination } from "@/ui";
import { Search, Plus, Edit, Trash2, Eye, Home, CheckCircle, XCircle, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { PropertyService } from "@/services/property.service";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";

export default function AdminProperties() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
    loading?: boolean;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Fetch properties with real API
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-properties", page, search, statusFilter, approvalFilter, typeFilter],
    queryFn: () =>
      PropertyService.list({
        page,
        limit: 12,
        search: search || undefined,
        status: statusFilter || undefined,
        approvalStatus: approvalFilter || undefined,
        type: typeFilter || undefined,
      }),
  });

  const properties = data?.data?.data || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const total = data?.data?.total || data?.total || 0;

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => PropertyService.approveProperty(id),
    onSuccess: () => {
      toast.success("Property approved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve property");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      PropertyService.rejectProperty(id, reason),
    onSuccess: () => {
      toast.success("Property rejected");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject property");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => PropertyService.delete(id),
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete property");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  // Featured toggle mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      PropertyService.update(id, { isFeatured: featured }),
    onSuccess: () => {
      toast.success("Property featured status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update featured status");
    },
  });

  const handleApprove = (id: string) => {
    setConfirmationModal({
      open: true,
      title: "Approve Property",
      message: "Are you sure you want to approve this property? It will become visible to users.",
      confirmText: "Approve",
      variant: "info",
      onConfirm: () => approveMutation.mutate(id),
    });
  };

  const handleReject = (id: string) => {
    setConfirmationModal({
      open: true,
      title: "Reject Property",
      message: "Are you sure you want to reject this property?",
      confirmText: "Reject",
      variant: "danger",
      onConfirm: () => rejectMutation.mutate({ id }),
    });
  };

  const handleDelete = (id: string) => {
    setConfirmationModal({
      open: true,
      title: "Delete Property",
      message: "Are you sure you want to delete this property? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  const handleToggleFeatured = (id: string, currentStatus: boolean) => {
    toggleFeaturedMutation.mutate({ id, featured: !currentStatus });
  };

  const clearFilters = () => {
    setStatusFilter("");
    setApprovalFilter("");
    setTypeFilter("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = statusFilter || approvalFilter || typeFilter || search;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Properties</h1>
          <p className="text-gray-500 mt-1">
            Manage all properties on the platform • {total} total
          </p>
        </div>
        <Link to="/admin/properties/create">
          <Button>
            <Plus size={18} className="mr-2" />
            Add Property
          </Button>
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

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Filter size={18} />
          <span>Filters</span>
          {hasActiveFilters && (
            <Badge variant="primary" className="ml-1">
              {[statusFilter, approvalFilter, typeFilter].filter(Boolean).length}
            </Badge>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[var(--color-brand-primary)] hover:underline flex items-center gap-1"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">All Approval Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">All Types</option>
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <Card className="text-center py-12">
          <Home size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-600">No Properties Found</h3>
          <p className="text-gray-400 mt-1">
            {hasActiveFilters ? "Try adjusting your search or filters" : "No properties have been listed yet"}
          </p>
          {!hasActiveFilters && (
            <Link to="/admin/properties/create">
              <Button className="mt-4">
                <Plus size={18} className="mr-2" />
                Add Property
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <Card key={property._id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={property.media?.[0]?.url || "https://via.placeholder.com/400x250"}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {property.isFeatured && (
                    <Badge variant="primary">Featured</Badge>
                  )}
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
                <p className="text-sm text-gray-500">{property.location?.city}, {property.location?.state}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xl font-bold text-[var(--color-brand-primary)]">
                    ₦{property.price?.toLocaleString()}
                  </p>
                  <Badge variant={property.status === "AVAILABLE" ? "success" : "warning"}>
                    {property.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link to={`/properties/${property._id}`} className="flex-1 min-w-[60px]">
                    <Button variant="ghost" className="w-full" size="sm">
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/admin/properties/${property._id}/edit`} className="flex-1 min-w-[60px]">
                    <Button variant="secondary" className="w-full" size="sm">
                      <Edit size={14} className="mr-1" />
                      Edit
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
                  {property.approvalStatus === "approved" && (
                    <button
                      onClick={() => handleToggleFeatured(property._id, property.isFeatured)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      title={property.isFeatured ? "Remove Featured" : "Make Featured"}
                    >
                      {property.isFeatured ? "★" : "☆"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                  <span>Views: {property.views || 0}</span>
                  <span>Listed: {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText || "Confirm"}
        variant={confirmationModal.variant || "danger"}
        loading={
          approveMutation.isPending ||
          rejectMutation.isPending ||
          deleteMutation.isPending
        }
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
}