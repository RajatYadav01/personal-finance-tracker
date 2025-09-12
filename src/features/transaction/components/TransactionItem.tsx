import { Receipt, Pencil, Trash } from "lucide-react";
import formatCurrency from "../../../utilities/formatCurrency";
import formatDate from "../../../utilities/formatDate";
import CategoryBadge from "../../category/components/CategoryBadge";
import Button from "../../../components/ui/Button";
import { type Category } from "../../category";
import { type Transaction } from "../types/transaction.types";

interface TransactionItemProps {
  transaction: Transaction;
  categories?: Category[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export default function TransactionItem({
  transaction,
  categories,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const amountClass =
    transaction.transaction_type === "income"
      ? "text-green-600"
      : "text-red-600";

  const categoryName =
    categories &&
    categories.find((category) => category.id === transaction.category_id);

  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
      <div className="col-span-2 text-sm">{formatDate(transaction.date)}</div>

      <div className="col-span-4 font-medium">
        {transaction.description}
        {transaction.receipt_url && (
          <a
            href={transaction.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            <Receipt size={16} className="inline" />
          </a>
        )}
      </div>

      <div className="col-span-2">
        {categoryName && <CategoryBadge category={categoryName} size="sm" />}
      </div>

      <div className={`col-span-2 font-medium ${amountClass}`}>
        {formatCurrency(transaction.amount, transaction.currency)}
      </div>

      <div className="col-span-2 flex space-x-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(transaction)}
            aria-label="Edit transaction"
          >
            <Pencil size={16} />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(transaction.id)}
            aria-label="Delete transaction"
          >
            <Trash size={16} className="text-red-500" />
          </Button>
        )}
      </div>
    </div>
  );
}
