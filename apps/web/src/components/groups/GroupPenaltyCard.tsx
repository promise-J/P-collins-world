import { Card } from "@/ui";
import { AlertTriangle, Shield, Percent } from "lucide-react";

interface GroupPenaltyCardProps {
  penaltiesEnabled: boolean;
  penaltyPercentage?: number;
}

export function GroupPenaltyCard({ penaltiesEnabled, penaltyPercentage = 10 }: GroupPenaltyCardProps) {
  if (!penaltiesEnabled) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-800">No Penalties</h3>
            <p className="text-sm text-green-700 mt-1">
              This group has penalties disabled. You can break early without any fees.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-yellow-50 border-yellow-200">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-yellow-800">Penalty Warning</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Breaking this group before the lock period ends will incur a {penaltyPercentage}% penalty on your savings.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Percent size={14} className="text-yellow-600" />
            <span className="text-xs text-yellow-700">
              {penaltyPercentage}% penalty applies to early withdrawal
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}