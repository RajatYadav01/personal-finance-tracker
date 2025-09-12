import axios from "axios";
import { BACKEND_API_URL } from "../../../constants";
import { type BudgetFormData } from "../types/budget.types";

export const getBudgets = async () => {
  const serverResponse = await axios.get(`${BACKEND_API_URL}/budgets`);
  return serverResponse.data;
};

export const getBudget = async (id: string) => {
  const serverResponse = await axios.get(`${BACKEND_API_URL}/budgets/${id}`);
  return serverResponse.data;
};

export const createBudget = async (data: BudgetFormData) => {
  const serverResponse = await axios.post(`${BACKEND_API_URL}/budgets`, data);
  return serverResponse.data;
};

export const updateBudget = async (id: string, data: BudgetFormData) => {
  const serverResponse = await axios.patch(
    `${BACKEND_API_URL}/budgets/${id}`,
    data
  );
  return serverResponse.data;
};

export const deleteBudget = async (id: string) => {
  const serverResponse = await axios.delete(`${BACKEND_API_URL}/budgets/${id}`);
  return serverResponse.data;
};
