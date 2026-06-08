import { useQuery } from '@tanstack/react-query';
import { Card, Spinner } from '@/ui';
import { Wallet, TrendingUp, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { WalletService } from '@/services/wallet.service';

interface WalletBalanceProps {
  showActions?: boolean;
  onFundClick?: () => void;
  onWithdrawClick?: () => void;
}

export function WalletBalance({ showActions = true, onFundClick, onWithdrawClick }: WalletBalanceProps) {
  const [showBalance, setShowBalance] = useState(true);
  
  const { data: walletData, isLoading, error } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => WalletService.getWallet(),
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error || !walletData) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Failed to load wallet balance</p>
      </Card>
    );
  }

  const wallet = walletData.wallet || walletData;
  const balance = wallet.balance || 0;
  const pendingBalance = wallet.pendingBalance || 0;

  return (
    <Card className="p-6 bg-gradient-to-r from-[var(--color-brand-text)] to-[var(--color-brand-navy-light)] text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet size={24} />
          <span className="font-semibold">Wallet Balance</span>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="mb-6">
        <p className="text-sm opacity-80 mb-1">Available Balance</p>
        <h2 className="text-4xl font-bold">
          {showBalance ? `₦${balance.toLocaleString()}` : '••••••'}
        </h2>
      </div>

      {pendingBalance > 0 && (
        <div className="mb-4 p-3 bg-white/10 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Lock size={14} />
              Pending Balance
            </span>
            <span>{showBalance ? `₦${pendingBalance.toLocaleString()}` : '••••••'}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} />
            <span className="text-sm">Total Saved</span>
          </div>
          <p className="font-semibold">
            {showBalance ? `₦${(balance + pendingBalance).toLocaleString()}` : '••••••'}
          </p>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={onFundClick}
            className="flex-1 bg-white text-[var(--color-brand-text)] py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Fund Wallet
          </button>
          <button
            onClick={onWithdrawClick}
            className="flex-1 bg-white/20 text-white py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
            disabled={balance === 0}
          >
            Withdraw
          </button>
        </div>
      )}
    </Card>
  );
}