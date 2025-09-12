import { describe, it, expect } from "vitest";
import { register, login, refreshToken, resetPassword, logout } from "./User";

describe("User API service", () => {
  it("register() should return success message", async () => {
    const formData = JSON.stringify({
      name: "Test User",
      emailAddress: "testuser@example.com",
    });
    const message = await register(formData);
    expect(message).toBe("Registration successful");
  });

  it("login() should return tokens and user details", async () => {
    const formData = JSON.stringify({
      emailAddress: "testuser@example.com",
      password: "Password.123",
    });
    const data = await login(formData);
    expect(data).toEqual({
      message: "Logged in successfully",
      access_token: "access-token-123",
      refresh_token: "refresh-token-123",
      user: {
        id: "user123",
        name: "Test User",
        currency: "USD",
      },
    });
  });

  it("refreshToken() should return new token", async () => {
    localStorage.setItem("refreshToken", "mock-refresh-token");
    const data = await refreshToken();
    expect(data).toEqual({
      message: "Access token refreshed successfully",
      access_token: "new-mock-access-token",
      user: {
        id: "user-123",
        name: "Test User",
        email_address: "testuser@example.com",
        currency: "USD",
      },
    });
  });

  it("refreshToken() should fail without refresh token", async () => {
    localStorage.removeItem("refreshToken");
    await expect(refreshToken()).rejects.toThrowError(
      /Request failed with status code 401/
    );
  });

  it("resetPassword() should return success message", async () => {
    const formData = JSON.stringify({ password: "newpassword123" });
    const message = await resetPassword(formData);
    expect(message).toBe("Password has been reset successfully");
  });

  it("logout() should return logout message", async () => {
    const message = await logout();
    expect(message).toBe("Logged out successfully");
  });
});
