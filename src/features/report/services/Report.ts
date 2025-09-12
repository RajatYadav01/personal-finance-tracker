import axios from "axios";
import { BACKEND_API_URL } from "../../../constants";
import { type ReportParams } from "../types/report.types";

export const getSpendingData = async (params: ReportParams) => {
  const serverResponse = await axios.get(
    `${BACKEND_API_URL}/reports/spending`,
    {
      params,
    }
  );
  return serverResponse.data;
};

export const getCashFlowData = async (params: ReportParams) => {
  const serverResponse = await axios.get(
    `${BACKEND_API_URL}/reports/cash_flow`,
    {
      params,
    }
  );
  return serverResponse.data;
};

export const getCategoryTrends = async (params: ReportParams) => {
  const serverResponse = await axios.get(
    `${BACKEND_API_URL}/reports/category_trends`,
    {
      params,
    }
  );
  return serverResponse.data;
};

export const exportReportData = async (params: ReportParams) => {
  const serverResponse = await axios.get(`${BACKEND_API_URL}/reports/export`, {
    params,
    responseType: "blob",
  });
  return serverResponse;
};
