/**
 * Admin API: Re-index all verified contractors to Meilisearch
 * POST /api/admin/reindex
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { reindexAllContractors } from "@/lib/meili-sync";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const result = await reindexAllContractors();
    return Response.json(result);
  } catch (error) {
    console.error("[Admin/Reindex] Error:", error);
    return Response.json({ error: "Re-index failed" }, { status: 500 });
  }
}
