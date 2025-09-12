import axios from "axios";
import { BACKEND_API_URL } from "../../../constants";

export const getSummary = async () => {
  const serverResponse = await axios.get(
    `${BACKEND_API_URL}/transactions/summary`
  );
  return serverResponse.data;
};

export const getRecentTransactions = async (params: { limit: number }) => {
  const serverResponse = await axios.get(
    `${BACKEND_API_URL}/transactions/recent`,
    {
      params,
    }
  );
  return serverResponse.data;
};

export const getSpendingTrends = async (params: { months: number }) => {
  const serverResponse = await axios.get(`${BACKEND_API_URL}/reports/trends`, {
    params,
  });
  return serverResponse.data;
};
