import { Link } from "react-router";
import { ArrowDown, ArrowUp } from "lucide-react";
import formatCurrency from "../../../utilities/formatCurrency";
import formatDate from "../../../utilities/formatDate";
import { type Category } from "../../category";
import { type Transaction } from "../../transaction";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function RecentTransactions({
  transactions,
  categories,
}: RecentTransactionsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg">Recent transactions</h2>
        <Link
          to="/dashboard/transactions"
          className="text-sm text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent transactions</p>
      ) : (
        <div className="space-y-3">
          {(transactions && Array.isArray(transactions)
            ? transactions
            : []
          ).map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    transaction.transaction_type === "income"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.transaction_type === "income" ? (
                    <ArrowDown className="rotate-180" size={16} />
                  ) : (
                    <ArrowUp className="rotate-180" size={16} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)} •{" "}
                    {categories.find(
                      (category) => category.id === transaction.category_id
                    )?.name || "Uncategorized"}
                  </p>
                </div>
              </div>
              <p
                className={`font-medium ${
                  transaction.transaction_type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.transaction_type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
