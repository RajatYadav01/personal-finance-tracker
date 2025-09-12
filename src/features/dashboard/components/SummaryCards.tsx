import { ArrowUp, ArrowDown, Wallet } from "lucide-react";
import formatCurrency from "../../../utilities/formatCurrency";
import calculatePercentageChange from "../utilities/calculatePercentageChange";

interface SummaryCardsProps {
  balance: number;
  income: number;
  expenses: number;
  previousIncome?: number;
  previousExpenses?: number;
}

export default function SummaryCards({
  balance,
  income,
  expenses,
  previousIncome,
  previousExpenses,
}: SummaryCardsProps) {
  const incomeChange = calculatePercentageChange(income, previousIncome);
  const expenseChange = calculatePercentageChange(expenses, previousExpenses);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total balance</p>
            <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
          </div>
          <Wallet className="text-blue-500" size={20} />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Monthly income</p>
            <p className="text-2xl font-bold">{formatCurrency(income)}</p>
          </div>
          <div
            className={`flex items-center ${
              incomeChange! >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {incomeChange! >= 0 ? (
              <ArrowUp size={20} />
            ) : (
              <ArrowDown size={20} />
            )}
            <span className="text-sm ml-1">
              {Math.abs(incomeChange!).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Monthly expenses</p>
            <p className="text-2xl font-bold">{formatCurrency(expenses)}</p>
          </div>
          <div
            className={`flex items-center ${
              expenseChange! < 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {expenseChange! < 0 ? (
              <ArrowDown size={20} />
            ) : (
              <ArrowUp size={20} />
            )}
            <span className="text-sm ml-1">
              {Math.abs(expenseChange!).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
