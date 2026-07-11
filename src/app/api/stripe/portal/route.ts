/**
 * Stripe Customer Portal
 * POST /api/stripe/portal
 * Body: { contractorId }
 * Creates a Stripe Customer Portal session for managing subscriptions/billing
 */

import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { contractorId } = await req.json();

    const stripe = getStripe();
    if (!stripe) {
      return Response.json({ error: "Stripe not configured" }, { status: 500 });
    }

    if (!contractorId) {
      return Response.json({ error: "Missing contractorId" }, { status: 400 });
    }

    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      select: { email: true, businessName: true },
    });

    if (!contractor || !contractor.email) {
      return Response.json({ error: "Contractor not found" }, { status: 404 });
    }

    // Find or create Stripe customer
    const existing = await stripe.customers.list({ email: contractor.email, limit: 1 });
    const customerId = existing.data[0]?.id || (await stripe.customers.create({
      email: contractor.email,
      name: contractor.businessName,
      metadata: { contractorId },
    })).id;

    // Create portal session
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/contractor/dashboard?tab=subscription`,
    });

    return Response.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("[Stripe/Portal] Error:", error);
    return Response.json({ error: error.message || "Failed to create portal" }, { status: 500 });
  }
}
