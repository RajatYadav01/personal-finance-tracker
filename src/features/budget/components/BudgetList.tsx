import { Wallet } from "lucide-react";
import EmptyState from "../../../components/ui/EmptyState";
import BudgetItem from "./BudgetItem";
import { type Budget } from "../types/budget.types";

interface BudgetListProps {
  budgets: Budget[];
  onView: (budget: Budget) => void;
  isSelectedBudgetSectionOpen: boolean;
  setIsSelectedBudgetSectionOpen: (value: boolean) => void;
}

export const BudgetList = ({
  budgets,
  onView,
  isSelectedBudgetSectionOpen,
  setIsSelectedBudgetSectionOpen,
}: BudgetListProps) => {
  if (budgets.length === 0) {
    return (
      <EmptyState
        title="No budgets created"
        description="Get started by creating your first budget"
        icon={Wallet}
      />
    );
  }

  return (
    <div className="space-y-4">
      {(budgets && Array.isArray(budgets) ? budgets : []).map((budget) => (
        <BudgetItem
          key={budget.id}
          budget={budget}
          onView={onView}
          isSelectedBudgetSectionOpen={isSelectedBudgetSectionOpen}
          setIsSelectedBudgetSectionOpen={setIsSelectedBudgetSectionOpen}
        />
      ))}
    </div>
  );
};
