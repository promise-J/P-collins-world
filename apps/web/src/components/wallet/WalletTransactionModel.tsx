import { useQuery } from '@tanstack/react-query';
import { Modal, Spinner, Badge } from '@/ui';
import { CreditCard, ArrowUpRight, ArrowDownRight, Calendar, FileText } from 'lucide-react';
import { WalletService } from '@/services/wallet.service';

interface WalletTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

export function WalletTransactionModal({ open, onClose }: WalletTransactionModalProps) {
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => WalletService.getTransactions({ limit: 50, page: 1 }),
    enabled: open,
  });

  const transactions = transactionsData?.data || [];

  const getTransactionIcon = (type: string) => {
    if (type === 'CREDIT') {
      return <ArrowDownRight size={18} className="text-green-500" />;
    }
    return <ArrowUpRight size={18} className="text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="success">Success</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <Modal open={open} title="Transaction History" onClose={onClose}>
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          transactions.map((tx: any) => (
            <div
              key={tx._id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="font-medium text-[var(--color-brand-text)]">
                    {tx.type === 'CREDIT' ? 'Credit' : 'Debit'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Calendar size={12} />
                    <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{new Date(tx.createdAt).toLocaleTimeString()}</span>
                  </div>
                  {tx.reference && (
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      Ref: {tx.reference.slice(0, 12)}...
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'CREDIT' ? '+' : '-'} ₦{tx.amount.toLocaleString()}
                </p>
                <div className="mt-1">{getStatusBadge(tx.status)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}