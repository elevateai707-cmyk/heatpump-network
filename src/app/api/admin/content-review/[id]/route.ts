/**
 * Admin API: Content Review
 * PATCH /api/admin/content-review/[id]
 * Body: { status: ContentReviewStatus, revisedContent?: string }
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
    const { status, revisedContent } = await req.json();

    const data: any = {
      status,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    };

    if (revisedContent) {
      data.revisedContent = revisedContent;
    }

    await prisma.contentReviewItem.update({ where: { id }, data });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Admin/ContentReview] Error:", error);
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }
}
