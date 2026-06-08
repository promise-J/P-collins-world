import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createGoalSchema } from "@/schemas/create-goal.schema";

export function CreateSavingsGoalModal() {
  const form = useForm({
    resolver: zodResolver(createGoalSchema),
  });

  return <div>Create Goal Modal</div>;
}
