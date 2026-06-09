interface Props {
  state: string;
}

export function ShippingCalculator({ state }: Props) {
  const feeMap = {
    Lagos: 2500,
    Abuja: 3500,
    Rivers: 4000,
  };

  const fee = feeMap[state as keyof typeof feeMap] || 5000;

  return <div>Shipping: ₦{fee.toLocaleString()}</div>;
}
