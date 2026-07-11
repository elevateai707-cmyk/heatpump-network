/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 *
 * Handles:
 * - checkout.session.completed → credit purchase, subscription start
 * - customer.subscription.updated → premium/sponsored status sync
 * - customer.subscription.deleted → cancel premium/sponsored
 * - invoice.payment_succeeded → recurring payment confirmation
 */

import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return Response.json({ error: "Stripe not configured" }, { status: 500 });
    }
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") || "";

    let event: any;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("[Stripe/Webhook] Signature verification failed:", err.message);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await handleSubscriptionChange(event.data.object);
        break;
      }
      case "invoice.payment_succeeded": {
        await handleInvoicePaid(event.data.object);
        break;
      }
      default:
        console.log(`[Stripe/Webhook] Unhandled event: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error: any) {
    console.error("[Stripe/Webhook] Error:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

/**
 * Handle checkout.session.completed
 * - Credit packs: add credits to contractor balance
 * - Premium/sponsored: create/update subscription
 */
async function handleCheckoutCompleted(session: any) {
  const { contractorId, type, credits, packId, planId } = session.metadata || {};
  if (!contractorId) return;

  if (type === "credits" && credits) {
    const creditCount = parseInt(credits);
    const amount = session.amount_total || 0;

    await prisma.$transaction(async (tx) => {
      // Update contractor balance
      await tx.contractor.update({
        where: { id: contractorId },
        data: { leadBalance: { increment: creditCount } },
      });

      // Record transaction
      await tx.creditTransaction.create({
        data: {
          contractorId,
          type: "PURCHASE",
          amount: creditCount,
          balanceAfter: (
            await tx.contractor.findUnique({ where: { id: contractorId }, select: { leadBalance: true } })
          )?.leadBalance || creditCount,
          description: `Purchased ${creditCount} credits${packId ? ` (${packId})` : ""}`,
          stripePaymentIntentId: session.payment_intent,
          stripeInvoiceId: session.invoice,
        },
      });
    });

    console.log(`[Stripe] ${creditCount} credits added to contractor ${contractorId}`);
  }

  if ((type === "premium" || type === "sponsored") && session.subscription) {
    // Subscription started — will be handled by subscription webhook
    console.log(`[Stripe] Subscription created for contractor ${contractorId}: ${session.subscription}`);
  }
}

/**
 * Handle subscription changes
 * Syncs premium/sponsored status with local database
 */
async function handleSubscriptionChange(subscription: any) {
  const { contractorId, type } = subscription.metadata || {};
  if (!contractorId) return;

  const isActive = subscription.status === "active" || subscription.status === "trialing";
  const isCanceled = subscription.status === "canceled" || subscription.status === "incomplete_expired";

  if (type === "premium") {
    // Find existing subscription for this contractor
    const existing = await prisma.subscription.findFirst({
      where: { contractorId, stripeSubscriptionId: subscription.id },
    });

    if (existing) {
      // Update existing
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          status: isCanceled ? "CANCELED" : isActive ? "ACTIVE" : "PAST_DUE",
          currentPeriodStart: subscription.current_period_start
            ? new Date(subscription.current_period_start * 1000)
            : undefined,
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : undefined,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
    } else {
      // Create new
      await prisma.subscription.create({
        data: {
          contractorId,
          planType: "PREMIUM_MONTHLY",
          status: isActive ? "ACTIVE" : "PAST_DUE",
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items?.data?.[0]?.price?.id,
          currentPeriodStart: subscription.current_period_start
            ? new Date(subscription.current_period_start * 1000)
            : new Date(),
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date(),
        },
      });
    }

    // Update contractor premium status
    await prisma.contractor.update({
      where: { id: contractorId },
      data: {
        isPremium: isActive,
        premiumSince: isActive ? new Date() : undefined,
      },
    });

    console.log(`[Stripe] Premium ${isActive ? "activated" : "deactivated"} for ${contractorId}`);
  }
}

/**
 * Handle invoice payment success
 * Confirms recurring payments for premium/sponsored
 */
async function handleInvoicePaid(invoice: any) {
  console.log(`[Stripe] Invoice paid: ${invoice.id}, customer: ${invoice.customer}`);
}
