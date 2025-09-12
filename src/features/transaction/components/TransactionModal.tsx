import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { BudgetModal, createBudget, type BudgetFormData } from "../../budget";
import ReceiptUpload from "./ReceiptUpload";
import {
  CategoryModal,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "../../category";
import {
  transactionFormSchema,
  type TransactionFormData,
  type Transaction,
} from "../types/transaction.types";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: TransactionFormData,
    selectedCategoryId: string | null,
    receiptFile: File | null
  ) => Promise<void>;
  initialData?: Transaction;
  categories: Category[];
  regetCategories: () => void;
  budgets: { id: string; name: string }[];
}

export const TransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  regetCategories,
  budgets,
}: TransactionModalProps) => {
  const defaultValues: TransactionFormData | undefined = initialData
    ? {
        amount: initialData.amount,
        description: initialData.description,
        date: initialData.date,
        transaction_type: initialData.transaction_type,
        category_id: initialData.category_id || "",
        budget_id: initialData.budget_id || "",
        recurring: initialData.recurring ?? false,
        receipt: initialData.receipt_url || "",
      }
    : undefined;
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialData?.category_id || null
  );
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isBudgetCreateModalOpen, setIsBudgetCreateModalOpen] = useState(false);

  const { mutate: createCategoryMutation } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriesData"] });
      regetCategories();
    },
  });

  const { mutate: updateCategoryMutation } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriesData"] });
      regetCategories();
    },
  });

  const { mutate: deleteCategoryMutation } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriesData"] });
      regetCategories();
    },
  });

  const { mutate: createMutationBudget } = useMutation({
    mutationFn: (data: BudgetFormData) => {
      return createBudget(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setIsBudgetCreateModalOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  });

  const isRecurring = watch("recurring", false);

  useEffect(() => {
    if (initialData) {
      setSelectedCategoryId(initialData.category_id || null);
      reset({
        amount: initialData.amount,
        description: initialData.description,
        date: initialData.date,
        transaction_type: initialData.transaction_type,
        category_id: initialData.category_id || "",
        budget_id: initialData.budget_id || "",
        recurring: initialData.recurring ?? false,
        frequency: initialData.recurring
          ? initialData.recurring_transaction?.frequency
          : undefined,
        next_occurrence: initialData.recurring
          ? initialData.recurring_transaction?.next_occurrence
          : undefined,
        start_date: initialData.recurring
          ? initialData.recurring_transaction?.start_date
          : undefined,
        receipt: initialData.receipt_url || "",
      });
    } else {
      setSelectedCategoryId(null);
      reset({});
    }
  }, [initialData, reset]);

  const formSubmit = async (data: TransactionFormData) => {
    await onSubmit(data, selectedCategoryId, receiptFile);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? "Edit transaction" : "Add new transaction"}
    >
      <form onSubmit={handleSubmit(formSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Type</label>
          <select
            {...register("transaction_type")}
            className="border p-2 w-full"
          >
            <option value="">Select type of transaction</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {errors.transaction_type && (
            <p className="text-red-500 text-sm">
              {errors.transaction_type.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register("amount", { valueAsNumber: true })}
            className="border p-2 w-full"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <input
            type="text"
            {...register("description")}
            className="border p-2 w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            {...register("date")}
            className="border p-2 w-full"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Category</label>
            <Button
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Add new category
            </Button>
          </div>

          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`relative group border rounded-lg px-2 py-4 transition cursor-pointer shadow-sm hover:shadow-md h-24 overflow-hidden
        ${
          selectedCategoryId === category.id
            ? "border-blue-500 bg-blue-100"
            : "border-gray-200 bg-white"
        }`}
                onClick={() =>
                  setSelectedCategoryId((prevId) =>
                    prevId === category.id ? null : category.id
                  )
                }
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-left text-sm font-medium text-gray-800 break-words leading-snug max-w-[120px]"
                        style={{ color: category.color }}
                      >
                        {category.name}
                      </span>
                    </div>
                    {selectedCategoryId === category.id && (
                      <span className="text-blue-600 font-bold">✓</span>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCategoryModalOpen(true);
                        setSelectedCategory(category);
                      }}
                      className="text-gray-500 hover:text-blue-600"
                      title="Edit category"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategoryMutation(category.id);
                      }}
                      className="text-gray-500 hover:text-red-600"
                      title="Delete category"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Budget</label>
            <Button
              onClick={() => setIsBudgetCreateModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Add new budget
            </Button>
          </div>
          <select
            {...register("budget_id", {
              setValueAs: (v) => (v === "" ? undefined : String(v)),
            })}
            className="mt-2 border p-2 w-full"
          >
            <option value="">Select budget</option>
            {budgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.name}
              </option>
            ))}
          </select>
          {errors.budget_id && (
            <p className="text-red-500 text-sm">{errors.budget_id.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("recurring")}
            className="h-4 w-4"
            id="recurring"
          />
          <label htmlFor="recurring">Recurring</label>
        </div>

        {isRecurring && (
          <>
            <div>
              <label className="block mb-1">Frequency</label>
              <select {...register("frequency")} className="border p-2 w-full">
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors.frequency && (
                <p className="text-red-500 text-sm">
                  {errors.frequency.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                {...register("start_date")}
                className="border p-2 w-full"
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Next Occurrence</label>
              <input
                type="date"
                {...register("next_occurrence")}
                className="border p-2 w-full"
              />
              {errors.next_occurrence && (
                <p className="text-red-500 text-sm">
                  {errors.next_occurrence.message}
                </p>
              )}
            </div>
          </>
        )}

        <ReceiptUpload
          currentReceipt={initialData?.receipt_url}
          onFileChange={setReceiptFile}
        />

        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>

      {isCategoryModalOpen && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setSelectedCategory(null);
          }}
          onSubmitCategory={(data) => {
            if (selectedCategory) {
              updateCategoryMutation({ id: selectedCategory.id, data });
            } else {
              createCategoryMutation(data);
            }
            setSelectedCategory(null);
            setIsCategoryModalOpen(false);
          }}
          initialData={selectedCategory}
        />
      )}

      {isBudgetCreateModalOpen && (
        <BudgetModal
          isOpen={isBudgetCreateModalOpen}
          onClose={() => setIsBudgetCreateModalOpen(false)}
          onSubmitBudget={(data) => createMutationBudget(data)}
        />
      )}
    </Modal>
  );
};
