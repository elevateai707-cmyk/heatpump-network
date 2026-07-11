/**
 * Stripe Checkout Session — Create
 * POST /api/stripe/create-checkout
 * Body: { contractorId, itemType: "credits"|"premium"|"sponsored", itemId: string }
 *
 * Creates a Stripe Checkout Session and returns the URL
 */

import { NextRequest } from "next/server";
import { getStripe, CREDIT_PACKS, PREMIUM_PLANS } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { contractorId, itemType, itemId, successUrl, cancelUrl } = await req.json();

    const stripe = getStripe();
    if (!stripe) {
      return Response.json({ error: "Stripe not configured" }, { status: 500 });
    }

    if (!contractorId || !itemType || !itemId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch contractor to get email and name
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      select: { id: true, businessName: true, email: true },
    });

    if (!contractor || !contractor.email) {
      return Response.json({ error: "Contractor not found or missing email" }, { status: 404 });
    }

    // Determine what we're selling
    let lineItems: any[] = [];
    let mode: "payment" | "subscription" = "payment";
    let metadata: Record<string, string> = { contractorId, type: itemType };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const returnUrl = successUrl || `${baseUrl}/contractor/dashboard?checkout=success`;
    const cancelUrlFinal = cancelUrl || `${baseUrl}/contractor/dashboard?checkout=cancelled`;

    if (itemType === "credits") {
      // Find the credit pack
      const pack = CREDIT_PACKS.find((p) => p.id === itemId);
      if (!pack) {
        return Response.json({ error: "Invalid credit pack" }, { status: 400 });
      }

      lineItems = [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `${pack.credits} Lead Credits`,
            description: `${pack.credits} lead credits for Heat Pump Network`,
          },
          unit_amount: pack.priceCents,
        },
        quantity: 1,
      }];

      metadata = { ...metadata, credits: pack.credits.toString(), packId: pack.id };
      mode = "payment";
    } else if (itemType === "premium") {
      // Subscription plans
      const plan = PREMIUM_PLANS.find((p) => p.id === itemId);
      if (!plan) {
        return Response.json({ error: "Invalid premium plan" }, { status: 400 });
      }

      lineItems = [{
        price_data: {
          currency: "usd",
          product_data: { name: plan.label, description: `Heat Pump Network ${plan.label}` },
          unit_amount: plan.priceCents,
          recurring: { interval: plan.interval },
        },
        quantity: 1,
      }];

      metadata = { ...metadata, planId: plan.id };
      mode = "subscription";
    } else if (itemType === "sponsored") {
      lineItems = [{
        price_data: {
          currency: "usd",
          product_data: { name: "Sponsored Placement", description: "Sponsored listing on Heat Pump Network" },
          unit_amount: 29900, // $299/mo default
          recurring: { interval: "month" },
        },
        quantity: 1,
      }];

      metadata = { ...metadata, sponsoredType: itemId };
      mode = "subscription";
    } else {
      return Response.json({ error: "Invalid item type" }, { status: 400 });
    }

    // Create or get Stripe customer
    const existingCustomers = await stripe.customers.list({
      email: contractor.email,
      limit: 1,
    });
    let customerId: string;

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: contractor.email,
        name: contractor.businessName,
        metadata: { contractorId },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      line_items: lineItems,
      metadata,
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrlFinal,
      allow_promotion_codes: true,
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error("[Stripe/Checkout] Error:", error);
    return Response.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
