/**
 * Test setup — runs before all tests
 * Sets up test environment and mocks
 */

import { beforeAll } from "vitest";

// Set test environment variables
process.env.DATABASE_URL = "file:./test.db";
process.env.NEXTAUTH_SECRET = "test-secret-key-for-testing-only";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
process.env.NODE_ENV = "test";

beforeAll(() => {
  // Any global setup needed
});
