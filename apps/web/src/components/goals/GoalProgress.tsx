import { motion } from "framer-motion";

interface GoalProgressProps {
  current: number;
  target: number;
  showPercentage?: boolean;
}

export function GoalProgress({ current, target, showPercentage = false }: GoalProgressProps) {
  const percentage = Math.min(Math.floor((current / target) * 100), 100);

  return (
    <div className="w-full">
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-full"
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-xs font-medium text-[var(--color-brand-primary)]">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}