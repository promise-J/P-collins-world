import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { Card, Button, Spinner, Badge, Modal } from "@/ui";
import { Eye, CheckCircle, XCircle, FileText, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminKyc() {
  const queryClient = useQueryClient();
  const [selectedKyc, setSelectedKyc] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["pending-kyc"],
    queryFn: () => AdminService.getPendingKyc(),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      AdminService.reviewKyc(id, status, reason),
    onSuccess: () => {
      toast.success("KYC reviewed successfully");
      queryClient.invalidateQueries({ queryKey: ["pending-kyc"] });
      setShowModal(false);
    },
    onError: () => {
      toast.error("Failed to review KYC");
    },
  });

  const kycList = data?.data || [];

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
            <Card key={kyc._id} className="p-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center text-white font-bold">
                    {kyc.fullName?.[0] || "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold">{kyc.fullName}</h3>
                    <p className="text-sm text-gray-500">{kyc.userId?.email}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-400">
                      <span>ID Type: {kyc.idType}</span>
                      <span>ID Number: {kyc.idNumber}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="warning">Pending Review</Badge>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedKyc(kyc);
                    setShowModal(true);
                  }}
                >
                  <Eye size={16} className="mr-1" />
                  View Documents
                </Button>
                <Button
                  size="sm"
                //   variant="success"
                  onClick={() => reviewMutation.mutate({ id: kyc._id, status: "VERIFIED" })}
                  disabled={reviewMutation.isPending}
                >
                  <CheckCircle size={16} className="mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => reviewMutation.mutate({ id: kyc._id, status: "REJECTED", reason: "Invalid documents" })}
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
      <Modal open={showModal} title="KYC Documents" onClose={() => setShowModal(false)}>
        {selectedKyc && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">ID Document</h4>
              <img src={selectedKyc.idDocumentUrl} alt="ID Document" className="w-full rounded-lg border" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Selfie</h4>
              <img src={selectedKyc.selfieUrl} alt="Selfie" className="w-full rounded-lg border" />
            </div>
            {selectedKyc.documents?.map((doc: any, idx: number) => (
              <div key={idx}>
                <h4 className="font-medium mb-2">{doc.type.toUpperCase()}</h4>
                <img src={doc.url} alt={`Document ${idx + 1}`} className="w-full rounded-lg border" />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}