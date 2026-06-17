import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { KYCService } from "@/services/kyc.service";
import { Button, Card, Input, Spinner, TextArea } from "@/ui";
import { 
  User, 
  CreditCard, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Image as ImageIcon,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";

export default function KYCSubmissionPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [additionalDocs, setAdditionalDocs] = useState<{ file: File; preview: string }[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    idType: "NIN",
    idNumber: "",
  });

  // Check if user already has KYC
  const { data: existingKyc, isLoading: kycLoading } = useQuery({
    queryKey: ["my-kyc"],
    queryFn: () => KYCService.getMyKyc(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (existingKyc?.data) {
      const kyc = existingKyc.data;
      if (kyc.status === "VERIFIED") {
        toast.success("Your KYC is already verified!");
        navigate("/profile");
      } else if (kyc.status === "PENDING") {
        toast.loading("Your KYC is pending review", { duration: 3000 });
      }
    }
  }, [existingKyc, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIdDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setIdDocumentFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdDocumentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelfieFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalDocs(prev => [...prev, { file, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAdditionalDoc = (index: number) => {
    setAdditionalDocs(prev => prev.filter((_, i) => i !== index));
  };

  const kycMutation = useMutation({
    mutationFn: async () => {
      if (!idDocumentFile || !selfieFile) {
        throw new Error("Please upload both ID document and selfie");
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("idType", formData.idType);
      formDataToSend.append("idNumber", formData.idNumber);
      formDataToSend.append("idDocument", idDocumentFile);
      formDataToSend.append("selfie", selfieFile);
      
      additionalDocs.forEach((doc, index) => {
        formDataToSend.append(`documents`, doc.file);
      });
      
      return KYCService.submitKyc(formDataToSend);
    },
    onSuccess: () => {
      toast.success("KYC submitted successfully! Pending review.");
      navigate("/profile");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit KYC");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.idNumber) {
      toast.error("Please enter your ID number");
      return;
    }
    if (!idDocumentFile) {
      toast.error("Please upload your ID document");
      return;
    }
    if (!selfieFile) {
      toast.error("Please upload a selfie");
      return;
    }
    
    kycMutation.mutate();
  };

  // If KYC is already verified, show message
  if (existingKyc?.data?.status === "VERIFIED") {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-12">
          <Card className="text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-brand-text)] mb-2">
              KYC Already Verified
            </h2>
            <p className="text-gray-500 mb-6">
              Your identity has already been verified. You have full access to all features.
            </p>
            <Button onClick={() => navigate("/profile")}>
              Go to Profile
            </Button>
          </Card>
        </div>
      </Container>
    );
  }

  // If KYC is pending, show pending message
  if (existingKyc?.data?.status === "PENDING") {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-12">
          <Card className="text-center p-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={40} className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-brand-text)] mb-2">
              KYC Pending Review
            </h2>
            <p className="text-gray-500 mb-6">
              Your KYC documents are being reviewed by our team. This usually takes 24-48 hours.
            </p>
            <Button onClick={() => navigate("/profile")}>
              Back to Profile
            </Button>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">KYC Verification</h1>
          <p className="text-gray-500 mt-1">
            Verify your identity to unlock all features (savings, property listing, and more)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <User size={20} className="text-[var(--color-brand-primary)]" />
              Personal Information
            </h2>
            
            <div className="space-y-5">
              <Input
                label="Full Name (as on ID)"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g., John Oluwaseun Doe"
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Type
                  </label>
                  <select
                    name="idType"
                    value={formData.idType}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                    required
                  >
                    <option value="NIN">National ID Number (NIN)</option>
                    <option value="PASSPORT">International Passport</option>
                    <option value="DRIVERS_LICENSE">Driver's License</option>
                    <option value="VOTERS_CARD">Voter's Card</option>
                  </select>
                </div>
                
                <Input
                  label="ID Number"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your ID number"
                  required
                />
              </div>
            </div>
          </Card>

          {/* ID Document Upload */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <FileText size={20} className="text-[var(--color-brand-primary)]" />
              ID Document
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {!idDocumentPreview ? (
                <label className="cursor-pointer block">
                  <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-1">Click to upload ID document</p>
                  <p className="text-xs text-gray-400">PNG, JPG, PDF (Max 5MB)</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleIdDocumentUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img src={idDocumentPreview} alt="ID Document" className="max-h-48 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setIdDocumentFile(null);
                      setIdDocumentPreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Selfie Upload */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <Camera size={20} className="text-[var(--color-brand-primary)]" />
              Selfie
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {!selfiePreview ? (
                <label className="cursor-pointer block">
                  <Camera size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-1">Take or upload a selfie</p>
                  <p className="text-xs text-gray-400">PNG, JPG (Max 5MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img src={selfiePreview} alt="Selfie" className="max-h-48 rounded-lg mx-auto" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelfieFile(null);
                      setSelfiePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Additional Documents (Optional) */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <ImageIcon size={20} className="text-[var(--color-brand-primary)]" />
              Additional Documents (Optional)
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <label className="cursor-pointer block">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload additional verification documents</p>
                  <p className="text-xs text-gray-400">Utility bill, bank statement, etc.</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleAdditionalDocUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {additionalDocs.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {additionalDocs.map((doc, index) => (
                    <div key={index} className="relative">
                      <img src={doc.preview} alt={`Document ${index + 1}`} className="h-20 w-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeAdditionalDoc(index)}
                        className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-700">Why KYC is required?</p>
              <p className="text-sm text-blue-600 mt-1">
                KYC verification is required for:
                <br />• Creating savings groups
                <br />• Listing properties as Agent/Landlord
                <br />• Withdrawals above ₦500,000
                <br />• Becoming a verified vendor
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="ghost" onClick={() => navigate("/profile")}>
              Cancel
            </Button>
            <Button type="submit" disabled={kycMutation.isPending}>
              {kycMutation.isPending ? <Spinner size="sm" /> : "Submit KYC"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}