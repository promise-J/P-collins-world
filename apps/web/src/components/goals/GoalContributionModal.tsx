import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SavingsService } from "@/services/savings.service";
import { Modal, Button, Input, Spinner } from "@/ui";
import { 
  Wallet, 
  AlertCircle, 
  Target, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";

interface GoalContributionModalProps {
  open: boolean;
  goalId: string;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GoalContributionModal({
  open,
  goalId,
  goalName,
  currentAmount,
  targetAmount,
  onClose,
  onSuccess,
}: GoalContributionModalProps) {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");
  
  const remaining = targetAmount - currentAmount;
  const percentage = Math.floor((currentAmount / targetAmount) * 100);
  const newPercentage = Math.floor(((currentAmount + (parseFloat(amount) || 0)) / targetAmount) * 100);

  const contributeMutation = useMutation({
    mutationFn: () => {
      const contributionAmount = parseFloat(amount);
      if (isNaN(contributionAmount) || contributionAmount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      if (contributionAmount < 100) {
        throw new Error("Minimum contribution amount is ₦100");
      }
      if (contributionAmount > remaining) {
        throw new Error(`Amount exceeds remaining target of ₦${remaining.toLocaleString()}`);
      }
      if (contributionAmount > (0 || 0)) {
        throw new Error(`Insufficient wallet balance. You have ₦${(0 || 0).toLocaleString()}`);
      }
      return SavingsService.contributeToPlan(goalId, { amount: contributionAmount });
    },
    onSuccess: (response) => {
      setStep("success");
      toast.success(`₦${parseFloat(amount).toLocaleString()} contributed successfully!`);
      setTimeout(() => {
        setStep("form");
        setAmount("");
        onSuccess?.();
        onClose();
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to contribute");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contributeMutation.mutate();
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const suggestedAmounts = [1000, 5000, 10000, 25000, 50000];

  return (
    <Modal open={open} title={`Contribute to ${goalName}`} onClose={onClose}>
      {step === "form" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Progress */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Current Progress</span>
              <span className="text-sm font-medium">{percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Saved</p>
                <p className="font-semibold text-[var(--color-brand-primary)]">
                  ₦{currentAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Target</p>
                <p className="font-semibold">₦{targetAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* After Contribution Preview */}
          {amount && parseFloat(amount) > 0 && parseFloat(amount) <= remaining && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-2">After Contribution</p>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-600">New Balance</span>
                <span className="font-semibold text-green-700">
                  ₦{(currentAmount + parseFloat(amount)).toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(newPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-green-600 mt-2">
                {newPercentage >= 100 ? "🎉 You'll reach your goal!" : `${newPercentage}% of target achieved`}
              </p>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Amount (₦)
            </label>
            <div className="relative">
              <Wallet size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="pl-10"
                required
                min={100}
                max={remaining}
                label="Contribution Amount"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum: ₦100 | Remaining: ₦{remaining.toLocaleString()}
            </p>
          </div>

          {/* Suggested Amounts */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick Select</p>
            <div className="flex flex-wrap gap-2">
              {suggestedAmounts.map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => handleAmountSelect(suggested)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                    amount === suggested.toString()
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
                      : "border-gray-200 hover:border-[var(--color-brand-primary)] text-gray-600"
                  }`}
                  disabled={suggested > remaining}
                >
                  ₦{suggested.toLocaleString()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(remaining.toString())}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-[var(--color-brand-primary)] transition-all"
              >
                Remaining
              </button>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Wallet Balance</span>
            </div>
            <span className="font-semibold">₦{(0 || 0).toLocaleString()}</span>
          </div>

          {/* Warning for insufficient balance */}
          {amount && parseFloat(amount) > (0 || 0) && (
            <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5" />
              <p className="text-xs text-red-600">
                Insufficient wallet balance. Please fund your wallet to continue.
              </p>
            </div>
          )}

          {/* Warning for exceeding target */}
          {amount && parseFloat(amount) > remaining && (
            <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5" />
              <p className="text-xs text-red-600">
                Amount exceeds remaining target of ₦{remaining.toLocaleString()}
              </p>
            </div>
          )}

          {/* Info Note */}
          <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <TrendingUp size={16} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs text-blue-600 font-medium">About Contributions</p>
              <p className="text-xs text-blue-600 mt-1">
                Contributions help you reach your savings goal faster. 
                All contributions are securely stored and can be tracked in your savings history.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                contributeMutation.isPending || 
                !amount || 
                parseFloat(amount) <= 0 ||
                parseFloat(amount) > remaining ||
                parseFloat(amount) > (0 || 0)
              }
              className="flex-1"
            >
              {contributeMutation.isPending ? <Spinner size="sm" /> : (
                <>
                  Contribute
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {step === "success" && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-brand-text)]">
              Contribution Successful!
            </h3>
            <p className="text-gray-500 mt-1">
              You've contributed ₦{parseFloat(amount).toLocaleString()} to your savings goal.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">New Progress</span>
              <span className="text-sm font-medium">{Math.min(newPercentage, 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(newPercentage, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting back to savings...
          </p>
        </div>
      )}
    </Modal>
  );
}