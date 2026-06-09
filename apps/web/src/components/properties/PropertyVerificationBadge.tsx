import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface Props {
  verified: boolean;
  status?: "PENDING" | "VERIFIED" | "REJECTED";
}

export function PropertyVerificationBadge({ verified, status = "PENDING" }: Props) {
  if (verified || status === "VERIFIED") {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-sm text-green-700">
        <CheckCircle size={14} />
        Verified
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-sm text-red-700">
        <AlertTriangle size={14} />
        Rejected
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-sm text-yellow-700">
      <Clock size={14} />
      Pending Verification
    </div>
  );
}