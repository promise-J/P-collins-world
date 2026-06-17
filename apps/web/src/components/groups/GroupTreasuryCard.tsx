import { Card } from "@/ui";
import { Wallet, TrendingUp, Target } from "lucide-react";

interface GroupTreasuryCardProps {
  currentAmount: number;
  targetAmount: number;
  contributionAmount: number;
}

export function GroupTreasuryCard({ currentAmount, targetAmount, contributionAmount }: GroupTreasuryCardProps) {
  const remaining = targetAmount - currentAmount;
  const contributionsNeeded = Math.ceil(remaining / contributionAmount);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
        <Wallet size={20} className="text-[var(--color-brand-primary)]" />
        Treasury Summary
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-gray-500">Total Collected</span>
          <span className="text-xl font-bold text-[var(--color-brand-primary)]">
            ₦{currentAmount.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-gray-500">Target Amount</span>
          <span className="font-semibold">₦{targetAmount.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-gray-500">Remaining</span>
          <span className="font-semibold text-orange-500">₦{remaining.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Contributions Needed</span>
          <span className="font-semibold">{contributionsNeeded} more</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-green-600" />
          <p className="text-sm text-green-700">
            Each member contributes ₦{contributionAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}