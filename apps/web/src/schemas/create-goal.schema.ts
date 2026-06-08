import { z } from "zod";

export const createGoalSchema = z.object({
  name: z.string().min(3),

  goalType: z.string(),

  targetAmount: z.number(),

  contributionFrequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),

  maturityDate: z.string(),

  autoDebit: z.boolean(),
});
