/**
 * Lead Status Update API
 * PATCH /api/leads/[id]/status
 * Body: { status: LeadStatus }
 * Deducts a credit when status changes to CONTACTED
 */

import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { status } = await req.json();

    // Get the lead
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        contractor: {
          include: {
            owner: { select: { id: true } },
          },
        },
      },
    });

    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    // Verify ownership
    if (lead.contractor?.owner?.id !== session.user.id && session.user.role !== "ADMIN") {
      return Response.json({ error: "Not authorized to update this lead" }, { status: 403 });
    }

    // If moving to CONTACTED and credit not yet deducted, deduct one credit
    if (status === "CONTACTED" && !lead.creditDeducted && lead.contractor) {
      const result = await prisma.$transaction(async (tx) => {
        const contractor = await tx.contractor.findUnique({
          where: { id: lead.contractorId! },
        });

        if (!contractor || contractor.leadBalance < 1) {
          throw new Error("Insufficient credit balance");
        }

        // Deduct credit
        await tx.contractor.update({
          where: { id: lead.contractorId! },
          data: { leadBalance: { decrement: 1 } },
        });

        // Record transaction
        await tx.creditTransaction.create({
          data: {
            contractorId: lead.contractorId!,
            type: "DEDUCTION",
            amount: -1,
            balanceAfter: contractor.leadBalance - 1,
            description: `Lead contact: ${lead.firstName} ${lead.lastName}`,
            leadId: lead.id,
          },
        });

        // Update lead
        const updated = await tx.lead.update({
          where: { id: lead.id },
          data: { status, creditDeducted: true, assignedAt: new Date() },
        });

        return updated;
      });

      return Response.json({ success: true, lead: result });
    }

    // Simple status update (no credit deduction needed)
    const updated = await prisma.lead.update({
      where: { id },
      data: {
        status,
        ...(status === "CONTACTED" ? { assignedAt: new Date() } : {}),
      },
    });

    return Response.json({ success: true, lead: updated });
  } catch (error: any) {
    console.error("[Lead/Status] Error:", error);
    return Response.json(
      { error: error.message || "Failed to update lead status" },
      { status: 500 }
    );
  }
}
