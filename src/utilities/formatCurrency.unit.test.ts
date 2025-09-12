import { describe, it, expect } from "vitest";
import formatCurrency from "./formatCurrency";

describe("formatCurrency", () => {
  it("formats number as USD by default", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats number as EUR", () => {
    expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56");
  });

  it("formats number as JPY (no decimal)", () => {
    expect(formatCurrency(1234, "JPY")).toBe("¥1,234.00");
  });

  it("formats negative values", () => {
    expect(formatCurrency(-987.65)).toBe("-$987.65");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("rounds to two decimal places", () => {
    expect(formatCurrency(10.567)).toBe("$10.57");
    expect(formatCurrency(10.564)).toBe("$10.56");
  });

  it("handles large numbers with commas", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });

  it("throws with invalid currency code (optional)", () => {
    // Intl will throw for invalid currency codes
    expect(() => formatCurrency(123, "INVALID")).toThrow();
  });
});
