import { ChevronDown, ChevronUp } from "lucide-react";
import ProgressBar from "../../../components/ui/ProgressBar";
import Button from "../../../components/ui/Button";
import formatCurrency from "../../../utilities/formatCurrency";
import { type Budget } from "../types/budget.types";

interface BudgetItemProps {
  budget: Budget;
  onView: (budget: Budget) => void;
  isSelectedBudgetSectionOpen: boolean;
  setIsSelectedBudgetSectionOpen: (value: boolean) => void;
}

export default function BudgetItem({
  budget,
  onView,
  isSelectedBudgetSectionOpen,
  setIsSelectedBudgetSectionOpen,
}: BudgetItemProps) {
  const spendingPercentage = budget.monthly_limit
    ? (budget.current_spending / budget.monthly_limit) * 100
    : 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{budget.name}</h3>
          <p className="text-gray-600">{budget.description}</p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsSelectedBudgetSectionOpen(!isSelectedBudgetSectionOpen);
              onView(budget);
            }}
            aria-label="View budget"
          >
            {isSelectedBudgetSectionOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </Button>
        </div>
      </div>

      {budget.monthly_limit && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent: {formatCurrency(budget.current_spending)}</span>
            <span>Limit: {formatCurrency(budget.monthly_limit)}</span>
          </div>
          <ProgressBar
            value={spendingPercentage}
            variant={
              spendingPercentage > 90
                ? "danger"
                : spendingPercentage > 75
                ? "warning"
                : "primary"
            }
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{spendingPercentage.toFixed(1)}% used</span>
            <span>
              {formatCurrency(budget.monthly_limit - budget.current_spending)}{" "}
              remaining
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
