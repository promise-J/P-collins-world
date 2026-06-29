import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { WalletService } from "@/services/wallet.service";
import { Button, Card, Input, Spinner } from "@/ui";
import { ArrowLeft, Wallet, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";

export default function FundWalletPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const suggestedAmounts = [1000, 2000, 5000, 10000, 25000, 50000];

  const fundMutation = useMutation({
    mutationFn: (amount: number) => WalletService.fundWallet(amount),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Redirecting to payment...");
        window.location.href = response.data.authorizationUrl;
      } else {
        toast.error(response.message || "Failed to initialize funding");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to initialize funding");
    },
  });

  const handleFund = () => {
    const amountValue = selectedAmount || parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 100) {
      toast.error("Minimum funding amount is ₦100");
      return;
    }
    fundMutation.mutate(amountValue);
  };

  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  return (
    <Container>
      <div className="py-8 max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/wallet")}
          className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-brand-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Wallet
        </button>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--color-brand-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet size={32} className="text-[var(--color-brand-primary)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">
              Fund Your Wallet
            </h1>
            <p className="text-gray-500 mt-1">
              Add funds to your wallet securely via Paystack
            </p>
          </div>

          {/* Quick Amounts */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Select</p>
            <div className="grid grid-cols-3 gap-2">
              {suggestedAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handleAmountSelect(value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedAmount === value
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 text-[var(--color-brand-primary)]"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  ₦{value.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Amount (₦)"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="Enter amount"
          />

          <div className="mt-6 space-y-3">
            <Button
              onClick={handleFund}
              disabled={fundMutation.isPending}
              className="w-full"
              size="lg"
            >
              {fundMutation.isPending ? (
                <Spinner size="sm" />
              ) : (
                <>
                  Proceed to Paystack
                </>
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              You will be redirected to Paystack to complete your payment securely
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              🔒 Secured payment via Paystack. Your card details are safe and encrypted.
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
}