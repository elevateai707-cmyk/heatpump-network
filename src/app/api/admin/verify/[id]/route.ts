/**
 * Admin API: Update contractor verification status
 * PATCH /api/admin/verify/[id]
 * Body: { status: VerificationStatus, isVerified: boolean }
 */

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { syncContractorById } from "@/lib/meili-sync";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { status, isVerified } = await req.json();

    const contractor = await prisma.contractor.update({
      where: { id },
      data: {
        verificationStatus: status,
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
      },
    });

    // Sync to Meilisearch if verified
    if (isVerified) {
      await syncContractorById(id);
    }

    return Response.json({ success: true, contractor });
  } catch (error) {
    console.error("[Admin/Verify] Error:", error);
    return Response.json({ error: "Failed to update verification" }, { status: 500 });
  }
}
