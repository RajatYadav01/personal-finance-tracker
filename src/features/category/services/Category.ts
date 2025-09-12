import axios from "axios";
import { BACKEND_API_URL } from "../../../constants";
import { type CategoryFormData, type Category } from "../types/category.types";

export const getCategories = async () => {
  const serverResponse = await axios.get(`${BACKEND_API_URL}/categories`);
  return serverResponse.data;
};

export const createCategory = async (data: CategoryFormData) => {
  const serverResponse = await axios.post(
    `${BACKEND_API_URL}/categories`,
    data
  );
  return serverResponse.data;
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  const serverResponse = await axios.patch(
    `${BACKEND_API_URL}/categories/${id}`,
    data
  );
  return serverResponse.data;
};

export const deleteCategory = async (id: string) => {
  const serverResponse = await axios.delete(
    `${BACKEND_API_URL}/categories/${id}`
  );
  return serverResponse.data;
};
