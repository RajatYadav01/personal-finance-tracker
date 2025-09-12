import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import axios from "axios";
import { MemoryRouter } from "react-router";
import { useContext } from "react";
import { AuthContextProvider, AuthContext } from "./AuthContext";

const TestComponent = () => {
  const auth = useContext(AuthContext);
  if (!auth) return null;

  return (
    <div>
      <div>LoggedIn: {String(auth.loginStatusState.loggedIn)}</div>
      <button
        onClick={() =>
          auth.logIn(JSON.stringify({ email: "test", password: "pass" }))
        }
      >
        Log In
      </button>
      <button onClick={() => auth.tokenRefresh()}>Refresh Token</button>
      <button onClick={() => auth.logOut()}>Log Out</button>
    </div>
  );
};

describe("AuthContext", () => {
  it("should render with default values", () => {
    const { getByText } = render(
      <MemoryRouter>
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      </MemoryRouter>
    );
    expect(getByText("LoggedIn: false")).toBeTruthy();
  });

  it("logIn should update state and localStorage", async () => {
    const { getByText } = render(
      <MemoryRouter>
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      </MemoryRouter>
    );

    await userEvent.click(getByText("Log In"));

    await waitFor(() => {
      expect(getByText("LoggedIn: true")).toBeTruthy();
      expect(localStorage.getItem("isLoggedIn")).toBe("true");
      expect(localStorage.getItem("refreshToken")).toBe("refresh-token-123");
      expect(axios.defaults.headers.common["Authorization"]).toContain(
        "Bearer"
      );
    });
  });

  it("tokenRefresh should update state and restart logout timer", async () => {
    localStorage.setItem("refreshToken", "mock-refresh-token");
    localStorage.setItem("isLoggedIn", "true");

    const { getByText } = render(
      <MemoryRouter>
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      </MemoryRouter>
    );

    await userEvent.click(getByText("Refresh Token"));

    await waitFor(() => {
      expect(getByText("LoggedIn: true")).toBeTruthy();
      expect(axios.defaults.headers.common["Authorization"]).toContain(
        "Bearer"
      );
    });
  });

  it("logOut should clear state and localStorage", async () => {
    localStorage.setItem("refreshToken", "some-token");
    localStorage.setItem("isLoggedIn", "true");

    const { getByText } = render(
      <MemoryRouter>
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      </MemoryRouter>
    );

    await userEvent.click(getByText("Log Out"));

    await waitFor(() => {
      expect(getByText("LoggedIn: false")).toBeTruthy();
      expect(localStorage.getItem("isLoggedIn")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
    });
  });
});
