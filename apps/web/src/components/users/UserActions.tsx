import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';
import { Button, ConfirmModal } from '@/ui';
import { Shield, Ban, CheckCircle, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserActionsProps {
  userId: string;
  onActionComplete?: () => void;
}

export function UserActions({ userId, onActionComplete }: UserActionsProps) {
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: (reason: string) => AdminService.suspendUser(userId, reason),
    onSuccess: () => {
      toast.success('User suspended successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onActionComplete?.();
      setShowSuspendModal(false);
      setSuspendReason('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to suspend user');
    },
  });

  const activateMutation = useMutation({
    mutationFn: () => AdminService.activateUser(userId),
    onSuccess: () => {
      toast.success('User activated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onActionComplete?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to activate user');
    },
  });

  const verifyAgentMutation = useMutation({
    mutationFn: () => AdminService.verifyAgent(userId),
    onSuccess: () => {
      toast.success('User verified as agent');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onActionComplete?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to verify agent');
    },
  });

  const verifyLandlordMutation = useMutation({
    mutationFn: () => AdminService.verifyLandlord(userId),
    onSuccess: () => {
      toast.success('User verified as landlord');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onActionComplete?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to verify landlord');
    },
  });

  const handleSuspend = () => {
    if (!suspendReason.trim()) {
      toast.error('Please provide a reason for suspension');
      return;
    }
    suspendMutation.mutate(suspendReason);
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowSuspendModal(true)}
          className="p-1.5 rounded hover:bg-gray-100 text-red-500"
          title="Suspend User"
        >
          <Ban size={16} />
        </button>
        <button
          onClick={() => activateMutation.mutate()}
          className="p-1.5 rounded hover:bg-gray-100 text-green-500"
          title="Activate User"
        >
          <CheckCircle size={16} />
        </button>
        <button
          onClick={() => verifyAgentMutation.mutate()}
          className="p-1.5 rounded hover:bg-gray-100 text-blue-500"
          title="Verify as Agent"
        >
          <UserCheck size={16} />
        </button>
        <button
          onClick={() => verifyLandlordMutation.mutate()}
          className="p-1.5 rounded hover:bg-gray-100 text-purple-500"
          title="Verify as Landlord"
        >
          <Shield size={16} />
        </button>
      </div>

      {/* Suspend Modal */}
      <ConfirmModal
        open={showSuspendModal}
        title="Suspend User"
        description="Please provide a reason for suspending this user"
        loading={suspendMutation.isPending}
        onConfirm={handleSuspend}
        onClose={() => {
          setShowSuspendModal(false);
          setSuspendReason('');
        }}
      >
        <textarea
          value={suspendReason}
          onChange={(e) => setSuspendReason(e.target.value)}
          placeholder="Reason for suspension..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] mt-4"
          rows={3}
        />
      </ConfirmModal>
    </>
  );
}