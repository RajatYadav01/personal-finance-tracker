import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { useAuthContext } from "../features/authentication";
import Home from "./Home";

vi.mock("../components/ui/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("../components/ui/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("../components/ui/Button", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

vi.mock("../features/authentication", async () => {
  const actual = await vi.importActual("../features/authentication");
  return {
    ...actual,
    useAuthContext: vi.fn(),
  };
});

describe("HomePage", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

  it("renders without crashing", async () => {
    (useAuthContext as any).mockReturnValue({
      loginStatusState: { userID: "" },
    });

    renderComponent();

    expect(
      screen.getByText(
        /The all-in-one personal finance tracker that helps you manage your money and achieve your financial goals effortlessly./
      )
    ).toBeInTheDocument();
  });

  it("renders header and footer", () => {
    (useAuthContext as any).mockReturnValue({
      loginStatusState: { userID: "" },
    });

    renderComponent();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("shows 'Start tracking' and 'Get Started' buttons when user is not logged in", () => {
    (useAuthContext as any).mockReturnValue({
      loginStatusState: { userID: "" },
    });

    renderComponent();

    expect(screen.getByText("Start tracking")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("shows 'Go to Dashboard' buttons when user is logged in", () => {
    (useAuthContext as any).mockReturnValue({
      loginStatusState: { userID: "user123" },
    });

    renderComponent();

    const dashboardButtons = screen.getAllByText("Go to Dashboard");
    expect(dashboardButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the feature cards with correct titles", () => {
    (useAuthContext as any).mockReturnValue({
      loginStatusState: { userID: "" },
    });

    renderComponent();

    expect(screen.getByText("Real-time Analytics")).toBeInTheDocument();
    expect(screen.getByText("Budget Tracking")).toBeInTheDocument();
    expect(screen.getByText("All Accounts in One Place")).toBeInTheDocument();
    expect(screen.getByText("Quick Insights")).toBeInTheDocument();
  });

  it("renders the hero section content", () => {
    (useAuthContext as any).mockReturnValue({
      loginStatusState: { userID: "" },
    });

    renderComponent();

    expect(
      screen.getByText(/Take control of your life by tracking your/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The all-in-one personal finance tracker/i)
    ).toBeInTheDocument();
  });

  it("renders the 'Powerful Features' section", () => {
    (useAuthContext as any).mockReturnValue({
      loginStatusState: { userID: "" },
    });

    renderComponent();

    expect(screen.getByText("Powerful Features")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Everything you need to manage your personal finances effectively"
      )
    ).toBeInTheDocument();
  });

  it("renders the CTA section with correct text", () => {
    (useAuthContext as any).mockReturnValue({
      loginStatusState: { userID: "" },
    });

    renderComponent();

    expect(
      screen.getByText("Ready to transform your finances?")
    ).toBeInTheDocument();
  });
});
