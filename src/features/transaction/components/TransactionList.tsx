import { type Category } from "../../category/types/category.types";
import TransactionItem from "./TransactionItem";
import { type Transaction } from "../types/transaction.types";

interface TransactionListProps {
  transactions: Transaction[];
  categories?: Category[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const TransactionList = ({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionListProps) => {
  return (
    <div className="mb-4 space-y-2">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 font-medium text-gray-500">
        <div className="col-span-2">Date</div>
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Amount</div>
        {(onEdit || onDelete) && <div className="col-span-2">Actions</div>}
      </div>

      {(transactions && Array.isArray(transactions) ? transactions : []).map(
        (transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            categories={categories}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      )}
    </div>
  );
};
