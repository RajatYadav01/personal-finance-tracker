import axios, { type AxiosResponse } from "axios";
import { BACKEND_API_URL } from "../../../constants";

export const register = async (registrationFormData: string) => {
  const serverResponse: AxiosResponse = await axios.post(
    `${BACKEND_API_URL}/users/register`,
    registrationFormData,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return serverResponse.data.message;
};

export const login = async (logInFormData: string) => {
  const serverResponse = await axios.post(
    `${BACKEND_API_URL}/users/authenticate`,
    logInFormData,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return serverResponse.data;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const serverResponse: AxiosResponse = await axios.post(
    `${BACKEND_API_URL}/users/refresh`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Refresh-Token": refreshToken,
      },
      withCredentials: true,
    }
  );
  return serverResponse.data;
};

export const resetPassword = async (resetPasswordFormData: string) => {
  const serverResponse: AxiosResponse = await axios.patch(
    `${BACKEND_API_URL}/users/reset-password`,
    resetPasswordFormData,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return serverResponse.data.message;
};

export const logout = async () => {
  const serverResponse: AxiosResponse = await axios.delete(
    `${BACKEND_API_URL}/users/logout`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return serverResponse.data.message;
};
