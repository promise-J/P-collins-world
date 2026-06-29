import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Button, Spinner, Badge, Pagination, Modal, TextArea } from "@/ui";
import { Search, AlertTriangle, CheckCircle, XCircle, Clock, Filter, X } from "lucide-react";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";
import toast from "react-hot-toast";
import { DisputeData, DisputeService } from "@/services/dispute.service";

export default function AdminDisputes() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<DisputeData | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolution, setResolution] = useState("");
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalationNotes, setEscalationNotes] = useState("");
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-disputes", page, statusFilter, priorityFilter, search],
    queryFn: () =>
      DisputeService.getDisputes({
        page,
        limit: 10,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: search || undefined,
      }),
  });

  const disputes = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  // Resolve mutation
  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution?: string }) =>
      DisputeService.resolveDispute(id, resolution ?? ""),
    onSuccess: () => {
      toast.success("Dispute resolved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
      setShowResolveModal(false);
      setResolution("");
      setConfirmationModal(prev => ({ ...prev, open: false }));
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resolve dispute");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  // Escalate mutation
  const escalateMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      DisputeService.escalateDispute(id, notes),
    onSuccess: () => {
      toast.success("Dispute escalated to support team");
      queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
      setShowEscalateModal(false);
      setEscalationNotes("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to escalate dispute");
    },
  });

  // Close mutation
  const closeMutation = useMutation({
    mutationFn: (id: string) => DisputeService.closeDispute(id),
    onSuccess: () => {
      toast.success("Dispute closed successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to close dispute");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  const handleResolve = (dispute: DisputeData) => {
    setSelectedDispute(dispute);
    setResolution("");
    setShowResolveModal(true);
  };

  const handleEscalate = (dispute: DisputeData) => {
    setSelectedDispute(dispute);
    setEscalationNotes("");
    setShowEscalateModal(true);
  };

  const handleClose = (dispute: DisputeData) => {
    setConfirmationModal({
      open: true,
      title: "Close Dispute",
      message: `Are you sure you want to close this dispute? This action cannot be undone.`,
      confirmText: "Close Dispute",
      variant: "warning",
      onConfirm: () => closeMutation.mutate(dispute._id),
    });
  };

  const confirmResolve = () => {
    if (!selectedDispute) return;
    resolveMutation.mutate({ id: selectedDispute._id, resolution });
  };

  const confirmEscalate = () => {
    if (!selectedDispute) return;
    escalateMutation.mutate({ id: selectedDispute._id, notes: escalationNotes });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "IN_REVIEW":
        return <Badge variant="primary">In Review</Badge>;
      case "RESOLVED":
        return <Badge variant="success">Resolved</Badge>;
      case "CLOSED":
        return <Badge variant="default">Closed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge variant="danger">High</Badge>;
      case "MEDIUM":
        return <Badge variant="warning">Medium</Badge>;
      case "LOW":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ORDER":
        return <Badge variant="primary">Order</Badge>;
      case "PROPERTY":
        return <Badge variant="secondary">Property</Badge>;
      case "PAYMENT":
        return <Badge variant="success">Payment</Badge>;
      default:
        return <Badge variant="default">Other</Badge>;
    }
  };

  const clearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = statusFilter || priorityFilter || search;

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
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Disputes</h1>
          <p className="text-gray-500 mt-1">Manage and resolve disputes on the platform</p>
          <p className="text-sm text-gray-400 mt-1">Total: {total} disputes</p>
        </div>
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
          {(statusFilter || priorityFilter) && (
            <Badge variant="primary" className="ml-1">
              {[statusFilter, priorityFilter].filter(Boolean).length}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Disputes List */}
      {disputes.length === 0 ? (
        <Card className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-600">No Disputes Found</h3>
          <p className="text-gray-400 mt-1">
            {hasActiveFilters ? "Try adjusting your search or filters" : "All disputes have been resolved"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputes?.data?.map((dispute: DisputeData) => (
            <Card key={dispute._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <AlertTriangle
                      size={20}
                      className={
                        dispute.priority === "HIGH"
                          ? "text-red-500"
                          : dispute.priority === "MEDIUM"
                          ? "text-yellow-500"
                          : "text-blue-500"
                      }
                    />
                    <h3 className="font-semibold text-[var(--color-brand-text)]">
                      {dispute.title}
                    </h3>
                    {getPriorityBadge(dispute?.priority ?? "")}
                    {getStatusBadge(dispute?.status ?? "")}
                    {getTypeBadge(dispute.type ?? "")}
                  </div>
                  <p className="text-gray-600 text-sm">{dispute.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span>
                      Customer: {dispute?.customer?.firstName ?? ""} {dispute?.customer?.lastName ?? ""}
                    </span>
                    <span>Email: {dispute.customer?.email}</span>
                    {dispute.orderId && <span>Order: {dispute.orderId}</span>}
                    {dispute.propertyId && <span>Property: {dispute.propertyId}</span>}
                    <span>Created: {new Date(dispute?.createdAt).toLocaleDateString()}</span>
                  </div>
                  {dispute?.resolution && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Resolution:</strong> {dispute?.resolution}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {dispute?.status !== "RESOLVED" && dispute?.status !== "CLOSED" && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleResolve(dispute)}
                        disabled={resolveMutation.isPending}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEscalate(dispute)}
                        disabled={escalateMutation.isPending}
                      >
                        <Clock size={14} className="mr-1" />
                        Escalate
                      </Button>
                    </>
                  )}
                  {dispute?.status === "RESOLVED" && (
                    <>
                      <Badge variant="success">Resolved ✓</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleClose(dispute)}
                      >
                        <XCircle size={14} className="mr-1" />
                        Close
                      </Button>
                    </>
                  )}
                  {dispute?.status === "CLOSED" && <Badge variant="default">Closed</Badge>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Resolve Modal */}
      {selectedDispute && (
        <Modal
          open={showResolveModal}
          title="Resolve Dispute"
          onClose={() => {
            setShowResolveModal(false);
            setResolution("");
          }}
        >
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Dispute: {selectedDispute.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                Customer: {selectedDispute.customer.firstName}{" "}
                {selectedDispute.customer.lastName}
              </p>
            </div>
            <TextArea
              label="Resolution Notes"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Describe how this dispute was resolved..."
              rows={3}
            />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowResolveModal(false);
                  setResolution("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={confirmResolve}
                disabled={resolveMutation.isPending}
                className="flex-1"
              >
                {resolveMutation.isPending ? <Spinner size="sm" /> : "Resolve Dispute"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Escalate Modal */}
      {selectedDispute && (
        <Modal
          open={showEscalateModal}
          title="Escalate Dispute"
          onClose={() => {
            setShowEscalateModal(false);
            setEscalationNotes("");
          }}
        >
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Dispute: {selectedDispute.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                Customer: {selectedDispute.customer.firstName}{" "}
                {selectedDispute.customer.lastName}
              </p>
            </div>
            <TextArea
              label="Escalation Notes"
              value={escalationNotes}
              onChange={(e) => setEscalationNotes(e.target.value)}
              placeholder="Why is this being escalated?"
              rows={3}
            />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowEscalateModal(false);
                  setEscalationNotes("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={confirmEscalate}
                disabled={escalateMutation.isPending}
                className="flex-1"
              >
                {escalateMutation.isPending ? <Spinner size="sm" /> : "Escalate"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText || "Confirm"}
        variant={confirmationModal.variant || "danger"}
        loading={closeMutation.isPending}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
}