import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Eye, FileText, UserCheck } from 'lucide-react';
import { Card, Button, Badge, Modal } from '@/ui';
import toast from 'react-hot-toast';
import { KYCService } from '@/services/kyc.service';

interface KycDocument {
  type: string;
  url: string;
  publicId: string;
}

interface KycReviewCardProps {
  kyc: {
    _id: string;
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    fullName: string;
    idType: string;
    idNumber: string;
    idDocumentUrl: string;
    selfieUrl: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    documents?: KycDocument[];
    rejectionReason?: string;
    createdAt: string;
  };
  onReviewComplete?: () => void;
}

export function KycReviewCard({ kyc, onReviewComplete }: KycReviewCardProps) {
  const [showDocuments, setShowDocuments] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      KYCService.review(id, { status, reason }),
    onSuccess: () => {
      toast.success(`KYC ${kyc.status === 'VERIFIED' ? 'verified' : 'rejected'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['pending-kyc'] });
      onReviewComplete?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to review KYC');
    },
  });

  const handleVerify = () => {
    reviewMutation.mutate({ id: kyc._id, status: 'VERIFIED' });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    reviewMutation.mutate({ id: kyc._id, status: 'REJECTED', reason: rejectionReason });
    setShowRejectModal(false);
    setRejectionReason('');
  };

  const getStatusBadge = () => {
    switch (kyc.status) {
      case 'VERIFIED':
        return <Badge variant="success">Verified</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending Review</Badge>;
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-[var(--color-brand-primary)]/10">
              <UserCheck size={24} className="text-[var(--color-brand-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-brand-text)]">
                {kyc.fullName || `${kyc.userId?.firstName} ${kyc.userId?.lastName}`}
              </h3>
              <p className="text-sm text-gray-500">{kyc.userId?.email}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500">ID Type</p>
            <p className="font-medium">{kyc.idType}</p>
          </div>
          <div>
            <p className="text-gray-500">ID Number</p>
            <p className="font-medium">{kyc.idNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Submitted</p>
            <p className="font-medium">{new Date(kyc.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Documents Preview */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setShowDocuments(true)}
            className="flex items-center gap-2 text-sm text-[var(--color-brand-primary)] hover:underline"
          >
            <Eye size={16} />
            View Documents
          </button>
          <a
            href={kyc.idDocumentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--color-brand-primary)] hover:underline"
          >
            <FileText size={16} />
            ID Document
          </a>
          <a
            href={kyc.selfieUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--color-brand-primary)] hover:underline"
          >
            <FileText size={16} />
            Selfie
          </a>
        </div>

        {/* Rejection Reason (if rejected) */}
        {kyc.status === 'REJECTED' && kyc.rejectionReason && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">
              <strong>Rejection Reason:</strong> {kyc.rejectionReason}
            </p>
          </div>
        )}

        {/* Actions (only for pending) */}
        {kyc.status === 'PENDING' && (
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              onClick={handleVerify}
              loading={reviewMutation.isPending && reviewMutation.variables?.status === 'VERIFIED'}
              className="flex-1"
            >
              <CheckCircle size={18} className="mr-2" />
              Verify KYC
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowRejectModal(true)}
              loading={reviewMutation.isPending && reviewMutation.variables?.status === 'REJECTED'}
              className="flex-1"
            >
              <XCircle size={18} className="mr-2" />
              Reject
            </Button>
          </div>
        )}
      </Card>

      {/* Documents Modal */}
      <Modal open={showDocuments} title="KYC Documents" onClose={() => setShowDocuments(false)}>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">ID Document</h4>
            <img src={kyc.idDocumentUrl} alt="ID Document" className="w-full rounded-lg border" />
          </div>
          <div>
            <h4 className="font-medium mb-2">Selfie</h4>
            <img src={kyc.selfieUrl} alt="Selfie" className="w-full rounded-lg border" />
          </div>
          {kyc.documents?.map((doc, idx) => (
            <div key={idx}>
              <h4 className="font-medium mb-2">{doc.type.toUpperCase()}</h4>
              <img src={doc.url} alt={`Document ${idx + 1}`} className="w-full rounded-lg border" />
            </div>
          ))}
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal open={showRejectModal} title="Reject KYC" onClose={() => setShowRejectModal(false)}>
        <div className="space-y-4">
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
            rows={4}
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}