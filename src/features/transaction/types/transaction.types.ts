import * as z from "zod";

export const transactionFormSchema = z
  .object({
    amount: z
      .number({ error: "Amount must be a number" })
      .positive("Amount must be greater than 0"),
    description: z
      .string({ error: "Description is required" })
      .min(2, "Description must be at least 2 characters"),
    date: z.string({ error: "Date is required" }).min(1, "Date is required"),
    transaction_type: z.enum(["income", "expense"], {
      error: "Transaction type is required",
    }),
    category_id: z.string().optional(),
    budget_id: z.string().optional(),
    recurring: z.boolean().optional(),
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
    start_date: z.string().optional(),
    next_occurrence: z.string().optional(),
    receipt: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recurring) {
      if (!data.frequency) {
        ctx.addIssue({
          code: "custom",
          path: ["frequency"],
          message: "Frequency is required when recurring is checked",
        });
      }

      if (!data.next_occurrence) {
        ctx.addIssue({
          code: "custom",
          path: ["next_occurrence"],
          message: "Next occurrence is required when recurring is checked",
        });
      }
    }
  });

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface RecurringTransaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  start_date: string;
  next_occurrence: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  budget_id: string | null;
  category_id: string | null;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  transaction_type: "income" | "expense";
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  budget_id: string | null;
  category_id: string | null;
  recurring: boolean;
  recurring_transaction_id?: string;
  recurring_transaction?: RecurringTransaction;
}

export const filterSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  categoryId: z.string().optional(),
  type: z.enum(["income", "expense"]).optional(),
  budgetId: z.string().optional(),
  search: z.string().optional(),
});

export type FilterValues = z.infer<typeof filterSchema>;
