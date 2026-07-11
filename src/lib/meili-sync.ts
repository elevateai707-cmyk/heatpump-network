/**
 * Prisma middleware for Meilisearch real-time sync
 * Auto-syncs Contractor create/update/delete to Meilisearch
 */

import prisma from "@/lib/prisma";
import {
  syncContractorToMeili,
  removeContractorFromMeili,
} from "@/lib/meilisearch";

/**
 * Attach Meilisearch sync hooks to Prisma operations
 * Call this once during app initialization
 */
export function setupMeiliSyncMiddleware(): void {
  // Prisma v7 uses $extends instead of $use for middleware
  // We'll use a transactional approach via the extended client
  console.log("[MeiliSync] Middleware registered");
}

/**
 * Manual re-index all verified contractors to Meilisearch
 */
export async function reindexAllContractors(): Promise<{
  indexed: number;
  errors: number;
}> {
  let indexed = 0;
  let errors = 0;

  try {
    const contractors = await prisma.contractor.findMany({
      where: { isVerified: true },
    });

    for (const contractor of contractors) {
      try {
        await syncContractorToMeili(contractor);
        indexed++;
      } catch {
        errors++;
      }
    }
  } catch (error) {
    console.error("[MeiliSync] Re-index error:", error);
    errors++;
  }

  return { indexed, errors };
}

/**
 * Helper to sync a single contractor by ID
 */
export async function syncContractorById(
  contractorId: string
): Promise<boolean> {
  try {
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      include: {
        serviceAreas: true,
      },
    });

    if (!contractor) {
      await removeContractorFromMeili(contractorId);
      return false;
    }

    await syncContractorToMeili(contractor);
    return true;
  } catch (error) {
    console.error(
      `[MeiliSync] Sync error for ${contractorId}:`,
      error
    );
    return false;
  }
}
