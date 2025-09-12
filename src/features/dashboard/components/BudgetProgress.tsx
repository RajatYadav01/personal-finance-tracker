import ProgressBar from "../../../components/ui/ProgressBar";
import formatCurrency from "../../../utilities/formatCurrency";
import { type Budget } from "../../budget";

interface BudgetProgressProps {
  budgets: Budget[];
}

export default function BudgetProgress({ budgets }: BudgetProgressProps) {
  const activeBudgets = budgets.filter((b) => b.monthly_limit);

  if (activeBudgets.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-medium text-lg mb-2">Budget progress</h2>
        <p className="text-gray-500">No active budgets with spending limits</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="font-medium text-lg mb-4">Budget progress</h2>
      <div className="space-y-4">
        {activeBudgets.map((budget) => {
          const percentage =
            (budget.current_spending / budget.monthly_limit) * 100;

          return (
            <div key={budget.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{budget.name}</span>
                <span>
                  {formatCurrency(budget.current_spending)} /{" "}
                  {formatCurrency(budget.monthly_limit)}
                </span>
              </div>
              <ProgressBar
                value={percentage}
                variant={
                  percentage > 90
                    ? "danger"
                    : percentage > 75
                    ? "warning"
                    : "primary"
                }
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{percentage.toFixed(1)}% used</span>
                <span>
                  {formatCurrency(
                    budget.monthly_limit - budget.current_spending
                  )}{" "}
                  remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
