import { Card } from "@/ui";
// import { Card, Progress } from "@/ui";

export function SavingsGoalCard({ goal }: any) {
  const percentage = Math.floor((goal.currentAmount / goal.targetAmount) * 100);

  return (
    <Card>
      <h3>{goal.name}</h3>

      <p>{goal.goalType}</p>

      {/* <Progress value={percentage} /> */}

      <p>
        ₦{goal.currentAmount.toLocaleString()}/ ₦
        {goal.targetAmount.toLocaleString()}
      </p>
    </Card>
  );
}
