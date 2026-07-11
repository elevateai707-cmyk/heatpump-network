/**
 * Stripe client initialization and helpers
 * Handles: credit packs, premium subscriptions, sponsored placements
 * Uses lazy initialization to avoid build-time failures when env vars missing
 */

import type Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Get the Stripe client (lazy init)
 */
export function getStripe(): Stripe | null {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[Stripe] STRIPE_SECRET_KEY not configured");
    }
    return null;
  }

  // Dynamic import to avoid build-time resolution issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: StripeLib } = require("stripe");
  _stripe = new StripeLib(key, {
    apiVersion: "2025-02-24.acacia",
  });
  return _stripe;
}

// ─── Price Configuration ───

export const CREDIT_PACKS = [
  { id: "credits_5", credits: 5, label: "5 Lead Credits", priceCents: 15000 },
  { id: "credits_10", credits: 10, label: "10 Lead Credits", priceCents: 40000 },
  { id: "credits_25", credits: 25, label: "25 Lead Credits", priceCents: 87500 },
  { id: "credits_50", credits: 50, label: "50 Lead Credits", priceCents: 150000 },
  { id: "credits_100", credits: 100, label: "100 Lead Credits", priceCents: 250000 },
] as const;

export const PREMIUM_PLANS = [
  { id: "premium_monthly", label: "Premium Monthly", priceCents: 9900, interval: "month" as const, features: ["Photo gallery & video embed", "Early lead access (15 min)", "Advanced analytics & CSV export", "Priority support"] },
  { id: "premium_yearly", label: "Premium Yearly", priceCents: 99000, interval: "year" as const, features: ["Everything in Monthly", "2 months free", "Dedicated account manager"] },
] as const;

export const SPONSORED_RATES = {
  perCityCategory: { priceCents: 29900, label: "Per city/category per month" },
  statewide: { priceCents: 99900, label: "Statewide per month" },
} as const;

/**
 * Get or create a Stripe customer for a contractor
 */
export async function getOrCreateStripeCustomer(
  contractorId: string,
  email: string,
  name: string
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe not configured");

  const existingCustomers = await stripe.customers.list({ email, limit: 1 });
  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0].id;
  }

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { contractorId },
  });

  return customer.id;
}
