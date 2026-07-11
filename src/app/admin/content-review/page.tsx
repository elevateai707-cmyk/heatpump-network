/**
 * Admin — Content Review Queue
 * AI-generated content (meta, intros, guides, FAQs) awaiting admin approval
 * No unedited AI text is publicly visible
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ContentReviewClient from "./content-review-client";

export const metadata = { title: "Admin — Content Review Queue" };
export const dynamic = "force-dynamic";

export default async function ContentReviewPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    redirect("/auth/signin");
  }

  const pending = await prisma.contentReviewItem.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  const recent = await prisma.contentReviewItem.findMany({
    where: { status: { not: "PENDING" } },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return (
    <ContentReviewClient
      pending={JSON.parse(JSON.stringify(pending))}
      recent={JSON.parse(JSON.stringify(recent))}
    />
  );
}
