interface Props {
  remaining: number;
}

export function LowStockAlert({ remaining }: Props) {
  return (
    <div className="bg-orange-50 border border-orange-200 text-orange-700 p-3 rounded-lg">
      <p className="text-sm font-medium">
        ⚠️ Only {remaining} left in stock - order soon!
      </p>
    </div>
  );
}