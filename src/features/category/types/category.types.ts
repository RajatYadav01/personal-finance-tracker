import * as z from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  color: z.string(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}
