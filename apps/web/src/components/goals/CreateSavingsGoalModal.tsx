import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SavingsService } from "@/services/savings.service";
import { Modal, Button, Input, Spinner } from "@/ui";
import { Target, Calendar, Wallet, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface CreateSavingsGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateSavingsGoalModal({ open, onClose, onSuccess }: CreateSavingsGoalModalProps) {
  const [formData, setFormData] = useState({
    targetAmount: "",
    frequency: "MONTHLY",
    autoDebit: false,
    startDate: "",
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const targetAmountNum = parseFloat(formData.targetAmount);
      if (isNaN(targetAmountNum) || targetAmountNum < 1000) {
        throw new Error("Target amount must be at least ₦1,000");
      }
      return SavingsService.createPlan({
        targetAmount: targetAmountNum,
        frequency: formData.frequency as any,
        autoDebit: formData.autoDebit,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      });
    },
    onSuccess: () => {
      toast.success("Savings goal created successfully!");
      onSuccess?.();
      onClose();
      setFormData({
        targetAmount: "",
        frequency: "MONTHLY",
        autoDebit: false,
        startDate: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create savings goal");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <Modal open={open} title="Create Savings Goal" onClose={onClose}>
      <div className="max-h-[70vh] overflow-y-auto px-1">
        <form onSubmit={handleSubmit} className="space-y-5 pb-4">
          {/* Target Amount */}
          <div>
            <Input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              placeholder="e.g., 500000"
              required
              min={1000}
              label="Target Amount"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum target: ₦1,000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Savings Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date (Optional)
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              />
            </div>
          </div>

          {/* Auto Debit */}
          <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Wallet size={20} className="text-[var(--color-brand-primary)]" />
              <div>
                <p className="font-medium">Auto-Debit</p>
                <p className="text-sm text-gray-500">Automatically deduct savings from wallet</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.autoDebit}
              onChange={(e) => setFormData({ ...formData, autoDebit: e.target.checked })}
              className="w-5 h-5 text-[var(--color-brand-primary)] rounded"
            />
          </label>

          {/* Info Note */}
          <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-blue-500 mt-0.5" />
            <p className="text-xs text-blue-600">
              Personal savings have no penalties for breaking. You can withdraw anytime with 10% penalty on interest.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="flex-1">
              {createMutation.isPending ? <Spinner size="sm" /> : "Create Goal"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}