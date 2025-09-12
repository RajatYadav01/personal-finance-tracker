import { beforeEach, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the home page at root route", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(
      screen.getByText(
        "The all-in-one personal finance tracker that helps you manage your money and achieve your financial goals effortlessly."
      )
    ).toBeInTheDocument();
  });

  it("renders login page at /login", () => {
    window.history.pushState({}, "", "/login");
    render(<App />);

    expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument();
  });

  it("renders 404 page on unknown route", () => {
    window.history.pushState({}, "", "/some-unknown-path");
    render(<App />);

    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});
