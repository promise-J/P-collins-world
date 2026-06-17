import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SavingsService } from "@/services/savings.service";
import { Modal, Button, Input, TextArea, Spinner } from "@/ui";
import {
  Users,
  Target,
  DollarSign,
  Clock,
  AlertCircle,
  Utensils,
  Smartphone,
  Home,
  Briefcase,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const goalCategories = [
  {
    value: "FOOD",
    label: "Food",
    icon: Utensils,
    description: "Save for food items, rice, beans, etc.",
  },
  {
    value: "GADGET",
    label: "Gadget",
    icon: Smartphone,
    description: "Save for phones, laptops, electronics",
  },
  {
    value: "RENT",
    label: "Rent",
    icon: Home,
    description: "Save for rent payments",
  },
  {
    value: "BUSINESS",
    label: "Business",
    icon: Briefcase,
    description: "Save for business capital",
  },
  {
    value: "OTHER",
    label: "Other",
    icon: Tag,
    description: "Other savings goals",
  },
];

export function CreateGroupModal({
  open,
  onClose,
  onSuccess,
}: CreateGroupModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    contributionAmount: "",
    lockPeriodDays: "30",
    goalTitle: "",
    goalDescription: "",
    goalCategory: "FOOD",
    penaltiesEnabled: true,
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const targetAmountNum = parseFloat(formData.targetAmount);
      const contributionAmountNum = parseFloat(formData.contributionAmount);

      if (isNaN(targetAmountNum) || targetAmountNum < 1000) {
        throw new Error("Target amount must be at least ₦1,000");
      }
      if (isNaN(contributionAmountNum) || contributionAmountNum < 100) {
        throw new Error("Contribution amount must be at least ₦100");
      }
      if (contributionAmountNum > targetAmountNum) {
        throw new Error("Contribution amount cannot exceed target amount");
      }

      return SavingsService.createGroup({
        name: formData.name,
        targetAmount: targetAmountNum,
        contributionAmount: contributionAmountNum,
        lockPeriodDays: parseInt(formData.lockPeriodDays),
        goal: {
          title: formData.goalTitle,
          description: formData.goalDescription,
          targetAmount: targetAmountNum,
          category: formData.goalCategory as any,
        },
        penaltiesEnabled: formData.penaltiesEnabled,
      });
    },
    onSuccess: () => {
      toast.success("Savings group created successfully!");
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        name: "",
        targetAmount: "",
        contributionAmount: "",
        lockPeriodDays: "30",
        goalTitle: "",
        goalDescription: "",
        goalCategory: "FOOD",
        penaltiesEnabled: true,
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create group");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  const selectedCategory = goalCategories.find(
    (c) => c.value === formData.goalCategory
  );
  const CategoryIcon = selectedCategory?.icon || Tag;

  return (
    <Modal open={open} title="Create Savings Group" onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 max-h-[70vh] overflow-y-auto px-1 pb-4"
      >
        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name
          </label>
          <div className="relative">
            <Users
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Christmas Rice Fund"
              className="pl-10"
              required
              label="Group Name"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Choose a descriptive name for your savings group
          </p>
        </div>

        {/* Goal Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Savings Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {goalCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = formData.goalCategory === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, goalCategory: category.value })
                  }
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 ring-2 ring-[var(--color-brand-primary)]/20"
                      : "border-gray-200 hover:border-[var(--color-brand-primary)]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      size={16}
                      className={
                        isSelected
                          ? "text-[var(--color-brand-primary)]"
                          : "text-gray-400"
                      }
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected
                          ? "text-[var(--color-brand-primary)]"
                          : "text-gray-700"
                      }`}
                    >
                      {category.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {category.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Goal Title & Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title
          </label>
          <div className="relative">
            <Target
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={formData.goalTitle}
              onChange={(e) =>
                setFormData({ ...formData, goalTitle: e.target.value })
              }
              placeholder="e.g., Buy 50 bags of rice for Christmas"
              className="pl-10"
              required
              label="Goal Title"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal Description (Optional)
          </label>
          <TextArea
            value={formData.goalDescription}
            onChange={(e) =>
              setFormData({ ...formData, goalDescription: e.target.value })
            }
            placeholder="Describe what the group is saving for..."
            rows={2}
            label="Goal description"
          />
        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount (₦)
            </label>
            <div className="relative">
              <DollarSign
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                type="number"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: e.target.value })
                }
                placeholder="e.g., 500000"
                className="pl-10"
                required
                min={1000}
                label="Target Amount"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Per Member (₦)
            </label>
            <div className="relative">
              <DollarSign
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                type="number"
                value={formData.contributionAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contributionAmount: e.target.value,
                  })
                }
                placeholder="e.g., 25000"
                className="pl-10"
                required
                min={100}
                label="Per Member"
              />
            </div>
          </div>
        </div>

        {/* Lock Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lock Period (Days)
          </label>
          <div className="relative">
            <Clock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={formData.lockPeriodDays}
              onChange={(e) =>
                setFormData({ ...formData, lockPeriodDays: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
            >
              <option value="7">7 days (1 week)</option>
              <option value="14">14 days (2 weeks)</option>
              <option value="30">30 days (1 month)</option>
              <option value="60">60 days (2 months)</option>
              <option value="90">90 days (3 months)</option>
              <option value="180">180 days (6 months)</option>
              <option value="365">365 days (1 year)</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Funds will be locked for this period. Early withdrawal incurs
            penalty.
          </p>
        </div>

        {/* Penalties Toggle */}
        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <AlertCircle
              size={20}
              className="text-[var(--color-brand-primary)]"
            />
            <div>
              <p className="font-medium">Enable Penalties</p>
              <p className="text-sm text-gray-500">
                10% penalty for early withdrawal
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.penaltiesEnabled}
            onChange={(e) =>
              setFormData({ ...formData, penaltiesEnabled: e.target.checked })
            }
            className="w-5 h-5 text-[var(--color-brand-primary)] rounded"
          />
        </label>

        {/* Summary Preview */}
        {formData.targetAmount && formData.contributionAmount && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Summary</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Target Amount:</span>
                <span className="font-medium">
                  ₦{parseFloat(formData.targetAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Per Member:</span>
                <span className="font-medium">
                  ₦{parseFloat(formData.contributionAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Members Needed:</span>
                <span className="font-medium">
                  {Math.ceil(
                    parseFloat(formData.targetAmount) /
                      parseFloat(formData.contributionAmount)
                  )}{" "}
                  members
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lock Period:</span>
                <span className="font-medium">
                  {formData.lockPeriodDays} days
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs text-blue-600 font-medium">
              About Group Savings
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Group savings help members save together towards a common goal.
              {formData.penaltiesEnabled
                ? " Breaking early incurs a 10% penalty on your savings."
                : " No penalties for early withdrawal."}
            </p>
          </div>
        </div>

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
            disabled={createMutation.isPending}
            className="flex-1"
          >
            {createMutation.isPending ? <Spinner size="sm" /> : "Create Group"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
