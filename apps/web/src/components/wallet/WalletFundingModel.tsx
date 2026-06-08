import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Button, FormInput } from '@/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { WalletService } from '@/services/wallet.service';

const fundingSchema = z.object({
  amount: z.number()
    .min(100, 'Minimum funding amount is ₦100')
    .max(10000000, 'Maximum funding amount is ₦10,000,000'),
});

type FundingFormData = z.infer<typeof fundingSchema>;

interface WalletFundingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WalletFundingModal({ open, onClose, onSuccess }: WalletFundingModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const queryClient = useQueryClient();
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FundingFormData>({
    resolver: zodResolver(fundingSchema),
    defaultValues: { amount: 1000 },
  });

  const fundingMutation = useMutation({
    mutationFn: (amount: number) => WalletService.initializeFunding(amount),
    onSuccess: (response) => {
      const { authorizationUrl, reference } = response.data;
      
      // Store reference for verification
      sessionStorage.setItem('pendingFundingReference', reference);
      
      // Redirect to Paystack
      if (authorizationUrl) {
        setIsRedirecting(true);
        window.location.href = authorizationUrl;
      }
      
      toast.success('Redirecting to payment page...');
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to initialize funding');
    },
  });

  const onSubmit = (data: FundingFormData) => {
    fundingMutation.mutate(data.amount);
  };

  return (
    <Modal open={open} title="Fund Wallet" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center mb-4">
          <p className="text-gray-500 text-sm">
            Enter the amount you want to add to your wallet
          </p>
        </div>

        <FormInput
          control={control}
          name="amount"
          label="Amount (₦)"
          type="number"
          placeholder="Enter amount"
        />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={fundingMutation.isPending || isRedirecting}
            className="flex-1"
          >
            {isRedirecting ? 'Redirecting...' : 'Proceed to Pay'}
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          You will be redirected to Paystack to complete your payment securely
        </p>
      </form>
    </Modal>
  );
}