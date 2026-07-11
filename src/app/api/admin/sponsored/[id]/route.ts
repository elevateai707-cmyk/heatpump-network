/**
 * Admin API: Update Sponsored Placement
 * PATCH /api/admin/sponsored/[id]
 * Body: { isActive: boolean }
 */

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { isActive } = await req.json();

    await prisma.sponsoredPlacement.update({
      where: { id },
      data: { isActive },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Admin/Sponsored] Error:", error);
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }
}
