import { Button } from "@/ui";

export function WalletCheckoutButton({ total }: { total: number }) {
  const checkout = () => {
    console.log("Wallet Payment");
  };

  return (
    <Button onClick={checkout}>
      Pay ₦{total}
      From Wallet
    </Button>
  );
}
