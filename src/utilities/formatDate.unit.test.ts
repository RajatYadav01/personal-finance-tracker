import { describe, it, expect } from "vitest";
import formatDate from "./formatDate";

describe("formatDate", () => {
  it("formats a valid ISO date string", () => {
    expect(formatDate("2023-09-11")).toBe("Sep 11, 2023");
  });

  it("formats a date-time string with time", () => {
    expect(formatDate("2023-09-11T15:30:00Z")).toBe("Sep 11, 2023");
  });

  it("formats a leap year date correctly", () => {
    expect(formatDate("2020-02-29")).toBe("Feb 29, 2020");
  });

  it("formats a date with single-digit month and day", () => {
    expect(formatDate("2025-01-05")).toBe("Jan 5, 2025");
  });

  it("handles future dates", () => {
    expect(formatDate("2099-12-31")).toBe("Dec 31, 2099");
  });

  it("handles past dates", () => {
    expect(formatDate("1900-01-01")).toBe("Jan 1, 1900");
  });

  it("throws or returns 'Invalid Date' for invalid strings", () => {
    const result = formatDate("invalid-date");
    expect(result).toBe("Invalid Date");
  });

  it("handles empty string input", () => {
    const result = formatDate("");
    expect(result).toBe("Invalid Date");
  });
});
