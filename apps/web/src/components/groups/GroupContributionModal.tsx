import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SavingsService } from "@/services/savings.service";
import { Modal, Button, Input, Spinner } from "@/ui";
import { Wallet, AlertCircle, Users } from "lucide-react";
import toast from "react-hot-toast";

interface GroupContributionModalProps {
  open: boolean;
  groupId: string;
  groupName: string;
  contributionAmount: number;
  currentAmount: number;
  targetAmount: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GroupContributionModal({
  open,
  groupId,
  groupName,
  contributionAmount,
  currentAmount,
  targetAmount,
  onClose,
  onSuccess,
}: GroupContributionModalProps) {
  const [amount, setAmount] = useState(contributionAmount.toString());
  const remaining = targetAmount - currentAmount;

  const contributeMutation = useMutation({
    mutationFn: () => {
      const contributionAmountNum = parseFloat(amount);
      if (isNaN(contributionAmountNum) || contributionAmountNum <= 0) {
        throw new Error("Please enter a valid amount");
      }
      if (contributionAmountNum > remaining) {
        throw new Error(
          `Amount exceeds remaining target of ₦${remaining.toLocaleString()}`
        );
      }
      return SavingsService.contributeToGroup(groupId, contributionAmountNum);
    },
    onSuccess: () => {
      toast.success(
        `₦${parseFloat(amount).toLocaleString()} contributed to ${groupName}!`
      );
      onSuccess?.();
      onClose();
      setAmount(contributionAmount.toString());
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to contribute");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contributeMutation.mutate();
  };

  return (
    <Modal open={open} title={`Contribute to ${groupName}`} onClose={onClose}>
      <div className="max-h-[70vh] overflow-y-auto px-1">
        <form onSubmit={handleSubmit} className="space-y-5 pb-4">
          {/* Group Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Group Savings</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Current Balance</span>
              <span className="font-semibold">
                ₦{currentAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining Target</span>
              <span className="font-semibold text-[var(--color-brand-primary)]">
                ₦{remaining.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contribution Amount (₦)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              min={100}
              max={remaining}
              label="Contribution Amount"
            />
            <p className="text-xs text-gray-500 mt-1">
              Suggested contribution: ₦{contributionAmount.toLocaleString()}
            </p>
          </div>

          {/* Info Note */}
          <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <Wallet size={16} className="text-blue-500 mt-0.5" />
            <p className="text-xs text-blue-600">
              Funds will be deducted from your wallet balance. Contributions
              help the group reach its goal faster.
            </p>
          </div>

          {/* Warning */}
          {parseFloat(amount) > remaining && (
            <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5" />
              <p className="text-xs text-red-600">
                Amount exceeds remaining target of ₦{remaining.toLocaleString()}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                contributeMutation.isPending ||
                !amount ||
                parseFloat(amount) > remaining
              }
              className="flex-1"
            >
              {contributeMutation.isPending ? (
                <Spinner size="sm" />
              ) : (
                "Contribute"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
