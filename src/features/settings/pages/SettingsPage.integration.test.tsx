import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import { server } from "../../../__mocks__/server";
import { BACKEND_API_URL } from "../../../constants";
import { type AuthContextType, AuthContext } from "../../authentication";
import { SettingsPage } from "./SettingsPage";

function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

const mockAuthValue: AuthContextType = {
  loginStatusState: {
    loggedIn: true,
    userID: "abc-123",
    userName: "Test User",
    userDefaultCurrency: "USD",
  },
  dispatchLoginStatusState: vi.fn(),
  logIn: vi.fn(),
  tokenRefresh: vi.fn(),
  logOut: vi.fn(),
  startLogOutTimer: vi.fn(),
  clearLogOutTimer: vi.fn(),
  isLogOutTimerActive: { current: false } as React.RefObject<boolean>,
};

describe("SettingsPage page", () => {
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("handles empty inputs", () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText("Update your name");
    const emailAddressInput = screen.getByLabelText(
      "Update your email address"
    );
    const currencyInput = screen.getByLabelText("Update your default currency");
    const passwordInput = screen.getByLabelText("Update your password");
    const confirmPasswordInput = screen.getByLabelText("Confirm new password");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.change(emailAddressInput, { target: { value: "" } });
    fireEvent.change(currencyInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "" } });

    expect(saveButton).toBeDisabled();
  });

  test("handles invalid inputs", () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText("Update your name");
    const emailAddressInput = screen.getByLabelText(
      "Update your email address"
    );
    const currencyInput = screen.getByLabelText("Update your default currency");
    const passwordInput = screen.getByLabelText("Update your password");
    const confirmPasswordInput = screen.getByLabelText("Confirm new password");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(nameInput, { target: { value: "T" } });
    fireEvent.change(emailAddressInput, { target: { value: "e" } });
    fireEvent.change(currencyInput, { target: { value: "s" } });
    fireEvent.change(passwordInput, { target: { value: "t" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "U" } });

    expect(saveButton).toBeDisabled();
  });

  test("shows loading state during profile update", async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText("Update your name");
    const emailAddressInput = screen.getByLabelText(
      "Update your email address"
    );
    const currencyInput = screen.getByLabelText("Update your default currency");

    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(nameInput, { target: { value: "Updated Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(currencyInput, { target: { value: "USD" } });

    fireEvent.click(saveButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
  });

  test("shows success message on successfully updating name", async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
            <ToastContainer />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText("Update your name");
    const emailAddressInput = screen.getByLabelText(
      "Update your email address"
    );
    const currencyInput = screen.getByLabelText("Update your default currency");

    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(nameInput, { target: { value: "Updated Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(currencyInput, { target: { value: "USD" } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Your profile has been successfully updated.")
      ).toBeInTheDocument();
    });
  });

  test("shows success message on successfully updating email address", async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
            <ToastContainer />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText("Update your name");
    const emailAddressInput = screen.getByLabelText(
      "Update your email address"
    );
    const currencyInput = screen.getByLabelText("Update your default currency");

    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "updatedtestuser@example.com" },
    });
    fireEvent.change(currencyInput, { target: { value: "USD" } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Your profile has been successfully updated. Please log in with the new email address."
        )
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("Your profile has been successfully updated.")
          .length
      ).toBeGreaterThan(0);
      expect(mockAuthValue.logOut).toBeCalled();
    });
  });

  test("shows success message on successfully updating password", async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
            <ToastContainer />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText("Update your name");
    const emailAddressInput = screen.getByLabelText(
      "Update your email address"
    );
    const currencyInput = screen.getByLabelText("Update your default currency");
    const passwordInput = screen.getByLabelText("Update your password");
    const confirmPasswordInput = screen.getByLabelText("Confirm new password");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(currencyInput, { target: { value: "USD" } });
    fireEvent.change(passwordInput, {
      target: { value: "UpdatedPassword.123" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "UpdatedPassword.123" },
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Your profile has been successfully updated.")
      ).toBeInTheDocument();
    });
  });

  test("asks for confirmation to delete the user", async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
            <ToastContainer />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const deleteButton = screen.getByRole("button", { name: "Delete" });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Your account and all your notes will be deleted permanently!"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText("Are you sure you want to proceed?")
      ).toBeInTheDocument();
    });
  });

  test("shows success message on successfully deleting the user after confirmation", async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
            <ToastContainer />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const deleteButton = screen.getByRole("button", { name: "Delete" });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      const confirmDeleteButton = screen.getByRole("button", {
        name: "Yes, delete my account",
      });
      fireEvent.click(confirmDeleteButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Your account has been deleted successfully.")
      ).toBeInTheDocument();
      expect(mockAuthValue.logOut).toBeCalled();
    });
  });

  test("handles API errors gracefully", async () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();
    server.use(
      http.patch(`${BACKEND_API_URL}/users/update`, () => {
        return HttpResponse.json({ message: "Network error" }, { status: 404 });
      })
    );

    render(
      <QueryClientProvider client={createQueryClient()}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthValue}>
            <SettingsPage />
            <ToastContainer />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameInput = screen.getByLabelText("Update your name");
    const emailAddressInput = screen.getByLabelText(
      "Update your email address"
    );
    const currencyInput = screen.getByLabelText("Update your default currency");
    const saveButton = screen.getByRole("button", { name: "Save" });

    fireEvent.change(nameInput, { target: { value: "Updated Test User" } });
    fireEvent.change(emailAddressInput, {
      target: { value: "updatedtestuser@example.com" },
    });
    fireEvent.change(currencyInput, { target: { value: "EUR" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
    console.error = originalConsoleError;
  });
});
