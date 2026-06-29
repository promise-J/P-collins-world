import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WalletService, Transaction } from "@/services/wallet.service";
import { Button, Card, Spinner, Input, Badge, Pagination } from "@/ui";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  Download,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";

export default function WalletPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showBalance, setShowBalance] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [isFunding, setIsFunding] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Fetch wallet data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => WalletService.getWallet(),
  });

  const wallet = data?.data?.wallet || data?.wallet || { balance: 0, pendingBalance: 0 };
  const transactions = data?.data?.transactions || data?.transactions || [];

  const balance = wallet.balance || 0;
  const pendingBalance = wallet.pendingBalance || 0;

  // Fund wallet mutation
  const fundMutation = useMutation({
    mutationFn: (amount: number) => WalletService.fundWallet(amount),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Redirecting to payment...");
        // Redirect to Paystack
        window.location.href = response.data.authorizationUrl;
      } else {
        toast.error(response.message || "Failed to initialize funding");
      }
      setIsFunding(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to initialize funding");
      setIsFunding(false);
    },
  });

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: () => {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      if (amount > balance) {
        throw new Error("Insufficient balance");
      }
      if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountName) {
        throw new Error("Please fill in all bank details");
      }
      return WalletService.withdraw(amount, bankDetails);
    },
    onSuccess: () => {
      toast.success("Withdrawal request submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      setBankDetails({ bankName: "", accountNumber: "", accountName: "" });
      setIsWithdrawing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process withdrawal");
      setIsWithdrawing(false);
    },
  });

  const handleFundWallet = () => {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount < 100) {
      toast.error("Minimum funding amount is ₦100");
      return;
    }
    setIsFunding(true);
    fundMutation.mutate(amount);
  };

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    withdrawMutation.mutate();
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success("Wallet refreshed");
  };

  // Stats cards
  const stats = [
    {
      label: "Available Balance",
      value: `₦${balance.toLocaleString()}`,
      icon: Wallet,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pending Balance",
      value: `₦${pendingBalance.toLocaleString()}`,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Total Transactions",
      value: transactions.length,
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)] flex items-center gap-3">
              <Wallet size={28} className="text-[var(--color-brand-primary)]" />
              Wallet
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your funds and view transaction history
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className="text-gray-500" />
            </button>
            <Button onClick={() => navigate("/wallet/fund")}>
              <Plus size={18} className="mr-2" />
              Fund Wallet
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-[var(--color-brand-text)] mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={stat.color} size={24} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Balance Card */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] text-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-white/80 text-sm">Total Balance</p>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-4xl font-bold">
                  {showBalance ? `₦${(balance + pendingBalance).toLocaleString()}` : "••••••"}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => navigate("/wallet/fund")}
              >
                <Plus size={16} className="mr-2" />
                Fund Wallet
              </Button>
              <Button 
                variant="ghost" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setShowWithdrawModal(true)}
                disabled={balance === 0}
              >
                <ArrowUpRight size={16} className="mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/80 text-sm">Available Balance</p>
              <p className="text-xl font-bold mt-1">
                {showBalance ? `₦${balance.toLocaleString()}` : "••••••"}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/80 text-sm">Pending Balance</p>
              <p className="text-xl font-bold mt-1">
                {showBalance ? `₦${pendingBalance.toLocaleString()}` : "••••••"}
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate("/wallet/fund")}
            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Plus size={20} className="text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Fund Wallet</p>
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={balance === 0}
            className={`p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center ${
              balance === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ArrowUpRight size={20} className="text-orange-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Withdraw</p>
          </button>
          <button
            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Download size={20} className="text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Export</p>
          </button>
          <button
            onClick={handleRefresh}
            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <RefreshCw size={20} className="text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Refresh</p>
          </button>
        </div>

        {/* Transaction History */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)]">
              Transaction History
            </h2>
            <div className="flex gap-2">
              <select className="text-sm border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]">
                <option value="all">All</option>
                <option value="CREDIT">Credits</option>
                <option value="DEBIT">Debits</option>
              </select>
              <select className="text-sm border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]">
                <option value="all">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Fund your wallet to get started
              </p>
              <Button onClick={() => navigate("/wallet/fund")} className="mt-4">
                <Plus size={16} className="mr-2" />
                Fund Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: Transaction) => {
                const isCredit = tx.type === "CREDIT";
                const isSuccess = tx.status === "SUCCESS";
                const isPending = tx.status === "PENDING";
                const isFailed = tx.status === "FAILED";

                return (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        isCredit ? "bg-green-50" : "bg-red-50"
                      }`}>
                        {isCredit ? (
                          <ArrowDownRight size={18} className="text-green-600" />
                        ) : (
                          <ArrowUpRight size={18} className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-brand-text)]">
                          {isCredit ? "Credit" : "Debit"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            {new Date(tx.createdAt).toLocaleTimeString()}
                          </span>
                          {tx.reference && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-400 font-mono">
                                {tx.reference.slice(0, 12)}...
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        isCredit ? "text-green-600" : "text-red-600"
                      }`}>
                        {isCredit ? "+" : "-"} ₦{tx.amount.toLocaleString()}
                      </p>
                      <div className="mt-1">
                        {isSuccess && (
                          <Badge variant="success">Success</Badge>
                        )}
                        {isPending && (
                          <Badge variant="warning">Pending</Badge>
                        )}
                        {isFailed && (
                          <Badge variant="danger">Failed</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Withdraw Modal */}
      <ConfirmationModal
        open={showWithdrawModal}
        title="Withdraw Funds"
        message="Enter the amount and bank details for withdrawal"
        confirmText="Withdraw"
        variant="info"
        loading={isWithdrawing}
        onConfirm={handleWithdraw}
        onCancel={() => {
          setShowWithdrawModal(false);
          setWithdrawAmount("");
          setBankDetails({ bankName: "", accountNumber: "", accountName: "" });
        }}
      >
        <div className="space-y-4 mt-4">
          <Input
            label="Amount (₦)"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <Input
            label="Bank Name"
            value={bankDetails.bankName}
            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
            placeholder="e.g., GTBank, First Bank"
          />
          <Input
            label="Account Number"
            type="number"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
            placeholder="10-digit account number"
          />
          <Input
            label="Account Name"
            value={bankDetails.accountName}
            onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
            placeholder="Account holder's name"
          />
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              ⚠️ Withdrawals are processed within 24-48 hours. Ensure your bank details are correct.
            </p>
          </div>
        </div>
      </ConfirmationModal>
    </Container>
  );
}