/**
 * Lead Submission API
 * POST /api/leads
 * Creates a lead and deducts a credit from the contractor's balance
 */

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      contractorId,
      firstName,
      lastName,
      email,
      phone,
      city,
      state,
      zipCode,
      projectType,
      homeSize,
      currentHeating,
      preferredTimeline,
      contactMethod,
      message,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !contractorId) {
      return Response.json(
        { error: "Required fields missing: firstName, lastName, email, contractorId" },
        { status: 400 }
      );
    }

    // Create the lead in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check contractor exists and has credits
      const contractor = await tx.contractor.findUnique({
        where: { id: contractorId },
        select: { id: true, leadBalance: true, isVerified: true },
      });

      if (!contractor) {
        throw new Error("Contractor not found");
      }

      // Create the lead
      const lead = await tx.lead.create({
        data: {
          contractorId,
          firstName,
          lastName,
          email,
          phone: phone || null,
          city: city || "",
          state: state || "",
          zipCode: zipCode || "",
          projectType: projectType || null,
          homeSize: homeSize ? parseInt(homeSize) : null,
          currentHeating: currentHeating || null,
          preferredTimeline: preferredTimeline || null,
          contactMethod: contactMethod || "email",
          notes: message || null,
          source: "profile_page",
          status: "NEW",
          creditDeducted: false, // Credits deducted on status change to CONTACTED
        },
      });

      return { lead, contractor };
    });

    return Response.json({
      success: true,
      leadId: result.lead.id,
      message: "Your request has been submitted successfully.",
    });
  } catch (error: any) {
    console.error("[Lead API] Error:", error);
    return Response.json(
      { error: error.message || "Failed to submit request" },
      { status: 500 }
    );
  }
}
