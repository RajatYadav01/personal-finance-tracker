import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Receipt } from "lucide-react";
import { Fragment, useState } from "react";
import EmptyState from "../../../components/ui/EmptyState";
import Button from "../../../components/ui/Button";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import Modal from "../../../components/ui/Modal";
import { useAuthContext } from "../../authentication";
import { getBudgets, type Budget } from "../../budget";
import { getCategories } from "../../category";
import { TransactionList } from "../components/TransactionList";
import { TransactionFilter } from "../components/TransactionFilter";
import { TransactionModal } from "../components/TransactionModal";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/Transaction";
import {
  type TransactionFormData,
  type Transaction,
} from "../types/transaction.types";

export const TransactionPage = () => {
  const { loginStatusState } = useAuthContext();
  const isUserAuthenticated = !!loginStatusState.userID;
  const queryClient = useQueryClient();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [confirmDeleteTransaction, setConfirmDeleteTransaction] = useState<
    string | null
  >(null);

  const { data: budgets = [] } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(),
    enabled: isUserAuthenticated,
  });

  const { data: categories = [], refetch: regetCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: isUserAuthenticated,
  });

  const {
    data: transactions = [],
    isLoading: areTransactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => getTransactions(filters),
    enabled: isUserAuthenticated,
  });

  const { mutate: createMutationTransaction } = useMutation({
    mutationFn: (data: FormData) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsTransactionModalOpen(false);
    },
  });

  const { mutate: updateMutationTransaction } = useMutation({
    mutationFn: (data: { id: string; transaction: FormData }) =>
      updateTransaction(data.id, data.transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsTransactionModalOpen(false);
    },
  });

  const { mutate: deleteMutationTransaction } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const handleSubmit = async (
    data: TransactionFormData,
    selectedCategoryId: string | null,
    receiptFile: File | null
  ): Promise<void> => {
    const formData = new FormData();
    if (!data.recurring) {
      delete data.frequency;
      delete data.start_date;
      delete data.next_occurrence;
    }
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(`transaction[${key}]`, String(value));
      } else {
        formData.append(`transaction[${key}]`, "");
      }
    });
    if (selectedCategoryId !== null) {
      formData.set("transaction[category_id]", String(selectedCategoryId));
    } else {
      formData.set("transaction[category_id]", "");
    }
    if (loginStatusState.userDefaultCurrency) {
      formData.append(
        "transaction[currency]",
        loginStatusState.userDefaultCurrency
      );
    }
    if (receiptFile) {
      formData.append("transaction[receipt]", receiptFile);
    }

    if (editingTransaction) {
      updateMutationTransaction({
        id: editingTransaction.id,
        transaction: formData,
      });
    } else {
      createMutationTransaction(formData);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteTransaction(id);
  };

  return (
    <Fragment>
      <div className="space-y-6">
        <div className="flex flex-col justify-between items-center">
          <h1 className="mt-2 mb-4 w-full text-center text-2xl font-lato font-[500]">
            Track all your transactions
          </h1>
          <Button
            onClick={() => {
              setEditingTransaction(null);
              setIsTransactionModalOpen(true);
            }}
          >
            Add transaction
          </Button>
        </div>
        {areTransactionsLoading ? (
          <LoadingSpinner />
        ) : transactionsError ? (
          <ErrorMessage message="Failed to load transactions" />
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Add your first transaction to get started"
            icon={Receipt}
          />
        ) : (
          <Fragment>
            <TransactionFilter
              categories={categories}
              budgets={budgets.map((b: Budget) => ({
                id: b.id,
                name: b.name,
              }))}
              onSubmit={setFilters}
              onReset={() => setFilters({})}
            />

            <TransactionList
              transactions={transactions}
              categories={categories}
              onEdit={(transaction) => {
                setEditingTransaction(transaction);
                setIsTransactionModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          </Fragment>
        )}
        {isTransactionModalOpen && (
          <TransactionModal
            isOpen={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={editingTransaction || undefined}
            categories={categories}
            regetCategories={regetCategories}
            budgets={(budgets && Array.isArray(budgets) ? budgets : []).map(
              (b) => ({
                id: b.id,
                name: b.name,
              })
            )}
          />
        )}
        {confirmDeleteTransaction && (
          <Modal
            isOpen={true}
            onClose={() => setConfirmDeleteTransaction(null)}
            title="Delete transaction"
          >
            <div className="space-y-4">
              <p>
                Are you sure you want to delete this transaction? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDeleteTransaction(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    deleteMutationTransaction(confirmDeleteTransaction);
                    setConfirmDeleteTransaction(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Fragment>
  );
};
