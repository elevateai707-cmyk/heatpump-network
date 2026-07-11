/**
 * Contractor Dashboard (server component wrapper)
 * Lead management, profile editing, credit balance, subscription
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardClient from "./dashboard-client";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Contractor Dashboard",
  description: "Manage your profile, leads, credits, and subscription.",
};

// robots noindex for authenticated pages
export const dynamic = "force-dynamic";

export default async function ContractorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "CONTRACTOR_ADMIN") {
    redirect("/");
  }

  // Fetch contractor data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      contractor: {
        include: {
          serviceAreas: true,
          subscriptions: {
            where: { status: "ACTIVE" },
            take: 1,
          },
          _count: {
            select: {
              leads: { where: { status: { not: "SPAM" } } },
              caseStudies: { where: { isPublished: true } },
              reviews: { where: { status: "APPROVED" } },
            },
          },
        },
      },
    },
  });

  const contractor = user?.contractor;

  if (!contractor) {
    redirect("/contractor/setup");
  }

  // Get recent leads
  const recentLeads = await prisma.lead.findMany({
    where: { contractorId: contractor.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <DashboardClient
      contractor={JSON.parse(JSON.stringify(contractor))}
      recentLeads={JSON.parse(JSON.stringify(recentLeads))}
    />
  );
}
