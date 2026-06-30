import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { SavingsService } from "@/services/savings.service";
import { WalletService } from "@/services/wallet.service";
import { Modal, Button, Input, Spinner } from "@/ui";
import { 
  Wallet, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Building2
} from "lucide-react";
import toast from "react-hot-toast";
import { PaystackService } from "@/services/paystack.service";

interface GoalContributionModalProps {
  open: boolean;
  goalId: string;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  onClose: () => void;
  onSuccess?: () => void;
}

type PaymentMethod = "wallet" | "card";

export function GoalContributionModal({
  open,
  goalId,
  goalName,
  currentAmount,
  targetAmount,
  onClose,
  onSuccess,
}: GoalContributionModalProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Fetch wallet balance using React Query
  const { data: walletData, isLoading: isWalletLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => WalletService.getWallet(),
    enabled: open,
  });

  const walletBalance = walletData?.data?.wallet?.balance || 0;
  
  const remaining = targetAmount - currentAmount;
  const percentage = Math.floor((currentAmount / targetAmount) * 100);
  const newPercentage = Math.floor(((currentAmount + (parseFloat(amount) || 0)) / targetAmount) * 100);

  // Mutation for wallet contribution
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
      if (paymentMethod === "wallet" && contributionAmount > walletBalance) {
        throw new Error(`Insufficient wallet balance. You have ₦${walletBalance.toLocaleString()}`);
      }
      return SavingsService.contributeToPlan(goalId, { amount: contributionAmount });
    },
    onSuccess: (response) => {
      setStep("success");
      toast.success(`₦${parseFloat(amount).toLocaleString()} contributed successfully!`);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      
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

  // Mutation for card payment (Paystack)
  const cardPaymentMutation = useMutation({
    mutationFn: (amount: number) => {
      // Use the unified initializePayment method
      return PaystackService.initializePayment({
        amount,
        goalId: goalId,
        goalType: 'individual',
        goalName: goalName,
        purpose: 'savings_contribution',
      });
    },
    onSuccess: (response) => {
      const { authorization_url, reference } = response.data;
      
      // Store reference for verification
      sessionStorage.setItem('pendingFundingReference', reference);
      sessionStorage.setItem('pendingGoalContribution', JSON.stringify({
        goalId,
        amount: parseFloat(amount),
        goalName,
        goalType: 'individual',
      }));
      
      // Redirect to Paystack
      if (authorization_url) {
        setIsRedirecting(true);
        window.location.href = authorization_url;
      }
      
      toast.success('Redirecting to payment page...');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contributionAmount = parseFloat(amount);
    
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (contributionAmount < 100) {
      toast.error("Minimum contribution amount is ₦100");
      return;
    }
    
    if (contributionAmount > remaining) {
      toast.error(`Amount exceeds remaining target of ₦${remaining.toLocaleString()}`);
      return;
    }

    if (paymentMethod === "wallet") {
      // Use wallet balance
      if (contributionAmount > walletBalance) {
        toast.error(`Insufficient wallet balance. You have ₦${walletBalance.toLocaleString()}`);
        return;
      }
      contributeMutation.mutate();
    } else {
      // Use card payment
      cardPaymentMutation.mutate(contributionAmount);
    }
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const suggestedAmounts = [1000, 5000, 10000, 25000, 50000];

  // Check if amount is valid for each payment method
  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= remaining;
  const isWalletSufficient = paymentMethod === "wallet" ? parseFloat(amount) <= walletBalance : true;

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

          {/* Payment Method Selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("wallet")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  paymentMethod === "wallet"
                    ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Building2 size={20} className={paymentMethod === "wallet" ? "text-[var(--color-brand-primary)]" : "text-gray-400"} />
                  <span className={`text-sm font-medium ${paymentMethod === "wallet" ? "text-[var(--color-brand-primary)]" : "text-gray-600"}`}>
                    Wallet Balance
                  </span>
                  <span className="text-xs text-gray-500">
                    {isWalletLoading ? 'Loading...' : `₦${walletBalance.toLocaleString()} available`}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <CreditCard size={20} className={paymentMethod === "card" ? "text-[var(--color-brand-primary)]" : "text-gray-400"} />
                  <span className={`text-sm font-medium ${paymentMethod === "card" ? "text-[var(--color-brand-primary)]" : "text-gray-600"}`}>
                    Card Payment
                  </span>
                  <span className="text-xs text-gray-500">
                    Pay with Paystack
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Wallet Balance Display */}
          {paymentMethod === "wallet" && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Wallet Balance</span>
              </div>
              <span className="font-semibold">
                {isWalletLoading ? <Spinner size="sm" /> : `₦${walletBalance.toLocaleString()}`}
              </span>
            </div>
          )}

          {/* Card Payment Info */}
          {paymentMethod === "card" && (
            <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <CreditCard size={16} className="text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Card Payment</p>
                <p className="text-xs text-blue-600 mt-1">
                  You'll be redirected to Paystack to complete your payment securely.
                  After successful payment, the funds will be added to your wallet and automatically contributed to this goal.
                </p>
              </div>
            </div>
          )}

          {/* Warning for insufficient balance */}
          {paymentMethod === "wallet" && amount && parseFloat(amount) > walletBalance && (
            <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5" />
              <p className="text-xs text-red-600">
                Insufficient wallet balance. Please fund your wallet or choose card payment.
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
                cardPaymentMutation.isPending ||
                isRedirecting ||
                isWalletLoading ||
                !amount || 
                parseFloat(amount) <= 0 ||
                parseFloat(amount) > remaining ||
                (paymentMethod === "wallet" && parseFloat(amount) > walletBalance)
              }
              className="flex-1"
            >
              {contributeMutation.isPending || cardPaymentMutation.isPending || isRedirecting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  {paymentMethod === "wallet" ? "Contribute" : "Pay with Card"}
                </>
              )}
            </Button>
          </div>

          {paymentMethod === "card" && (
            <p className="text-xs text-gray-400 text-center">
              You will be redirected to Paystack to complete your payment securely
            </p>
          )}
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
            {paymentMethod === "card" && (
              <p className="text-xs text-gray-400 mt-1">
                Payment was processed via Paystack
              </p>
            )}
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