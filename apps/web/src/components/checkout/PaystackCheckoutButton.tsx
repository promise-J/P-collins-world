import { PaystackButton } from "react-paystack";

export function PaystackCheckoutButton({
  amount,

  email,
}: any) {
  return (
    <PaystackButton
      publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}
      amount={amount * 100}
      email={email}
      text="Pay With Paystack"
    />
  );
}
