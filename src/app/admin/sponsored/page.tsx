/**
 * Admin — Sponsored Placement Management
 * Create, pause, expire sponsored placements
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SponsoredClient from "./sponsored-client";

export const metadata = { title: "Admin — Sponsored Placements" };
export const dynamic = "force-dynamic";

export default async function SponsoredPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    redirect("/auth/signin");
  }

  const placements = await prisma.sponsoredPlacement.findMany({
    orderBy: [{ isActive: "desc" }, { endsAt: "asc" }],
    include: {
      contractor: { select: { businessName: true, slug: true, email: true } },
    },
  });

  const contractors = await prisma.contractor.findMany({
    where: { isVerified: true },
    select: { id: true, businessName: true, city: true, state: true },
    orderBy: { businessName: "asc" },
  });

  return (
    <SponsoredClient
      placements={JSON.parse(JSON.stringify(placements))}
      contractors={JSON.parse(JSON.stringify(contractors))}
    />
  );
}
