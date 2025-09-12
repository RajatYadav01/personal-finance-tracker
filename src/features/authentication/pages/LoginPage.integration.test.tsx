import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import { server } from "../../../__mocks__/server";
import { BACKEND_API_URL } from "../../../constants";
import { AuthContextProvider } from "../context/AuthContext";
import { LoginPage } from "./LoginPage";

describe("Login page", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <LoginPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Log in/)).toBeInTheDocument();
  });

  test("handles empty inputs", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <LoginPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter your password");
    const loginButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailAddressInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });

    expect(loginButton).toBeDisabled();
  });

  test("handles invalid inputs", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <LoginPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter your password");
    const loginButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailAddressInput, { target: { value: "T" } });
    fireEvent.change(passwordInput, { target: { value: "e" } });

    expect(loginButton).toBeDisabled();
  });

  test("shows loading state during login", async () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <LoginPage />
          <ToastContainer />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter your password");
    const loginButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "Password.123" } });
    fireEvent.click(loginButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
  });

  test("shows success message on successful submission", async () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <LoginPage />
          <ToastContainer />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter your password");
    const loginButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "Password.123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText(/You have logged in successfully./i)
      ).toBeInTheDocument();
    });
  });

  test("handles API errors gracefully", async () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();
    server.use(
      http.post(`${BACKEND_API_URL}/users/authenticate`, () => {
        return HttpResponse.json({ message: "Network error" }, { status: 404 });
      })
    );

    render(
      <MemoryRouter>
        <AuthContextProvider>
          <LoginPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter your password");
    const loginButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "Password.123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
    console.error = originalConsoleError;
  });
});
