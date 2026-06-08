export function BreakSavingsModal({ amount }: { amount: number }) {
  const penalty = amount * 0.1;

  const payout = amount - penalty;

  return (
    <div>
      <h3>Break Savings</h3>

      <p>Savings: ₦{amount}</p>

      <p>Penalty: ₦{penalty}</p>

      <p>Payout: ₦{payout}</p>
    </div>
  );
}
