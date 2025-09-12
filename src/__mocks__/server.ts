import { setupServer } from "msw/node";
import { userHandlers } from "./handlers";

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...userHandlers);
