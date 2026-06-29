import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { Card, Button, Spinner, Badge, Modal, TextArea } from "@/ui";
import { Eye, CheckCircle, XCircle, FileText, UserCheck, AlertCircle } from "lucide-react";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";
import toast from "react-hot-toast";

export default function AdminKyc() {
  const queryClient = useQueryClient();
  const [selectedKyc, setSelectedKyc] = useState<any>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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
    queryKey: ["pending-kyc"],
    queryFn: () => AdminService.getPendingKyc(),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      AdminService.reviewKyc(id, status, reason),
    onSuccess: () => {
      toast.success("KYC reviewed successfully");
      queryClient.invalidateQueries({ queryKey: ["pending-kyc"] });
      setShowRejectModal(false);
      setRejectReason("");
      setConfirmationModal(prev => ({ ...prev, open: false }));
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to review KYC");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  const kycList = data?.data || [];

  const handleApprove = (kyc: any) => {
    setConfirmationModal({
      open: true,
      title: "Approve KYC",
      message: `Are you sure you want to approve KYC for "${kyc.fullName}"? This user will be fully verified.`,
      confirmText: "Approve",
      variant: "info",
      onConfirm: () => reviewMutation.mutate({ id: kyc._id, status: "VERIFIED" }),
    });
  };

  const handleReject = (kyc: any) => {
    setSelectedKyc(kyc);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    reviewMutation.mutate({ 
      id: selectedKyc._id, 
      status: "REJECTED", 
      reason: rejectReason 
    });
  };

  const handleViewDocuments = (kyc: any) => {
    setSelectedKyc(kyc);
    setShowDocumentModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">KYC Verification</h1>
        <p className="text-gray-500 mt-1">Review and verify user KYC submissions</p>
        <p className="text-sm text-gray-400 mt-1">
          {kycList.length} pending KYC submission{kycList.length !== 1 ? 's' : ''}
        </p>
      </div>

      {kycList.length === 0 ? (
        <Card className="text-center py-12">
          <UserCheck size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-600">No Pending KYC</h3>
          <p className="text-gray-400 mt-1">All KYC submissions have been reviewed</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {kycList.map((kyc: any) => (
            <Card key={kyc._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center text-white font-bold text-lg">
                    {kyc.fullName?.[0] || "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-brand-text)]">
                      {kyc.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">{kyc.userId?.email}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                      <span>ID Type: {kyc.idType}</span>
                      <span>ID Number: {kyc.idNumber}</span>
                      <span>Submitted: {new Date(kyc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="warning">Pending Review</Badge>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  size="sm"
                  onClick={() => handleViewDocuments(kyc)}
                >
                  <Eye size={16} className="mr-1" />
                  View Documents
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleApprove(kyc)}
                  disabled={reviewMutation.isPending}
                >
                  <CheckCircle size={16} className="mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleReject(kyc)}
                  disabled={reviewMutation.isPending}
                >
                  <XCircle size={16} className="mr-1" />
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Document Modal */}
      <Modal open={showDocumentModal} title="KYC Documents" onClose={() => setShowDocumentModal(false)}>
        {selectedKyc && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-500 mt-0.5" />
              <p className="text-xs text-blue-600">
                Review these documents carefully before making a decision.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText size={16} />
                ID Document ({selectedKyc.idType})
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={selectedKyc.idDocumentUrl} 
                  alt="ID Document" 
                  className="w-full max-h-96 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Document+Not+Available";
                  }}
                />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Selfie</h4>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={selectedKyc.selfieUrl} 
                  alt="Selfie" 
                  className="w-full max-h-96 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Selfie+Not+Available";
                  }}
                />
              </div>
            </div>
            
            {selectedKyc.documents?.map((doc: any, idx: number) => (
              <div key={idx}>
                <h4 className="font-medium mb-2">{doc.type?.toUpperCase() || "Document"} {idx + 1}</h4>
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={doc.url} 
                    alt={`Document ${idx + 1}`} 
                    className="w-full max-h-96 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x300?text=Document+Not+Available";
                    }}
                  />
                </div>
              </div>
            ))}
            
            <div className="flex gap-3 pt-2">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => {
                  setShowDocumentModal(false);
                  handleApprove(selectedKyc);
                }}
                disabled={reviewMutation.isPending}
              >
                <CheckCircle size={16} className="mr-2" />
                Approve
              </Button>
              <Button 
                variant="danger" 
                className="flex-1"
                onClick={() => {
                  setShowDocumentModal(false);
                  handleReject(selectedKyc);
                }}
                disabled={reviewMutation.isPending}
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Reason Modal */}
      <Modal open={showRejectModal} title="Reject KYC" onClose={() => setShowRejectModal(false)}>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Please provide a reason for rejecting this KYC submission:
          </p>
          <TextArea
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g., ID document is blurry, information mismatch, etc."
            rows={4}
            required
          />
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmReject}
              disabled={reviewMutation.isPending || !rejectReason.trim()}
              className="flex-1"
            >
              {reviewMutation.isPending ? <Spinner size="sm" /> : "Confirm Rejection"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText || "Confirm"}
        variant={confirmationModal.variant || "danger"}
        loading={reviewMutation.isPending}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
}