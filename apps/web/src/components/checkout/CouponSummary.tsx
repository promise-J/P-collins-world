interface Props {
  subtotal: number;

  discount: number;
}

export function CouponSummary({
  subtotal,

  discount,
}: Props) {
  const amount = (subtotal * discount) / 100;

  return (
    <div>
      <p>Discount</p>

      <p>
        -₦
        {amount.toLocaleString()}
      </p>
    </div>
  );
}
