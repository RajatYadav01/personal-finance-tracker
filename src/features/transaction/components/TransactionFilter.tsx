import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import DatePicker from "../../../components/ui/DatePicker";
import { type Category } from "../../category";
import { filterSchema, type FilterValues } from "../types/transaction.types";

interface TransactionFilterProps {
  categories: Category[];
  budgets: { id: string; name: string }[];
  onSubmit: (values: FilterValues) => void;
  onReset: () => void;
}

export const TransactionFilter = ({
  categories,
  budgets,
  onSubmit,
  onReset,
}: TransactionFilterProps) => {
  const { register, handleSubmit, control, reset } = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      categoryId: undefined,
      type: undefined,
      budgetId: undefined,
      search: "",
    },
  });

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-gray-50 rounded-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date range</label>
          <div className="flex space-x-2">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  placeholderText="Start Date"
                  selectsStart
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  placeholderText="End Date"
                  selectsEnd
                />
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                placeholder="Select a category"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" },
                ]}
                placeholder="Select a type"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Budget</label>
          <Controller
            name="budgetId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={budgets.map((b) => ({ value: b.id, label: b.name }))}
                placeholder="Select a budget"
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            {...register("search")}
            placeholder="Search descriptions..."
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit">Apply filters</Button>
      </div>
    </form>
  );
};
