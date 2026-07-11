/**
 * Lead Submission API — Validation Tests
 */

import { describe, it, expect } from "vitest";

describe("Lead Submission Validation", () => {
  function validateLead(body: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!body.firstName || typeof body.firstName !== "string" || body.firstName.trim().length === 0) {
      errors.push("firstName is required");
    }
    if (!body.lastName || typeof body.lastName !== "string" || body.lastName.trim().length === 0) {
      errors.push("lastName is required");
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push("Valid email is required");
    }
    if (!body.contractorId || typeof body.contractorId !== "string") {
      errors.push("contractorId is required");
    }
    if (body.homeSize && (isNaN(Number(body.homeSize)) || Number(body.homeSize) < 100)) {
      errors.push("homeSize must be at least 100 sq ft");
    }

    return { valid: errors.length === 0, errors };
  }

  it("should pass valid lead submission", () => {
    const result = validateLead({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      contractorId: "clx123",
      homeSize: "1800",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject missing firstName", () => {
    const result = validateLead({
      lastName: "Doe",
      email: "john@example.com",
      contractorId: "clx123",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("firstName is required");
  });

  it("should reject invalid email", () => {
    const result = validateLead({
      firstName: "John",
      lastName: "Doe",
      email: "not-an-email",
      contractorId: "clx123",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Valid email is required");
  });

  it("should reject missing contractorId", () => {
    const result = validateLead({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("contractorId is required");
  });

  it("should validate homeSize if provided", () => {
    const result = validateLead({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      contractorId: "clx123",
      homeSize: "50",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("homeSize must be at least 100 sq ft");
  });

  it("should collect all validation errors", () => {
    const result = validateLead({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Lead Status Transitions", () => {
  const validTransitions: Record<string, string[]> = {
    NEW: ["CONTACTED", "SPAM"],
    CONTACTED: ["QUALIFIED", "LOST", "SPAM"],
    QUALIFIED: ["QUOTE_SENT", "LOST"],
    QUOTE_SENT: ["CONTRACT_SIGNED", "LOST"],
    CONTRACT_SIGNED: ["INSTALLATION_SCHEDULED", "LOST"],
    INSTALLATION_SCHEDULED: ["COMPLETED", "LOST"],
    COMPLETED: [],
    LOST: [],
    SPAM: [],
  };

  function canTransition(from: string, to: string): boolean {
    if (from === to) return true; // No-op is allowed
    return validTransitions[from]?.includes(to) || false;
  }

  it("should allow NEW → CONTACTED", () => {
    expect(canTransition("NEW", "CONTACTED")).toBe(true);
  });

  it("should allow CONTACTED → QUALIFIED", () => {
    expect(canTransition("CONTACTED", "QUALIFIED")).toBe(true);
  });

  it("should NOT allow NEW → COMPLETED (skip steps)", () => {
    expect(canTransition("NEW", "COMPLETED")).toBe(false);
  });

  it("should NOT allow COMPLETED → NEW (reverse)", () => {
    expect(canTransition("COMPLETED", "NEW")).toBe(false);
  });

  it("should allow NEW → SPAM (negative)", () => {
    expect(canTransition("NEW", "SPAM")).toBe(true);
  });

  it("should allow active statuses to transition to LOST", () => {
    const activeStatuses = ["CONTACTED", "QUALIFIED", "QUOTE_SENT", "CONTRACT_SIGNED", "INSTALLATION_SCHEDULED"];
    for (const status of activeStatuses) {
      expect(canTransition(status, "LOST")).toBe(true);
    }
  });
});
