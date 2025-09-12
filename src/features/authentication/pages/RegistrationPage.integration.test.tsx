import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import { server } from "../../../__mocks__/server";
import { BACKEND_API_URL } from "../../../constants";
import { AuthContextProvider } from "../context/AuthContext";
import { RegistrationPage } from "./RegistrationPage";

describe("RegistrationPage page", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <RegistrationPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  test("handles empty inputs", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <RegistrationPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const currencyInput = screen.getByLabelText("Choose your default currency");
    const passwordInput = screen.getByLabelText("Create new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const registerButton = screen.getByRole("button", { name: "REGISTER" });

    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.change(emailAddressInput, { target: { value: "" } });
    fireEvent.change(currencyInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "" } });

    expect(registerButton).toBeDisabled();
  });

  test("handles invalid inputs", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <RegistrationPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const currencyInput = screen.getByLabelText("Choose your default currency");
    const passwordInput = screen.getByLabelText("Create new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const registerButton = screen.getByRole("button", { name: "REGISTER" });

    fireEvent.change(nameInput, { target: { value: "T" } });
    fireEvent.change(emailAddressInput, { target: { value: "e" } });
    fireEvent.change(currencyInput, { target: { value: "s" } });
    fireEvent.change(passwordInput, { target: { value: "t" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "U" } });

    expect(registerButton).toBeDisabled();
  });

  test("shows loading state during submission", async () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <RegistrationPage />
          <ToastContainer />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const currencyInput = screen.getByLabelText("Choose your default currency");
    const passwordInput = screen.getByLabelText("Create new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const registerButton = screen.getByRole("button", { name: "REGISTER" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(currencyInput, { target: { value: "USD" } });
    fireEvent.change(passwordInput, { target: { value: "Password.123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password.123" },
    });
    fireEvent.click(registerButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
  });

  test("shows success message on successful submission", async () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <RegistrationPage />
          <ToastContainer />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const currencyInput = screen.getByLabelText("Choose your default currency");
    const passwordInput = screen.getByLabelText("Create new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const registerButton = screen.getByRole("button", { name: "REGISTER" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(currencyInput, { target: { value: "USD" } });
    fireEvent.change(passwordInput, { target: { value: "Password.123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password.123" },
    });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Your account has been successfully created/i)
      ).toBeInTheDocument();
    });
  });

  test("handles API errors gracefully", async () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();
    server.use(
      http.post(`${BACKEND_API_URL}/users/register`, () => {
        return HttpResponse.json({ message: "Network error" }, { status: 404 });
      })
    );

    render(
      <MemoryRouter>
        <AuthContextProvider>
          <RegistrationPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const currencyInput = screen.getByLabelText("Choose your default currency");
    const passwordInput = screen.getByLabelText("Create new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const registerButton = screen.getByRole("button", { name: "REGISTER" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(currencyInput, { target: { value: "USD" } });
    fireEvent.change(passwordInput, { target: { value: "Password.123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password.123" },
    });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
    console.error = originalConsoleError;
  });
});
