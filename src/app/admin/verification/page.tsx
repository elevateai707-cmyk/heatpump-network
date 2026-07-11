/**
 * Admin Verification Queue
 * Manage contractor verification requests
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import VerificationQueueClient from "./verification-client";

export const metadata = {
  title: "Admin — Verification Queue",
};

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
  const session = await getServerSession(authOptions);

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
  ) {
    redirect("/auth/signin");
  }

  // Fetch pending and under-review contractors
  const pendingContractors = await prisma.contractor.findMany({
    where: {
      verificationStatus: { in: ["PENDING", "DOCUMENTS_UPLOADED", "UNDER_REVIEW"] },
    },
    orderBy: [{ verificationStatus: "asc" }, { createdAt: "asc" }],
  });

  // Recently verified
  const recentlyVerified = await prisma.contractor.findMany({
    where: { verificationStatus: "VERIFIED" },
    orderBy: { verifiedAt: "desc" },
    take: 10,
  });

  return (
    <VerificationQueueClient
      pending={JSON.parse(JSON.stringify(pendingContractors))}
      recentlyVerified={JSON.parse(JSON.stringify(recentlyVerified))}
    />
  );
}
