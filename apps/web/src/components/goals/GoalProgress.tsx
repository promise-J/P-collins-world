export function GoalProgress({
  current,

  target,
}: {
  current: number;

  target: number;
}) {
  const percent = Math.round((current / target) * 100);

  return (
    <div>
      <div>{percent}%</div>
    </div>
  );
}
