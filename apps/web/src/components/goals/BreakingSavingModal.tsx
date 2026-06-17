import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SavingsService } from "@/services/savings.service";
import { Modal, Button, Spinner } from "@/ui";
import { 
  AlertTriangle, 
  TrendingDown, 
  Wallet, 
  AlertCircle,
  Lock,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

interface BreakSavingsModalProps {
  open: boolean;
  amount: number;
  planId?: string;
  groupId?: string;
  isGroup?: boolean;
  groupName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BreakSavingsModal({ 
  open, 
  amount, 
  planId, 
  groupId, 
  isGroup = false,
  groupName,
  onClose, 
  onSuccess 
}: BreakSavingsModalProps) {
  const [step, setStep] = useState<"confirm" | "details">("confirm");
  const [breakResult, setBreakResult] = useState<{
    totalSaved?: number;
    penalty?: number;
    payout?: number;
    perMember?: number;
  } | null>(null);

  const PENALTY_PERCENTAGE = 10;
  const penaltyAmount = amount * (PENALTY_PERCENTAGE / 100);
  const payoutAmount = amount - penaltyAmount;

  const breakMutation = useMutation({
    mutationFn: async () => {
      if (isGroup && groupId) {
        const result = await SavingsService.breakGroup(groupId);
        return { ...result, isGroup: true };
      } else if (planId) {
        const result = await SavingsService.breakPlan(planId);
        return { ...result, isGroup: false };
      }
      throw new Error("No plan or group ID provided");
    },
    onSuccess: (response) => {
      const data = response.data;
      setBreakResult({
        totalSaved: data?.totalSaved || amount,
        penalty: data?.penalty || penaltyAmount,
        payout: data?.payout || payoutAmount,
        perMember: data?.perMember,
      });
      setStep("details");
      
      if (!isGroup) {
        toast.success("Savings plan broken successfully");
      } else {
        toast.success("Group savings broken successfully");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to break savings");
      onClose();
    },
  });

  const handleConfirm = () => {
    breakMutation.mutate();
  };

  const handleClose = () => {
    setStep("confirm");
    setBreakResult(null);
    onClose();
    if (breakMutation.isSuccess && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Modal open={open} title={isGroup ? "Break Group Savings" : "Break Savings Plan"} onClose={handleClose}>
      <div className="max-h-[70vh] overflow-y-auto px-1">
      <div className="space-y-5 pb-4"></div>
      {step === "confirm" && (
        <div className="space-y-5">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
          </div>

          {/* Warning Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[var(--color-brand-text)] mb-2">
              Are you sure?
            </h3>
            <p className="text-gray-600">
              {isGroup 
                ? `You are about to break the group savings "${groupName}". This action cannot be undone.`
                : "You are about to break your savings plan. This action cannot be undone."
              }
            </p>
          </div>

          {/* Penalty Breakdown */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={18} className="text-red-600" />
              <span className="font-medium text-red-700">Penalty Breakdown</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-600">Total Saved</span>
                <span className="font-medium text-red-700">₦{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Penalty ({PENALTY_PERCENTAGE}%)</span>
                <span className="font-medium text-red-700">- ₦{penaltyAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-red-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-red-800">You'll Receive</span>
                  <span className="font-bold text-red-800">₦{payoutAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
            <Lock size={16} className="text-yellow-600 mt-0.5" />
            <div>
              <p className="text-xs text-yellow-700 font-medium">Important Note</p>
              <p className="text-xs text-yellow-600 mt-1">
                {isGroup
                  ? "Breaking the group will distribute remaining funds to all members after penalty. All members will be notified."
                  : "Breaking your savings plan will close it permanently. You will receive your savings minus the penalty fee."
                }
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="danger" 
              onClick={handleConfirm}
              disabled={breakMutation.isPending}
              className="flex-1"
            >
              {breakMutation.isPending ? <Spinner size="sm" /> : "Yes, Break Savings"}
            </Button>
          </div>
        </div>
      )}

      {step === "details" && breakResult && (
        <div className="space-y-5">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Wallet size={32} className="text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[var(--color-brand-text)] mb-2">
              Savings {isGroup ? "Group Broken" : "Plan Broken"}
            </h3>
            <p className="text-gray-600">
              {isGroup
                ? "The group savings has been successfully broken."
                : "Your savings plan has been successfully broken."
              }
            </p>
          </div>

          {/* Break Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Saved</span>
                <span className="font-medium">₦{breakResult.totalSaved?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Penalty ({PENALTY_PERCENTAGE}%)</span>
                <span className="text-red-500">- ₦{breakResult.penalty?.toLocaleString()}</span>
              </div>
              
              {isGroup && breakResult.perMember && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-500">Per Member Payout</span>
                  <span className="font-medium text-green-600">₦{breakResult.perMember?.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Payout Amount</span>
                <span className="font-bold text-[var(--color-brand-primary)] text-lg">
                  ₦{breakResult.payout?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-blue-600 mt-0.5" />
            <p className="text-xs text-blue-600">
              {isGroup
                ? "Funds have been distributed to all group members' wallets. Check your wallet for the payout."
                : "Funds have been credited to your wallet. You can check your wallet balance for the payout."
              }
            </p>
          </div>

          {/* Close Button */}
          <Button onClick={handleClose} className="w-full">
            Close
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      )}
      </div>
    </Modal>
  );
}