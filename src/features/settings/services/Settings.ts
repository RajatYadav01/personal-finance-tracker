import axios from "axios";
import { BACKEND_API_URL } from "../../../constants";

export const getUser = async () => {
  const serverResponse = await axios.get(`${BACKEND_API_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return serverResponse.data.user;
};

export const updateUser = async (userProfileUpdateFormData: string) => {
  const serverResponse = await axios.patch(
    `${BACKEND_API_URL}/users/update`,
    userProfileUpdateFormData,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return serverResponse.data.user;
};

export const deleteUser = async () => {
  const serverResponse = await axios.delete(`${BACKEND_API_URL}/users/delete`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return serverResponse.data.message;
};
