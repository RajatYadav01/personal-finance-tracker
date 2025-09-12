import { http, HttpResponse } from "msw";
import { BACKEND_API_URL } from "../constants";
import { type User } from "../features/authentication";

export const mockUser: User = {
  id: "abc-123",
  name: "Test User",
  email_address: "testuser@example.com",
  currency: "USD",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-09-01T00:00:00Z",
};

export const userHandlers = [
  http.post(`${BACKEND_API_URL}/users/register`, async () => {
    return HttpResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  }),

  http.get(`${BACKEND_API_URL}/users/me`, () => {
    return HttpResponse.json({ user: mockUser });
  }),

  http.post(`${BACKEND_API_URL}/users/authenticate`, async ({ request }) => {
    const { emailAddress, password } = await request.clone().json();
    const mockUserName =
      emailAddress === "testuser@example.com" && password === "Password.123"
        ? "Test User"
        : "mock-user-name";
    return HttpResponse.json(
      {
        message: "Logged in successfully",
        access_token: "access-token-123",
        refresh_token: "refresh-token-123",
        user: {
          id: "user123",
          name: mockUserName,
          currency: "USD",
        },
      },
      { status: 200 }
    );
  }),

  http.post(`${BACKEND_API_URL}/users/refresh`, ({ request }) => {
    const refreshToken = request.headers.get("X-Refresh-Token");
    if (!refreshToken) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json(
      {
        message: "Access token refreshed successfully",
        access_token: "new-mock-access-token",
        user: {
          id: "user-123",
          name: "Test User",
          email_address: "testuser@example.com",
          currency: "USD",
        },
      },
      { status: 200 }
    );
  }),

  http.patch(`${BACKEND_API_URL}/users/reset-password`, () => {
    return HttpResponse.json(
      { message: "Password has been reset successfully" },
      { status: 201 }
    );
  }),

  http.delete(`${BACKEND_API_URL}/users/logout`, () => {
    return HttpResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  }),

  http.patch(`${BACKEND_API_URL}/users/update`, async ({ request }) => {
    const body = await request.text();
    const parsedData = JSON.parse(body);

    return HttpResponse.json(
      {
        message: "User details updated successfully",
        user: {
          ...parsedData,
        },
      },
      { status: 201 }
    );
  }),

  http.delete(`${BACKEND_API_URL}/users/delete`, () => {
    return HttpResponse.json(
      { message: "User and all related data deleted successfully" },
      { status: 200 }
    );
  }),
];
