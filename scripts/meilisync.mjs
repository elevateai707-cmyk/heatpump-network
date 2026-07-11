/**
 * Meilisearch sync script
 * Run manually to re-index all verified contractors
 * Usage: npx tsx scripts/meilisync.mjs
 */

import "dotenv/config";

// Dynamic import for ESM compatibility
async function main() {
  console.log("[MeiliSync] Starting full re-index...");
  
  const { reindexAllContractors } = await import("../src/lib/meili-sync");
  const { initializeMeiliIndexes } = await import("../src/lib/meilisearch");

  try {
    // First ensure indexes exist with correct settings
    await initializeMeiliIndexes();
    
    // Then re-index all contractors
    const { indexed, errors } = await reindexAllContractors();
    
    console.log(`[MeiliSync] Complete: ${indexed} indexed, ${errors} errors`);
    process.exit(errors > 0 ? 1 : 0);
  } catch (error) {
    console.error("[MeiliSync] Fatal error:", error);
    process.exit(1);
  }
}

main();
