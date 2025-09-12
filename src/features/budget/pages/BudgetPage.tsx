import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { Fragment, useState } from "react";
import Button from "../../../components/ui/Button";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import Modal from "../../../components/ui/Modal";
import { useAuthContext } from "../../authentication";
import { getCategories } from "../../category";
import { TransactionList } from "../../transaction";
import { BudgetList } from "../components/BudgetList";
import { BudgetModal } from "../components/BudgetModal";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../services/Budget";
import { type BudgetFormData, type Budget } from "../types/budget.types";

export const BudgetPage = () => {
  const { loginStatusState } = useAuthContext();
  const isUserAuthenticated = !!loginStatusState.userID;
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSelectedBudgetSectionOpen, setIsSelectedBudgetSectionOpen] =
    useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [
    isBudgetDeleteConfirmationModalOpen,
    setIsBudgetDeleteConfirmationModalOpen,
  ] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: isUserAuthenticated,
  });

  const {
    data: budgets,
    isLoading: budgetsLoading,
    error: budgetsError,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(),
    enabled: isUserAuthenticated,
  });

  const { mutate: createBudgetMutation } = useMutation({
    mutationFn: (data: BudgetFormData) => {
      return createBudget(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setIsBudgetModalOpen(false);
    },
  });

  const { mutate: updateBudgetMutation } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BudgetFormData }) => {
      if (!id) throw new Error("Missing budget ID");
      return updateBudget(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", id] });
      setIsBudgetModalOpen(false);
    },
  });

  const { mutate: deleteMutationBudget, isPending: isDeletingBudget } =
    useMutation({
      mutationFn: (id: string) => deleteBudget(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["budgets"] });
        navigate("/budgets");
      },
    });

  return (
    <Fragment>
      {budgetsLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {budgetsError && <ErrorMessage message="Failed to load budgets" />}
          <div className="flex flex-col justify-between items-center">
            <h1 className="mt-2 mb-2 w-full text-center text-2xl font-lato font-[500]">
              Keep your finances on track with budgets
            </h1>
            <Button
              onClick={() => {
                setSelectedBudget(null);
                setIsBudgetModalOpen(true);
              }}
            >
              Create budget
            </Button>
          </div>
          <BudgetList
            budgets={budgets || []}
            onView={(budgetToEdit) => {
              const selected = budgets?.find(
                (b: Budget) => b.id === budgetToEdit.id
              );
              if (selected) {
                setSelectedBudget(selected);
              }
            }}
            isSelectedBudgetSectionOpen={isSelectedBudgetSectionOpen}
            setIsSelectedBudgetSectionOpen={setIsSelectedBudgetSectionOpen}
          />
          {selectedBudget && isSelectedBudgetSectionOpen && (
            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col justify-between items-center mb-4">
                <h1 className="mt-2 mb-4 text-2xl font-lato font-[500]">
                  {selectedBudget.name}
                </h1>
                <p className="text-gray-600">{selectedBudget.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-center font-medium text-lg mb-4">
                      Transactions
                    </h2>
                    <TransactionList
                      transactions={selectedBudget.transactions}
                      categories={categories}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-center font-medium text-lg mb-4">
                      Budget details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-gray-500">Monthly limit</h3>
                        <p className="text-xl font-bold">
                          {selectedBudget.monthly_limit
                            ? `$${Number(selectedBudget.monthly_limit).toFixed(
                                2
                              )}`
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-gray-500">Current spending</h3>
                        <p className="text-xl font-bold">
                          ${Number(selectedBudget.current_spending).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-2 flex justify-start space-x-4">
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => setIsBudgetModalOpen(true)}
                          aria-label="Edit budget"
                        >
                          <Pencil size={16} className="inline-flex pb-0.5" />{" "}
                          Edit budget
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() =>
                            setIsBudgetDeleteConfirmationModalOpen(true)
                          }
                          aria-label="Delete budget"
                        >
                          <Trash
                            size={16}
                            className="inline-flex pb-0.5 text-red-500"
                          />{" "}
                          Delete budget
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {isBudgetModalOpen && (
                <BudgetModal
                  isOpen={isBudgetModalOpen}
                  onClose={() => {
                    setIsBudgetModalOpen(false);
                  }}
                  onSubmitBudget={(data) => {
                    if (selectedBudget) {
                      if (!selectedBudget?.id) {
                        console.error("No budget selected for update");
                        return;
                      }
                      updateBudgetMutation({
                        id: selectedBudget.id,
                        data,
                      });
                    } else {
                      createBudgetMutation(data);
                    }
                    setIsBudgetModalOpen(false);
                  }}
                  initialData={selectedBudget}
                />
              )}
              {isBudgetDeleteConfirmationModalOpen && (
                <Modal
                  isOpen={isBudgetDeleteConfirmationModalOpen}
                  onClose={() => {
                    setIsBudgetDeleteConfirmationModalOpen(false);
                  }}
                  title="Delete budget"
                >
                  <p className="mb-4">
                    Are you sure you want to delete the budget{" "}
                    <strong>{selectedBudget?.name}</strong>?
                  </p>
                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsBudgetDeleteConfirmationModalOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (selectedBudget?.id) {
                          deleteMutationBudget(selectedBudget.id);
                        }
                        setIsBudgetDeleteConfirmationModalOpen(false);
                        setSelectedBudget(null);
                        setIsSelectedBudgetSectionOpen(false);
                      }}
                      loading={isDeletingBudget}
                    >
                      Delete
                    </Button>
                  </div>
                </Modal>
              )}
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};
