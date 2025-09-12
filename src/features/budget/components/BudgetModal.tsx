import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import {
  budgetFormSchema,
  type BudgetFormData,
  type Budget,
} from "../types/budget.types";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBudget: (data: BudgetFormData) => void;
  initialData?: Budget | null;
}

export const BudgetModal = ({
  isOpen,
  onClose,
  onSubmitBudget,
  initialData,
}: BudgetModalProps) => {
  const defaultValues: BudgetFormData | undefined = initialData
    ? {
        name: initialData.name,
        description: initialData.description || "",
        monthly_limit: initialData.monthly_limit,
      }
    : undefined;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        monthly_limit: initialData.monthly_limit,
      });
    } else {
      reset({});
    }
  }, [isOpen, initialData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? "Edit budget" : "Create budget"}
    >
      <form onSubmit={handleSubmit(onSubmitBudget)} className="space-y-4">
        <Input
          label="Budget Name"
          {...register("name")}
          error={errors.name?.message}
          required
        />

        <Textarea
          label="Description"
          {...register("description")}
          error={errors.description?.message}
        />

        <Input
          label="Monthly Limit"
          type="number"
          step="0.01"
          {...register("monthly_limit", { valueAsNumber: true })}
          error={errors.monthly_limit?.message}
          required
        />

        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
};
