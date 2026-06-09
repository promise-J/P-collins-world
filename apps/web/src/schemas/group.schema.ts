import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string(),

  targetAmount: z.number(),

  maturityDate: z.string(),

  contributionAmount: z.number(),
});
