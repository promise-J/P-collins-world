interface Props {
  code: string;

  reward: number;
}

export function ReferralCard({
  code,

  reward,
}: Props) {
  return (
    <div>
      <p>Referral Code</p>

      <h3>{code}</h3>

      <p>Earned ₦{reward}</p>
    </div>
  );
}
