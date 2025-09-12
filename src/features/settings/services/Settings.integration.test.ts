import { describe, it, expect } from "vitest";
import { getUser, updateUser, deleteUser } from "./Settings";

describe("User API", () => {
  it("fetches the current user", async () => {
    const user = await getUser();
    expect(user).toMatchObject({
      id: "abc-123",
      name: "Test User",
      email_address: "testuser@example.com",
      currency: "USD",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-09-01T00:00:00Z",
    });
  });

  it("updates the user profile", async () => {
    const updateData = JSON.stringify({
      name: "Updated Test User",
      currency: "EUR",
    });
    const updatedUser = await updateUser(updateData);

    expect(updatedUser.name).toBe("Updated Test User");
    expect(updatedUser.currency).toBe("EUR");
  });

  it("deletes the user account", async () => {
    const response = await deleteUser();
    expect(response).toBe("User and all related data deleted successfully");
  });
});
