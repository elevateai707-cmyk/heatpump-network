/**
 * Admin API: Create Sponsored Placement
 * POST /api/admin/sponsored
 */

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { contractorId, city, state, isGlobal, monthlyRateCents, startsAt, endsAt } = body;

    if (!contractorId || !startsAt || !endsAt) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const placement = await prisma.sponsoredPlacement.create({
      data: {
        contractorId,
        city: city || null,
        state: state || null,
        isGlobal: isGlobal || false,
        monthlyRateCents: monthlyRateCents || 29900,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        placementType: "FEATURED_CARD",
        isActive: true,
        autoRenew: false,
      },
    });

    return Response.json({ success: true, placement });
  } catch (error) {
    console.error("[Admin/Sponsored] Error:", error);
    return Response.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const placements = await prisma.sponsoredPlacement.findMany({
    orderBy: { createdAt: "desc" },
    include: { contractor: { select: { businessName: true } } },
  });

  return Response.json({ placements });
}
