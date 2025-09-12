import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import { server } from "../../../__mocks__/server";
import { BACKEND_API_URL } from "../../../constants";
import { AuthContextProvider } from "../context/AuthContext";
import { ResetPasswordPage } from "./ResetPasswordPage";

describe("ResetPasswordPage page", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <ResetPasswordPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("RESET")).toBeInTheDocument();
  });

  test("handles empty inputs", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <ResetPasswordPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const resetButton = screen.getByRole("button", { name: "RESET" });

    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.change(emailAddressInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "" } });

    expect(resetButton).toBeDisabled();
  });

  test("handles invalid inputs", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <ResetPasswordPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const resetButton = screen.getByRole("button", { name: "RESET" });

    fireEvent.change(nameInput, { target: { value: "T" } });
    fireEvent.change(emailAddressInput, { target: { value: "e" } });
    fireEvent.change(passwordInput, { target: { value: "s" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "t" } });

    expect(resetButton).toBeDisabled();
  });

  test("shows loading state during password reset", async () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <ResetPasswordPage />
          <ToastContainer />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const resetButton = screen.getByRole("button", { name: "RESET" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "Password.456" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password.456" },
    });
    fireEvent.click(resetButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
  });

  test("shows success message on successful submission", async () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <ResetPasswordPage />
          <ToastContainer />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const resetButton = screen.getByRole("button", { name: "RESET" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "Password.456" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password.456" },
    });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Password has been reset successfully./i)
      ).toBeInTheDocument();
    });
  });

  test("handles API errors gracefully", async () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();
    server.use(
      http.patch(`${BACKEND_API_URL}/users/reset-password`, () => {
        return HttpResponse.json({ message: "Network error" }, { status: 404 });
      })
    );

    render(
      <MemoryRouter>
        <AuthContextProvider>
          <ResetPasswordPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Enter your name");
    const emailAddressInput = screen.getByLabelText("Enter your email address");
    const passwordInput = screen.getByLabelText("Enter new password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const resetButton = screen.getByRole("button", { name: "RESET" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "Password.456" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password.456" },
    });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
    console.error = originalConsoleError;
  });
});
