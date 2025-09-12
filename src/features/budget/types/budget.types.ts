import * as z from "zod";
import type { Transaction } from "../../transaction";

export const budgetFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  monthly_limit: z.number().min(0),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;

export interface Budget {
  id: string;
  name: string;
  description: string | null;
  monthly_limit: number;
  current_spending: number;
  transactions: Transaction[];
  created_at: string;
  updated_at: string;
}
