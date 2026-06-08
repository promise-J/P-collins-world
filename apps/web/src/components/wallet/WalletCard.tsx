import { Card } from "@/ui";

interface Props {
  balance: number;

  lockedBalance: number;
}

export function WalletCard({
  balance,

  lockedBalance,
}: Props) {
  return (
    <Card>
      <div
        className="
      space-y-4
     "
      >
        <div>
          <p>Available Balance</p>

          <h2
            className="
        text-3xl
        font-bold
       "
          >
            ₦{balance.toLocaleString()}
          </h2>
        </div>

        <div>
          <p>Locked Savings</p>

          <h3>₦{lockedBalance.toLocaleString()}</h3>
        </div>
      </div>
    </Card>
  );
}
