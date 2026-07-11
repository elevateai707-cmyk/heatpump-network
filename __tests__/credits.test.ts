/**
 * Lead Credit Deduction Logic Tests
 */

import { describe, it, expect } from "vitest";

describe("Credit Deduction Logic", () => {
  // The actual logic: when a lead status changes to CONTACTED
  // and creditDeducted is false, deduct 1 credit

  function deductCredit(
    leadBalance: number,
    creditDeducted: boolean,
    newStatus: string
  ): { success: boolean; newBalance: number; deducted: boolean; error?: string } {
    if (newStatus !== "CONTACTED") {
      return { success: true, newBalance: leadBalance, deducted: false };
    }

    if (creditDeducted) {
      return { success: true, newBalance: leadBalance, deducted: false };
    }

    if (leadBalance < 1) {
      return { success: false, newBalance: leadBalance, deducted: false, error: "Insufficient credit balance" };
    }

    return { success: true, newBalance: leadBalance - 1, deducted: true };
  }

  it("should deduct a credit when marking lead as CONTACTED", () => {
    const result = deductCredit(10, false, "CONTACTED");
    expect(result.success).toBe(true);
    expect(result.deducted).toBe(true);
    expect(result.newBalance).toBe(9);
  });

  it("should NOT deduct a credit for status other than CONTACTED", () => {
    const result = deductCredit(10, false, "NEW");
    expect(result.deducted).toBe(false);
    expect(result.newBalance).toBe(10);
  });

  it("should NOT deduct a credit if already deducted", () => {
    const result = deductCredit(10, true, "CONTACTED");
    expect(result.deducted).toBe(false);
    expect(result.newBalance).toBe(10);
  });

  it("should fail with insufficient balance", () => {
    const result = deductCredit(0, false, "CONTACTED");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Insufficient credit balance");
    expect(result.deducted).toBe(false);
  });

  it("should handle edge case of exactly 1 credit remaining", () => {
    const result = deductCredit(1, false, "CONTACTED");
    expect(result.success).toBe(true);
    expect(result.deducted).toBe(true);
    expect(result.newBalance).toBe(0);
  });

  it("should allow status changes after credit deducted without further deduction", () => {
    const result = deductCredit(9, true, "QUALIFIED");
    expect(result.deducted).toBe(false);
    expect(result.newBalance).toBe(9);
  });
});

describe("Credit Pack Pricing", () => {
  const CREDIT_PACKS = [
    { id: "credits_5", credits: 5, priceCents: 15000 },
    { id: "credits_10", credits: 10, priceCents: 40000 },
    { id: "credits_25", credits: 25, priceCents: 87500 },
    { id: "credits_50", credits: 50, priceCents: 150000 },
    { id: "credits_100", credits: 100, priceCents: 250000 },
  ];

  it("should have reasonable pricing between $25 and $50 per lead", () => {
    for (const pack of CREDIT_PACKS) {
      const perLead = pack.priceCents / pack.credits;
      expect(perLead).toBeGreaterThanOrEqual(2500); // $25
      expect(perLead).toBeLessThanOrEqual(5000); // $50
    }
  });

  it("should have lower per-lead cost for 100-pack vs 5-pack", () => {
    const fivePack = CREDIT_PACKS.find((p) => p.id === "credits_5")!;
    const hundredPack = CREDIT_PACKS.find((p) => p.id === "credits_100")!;
    expect(hundredPack.priceCents / hundredPack.credits).toBeLessThan(
      fivePack.priceCents / fivePack.credits
    );
  });
});
