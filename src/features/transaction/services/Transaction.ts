import axios from "axios";
import { BACKEND_API_URL } from "../../../constants";

export const getTransactions = async (params = {}) => {
  const serverResponse = await axios.get(`${BACKEND_API_URL}/transactions`, {
    params,
  });
  return serverResponse.data;
};

export const createTransaction = async (data: FormData) => {
  const serverResponse = await axios.post(
    `${BACKEND_API_URL}/transactions`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return serverResponse.data;
};

export const updateTransaction = async (id: string, data: FormData) => {
  const serverResponse = await axios.patch(
    `${BACKEND_API_URL}/transactions/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return serverResponse.data;
};

export const deleteTransaction = async (id: string) => {
  const serverResponse = await axios.delete(
    `${BACKEND_API_URL}/transactions/${id}`
  );
  return serverResponse.data;
};
