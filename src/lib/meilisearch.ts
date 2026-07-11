/**
 * Meilisearch client and sync utilities
 * Provides instant full-text search with geo-filtering for listings
 */

import { MeiliSearch } from "meilisearch";

const MEILI_HOST = process.env.MEILISEARCH_HOST || "http://localhost:7700";
const MEILI_KEY = process.env.MEILI_MASTER_KEY || "masterKey";

let client: MeiliSearch | null = null;

export function getMeiliClient(): MeiliSearch {
  if (!client) {
    client = new MeiliSearch({
      host: MEILI_HOST,
      apiKey: MEILI_KEY,
    });
  }
  return client;
}

/**
 * Index settings for the 'contractors' index
 */
const CONTRACTOR_INDEX_SETTINGS = {
  searchableAttributes: [
    "businessName",
    "description",
    "tagline",
    "city",
    "state",
    "serviceBrands",
    "certifications",
    "searchableText",
  ],
  filterableAttributes: [
    "city",
    "state",
    "isVerified",
    "isPremium",
    "averageRating",
    "verificationStatus",
    "serviceBrands",
    "certifications",
    "_geo", // geo coordinates
  ],
  sortableAttributes: ["averageRating", "responseRate", "createdAt", "_geo"],
  rankingRules: [
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness",
  ],
};

/**
 * Initialize Meilisearch indexes on startup
 */
export async function initializeMeiliIndexes(): Promise<void> {
  const meili = getMeiliClient();

  try {
    // Create or update the contractors index
    const index = meili.index("contractors");
    await index.updateSettings(CONTRACTOR_INDEX_SETTINGS);
    console.log("[Meilisearch] Contractors index initialized");

    // Create or update listings index
    await meili.createIndex("listings", { primaryKey: "id" }).catch(() => {});
    console.log("[Meilisearch] Listings index initialized");
  } catch (error) {
    console.error("[Meilisearch] Initialization error:", error);
    // Don't crash on Meilisearch failure — the app works with fallback DB search
  }
}

/**
 * Sync a contractor document to Meilisearch
 */
export async function syncContractorToMeili(
  contractor: Record<string, any>
): Promise<void> {
  try {
    const meili = getMeiliClient();
    const document = {
      id: contractor.id,
      businessName: contractor.businessName,
      slug: contractor.slug,
      description: contractor.description,
      tagline: contractor.tagline,
      city: contractor.city,
      state: contractor.state,
      isVerified: contractor.isVerified,
      isPremium: contractor.isPremium,
      averageRating: contractor.averageRating,
      responseRate: contractor.responseRate,
      verificationStatus: contractor.verificationStatus,
      serviceBrands: contractor.serviceBrands,
      certifications: contractor.certifications,
      searchableText: contractor.searchableText,
      logoUrl: contractor.logoUrl,
      coverImageUrl: contractor.coverImageUrl,
      phone: contractor.phone,
      website: contractor.website,
      reviewCount: contractor.reviewCount,
      badgeOfExcellence: contractor.badgeOfExcellence,
      _geo: contractor.latitude && contractor.longitude
        ? { lat: contractor.latitude, lng: contractor.longitude }
        : undefined,
    };

    await meili.index("contractors").addDocuments([document]);
  } catch (error) {
    console.error(
      `[Meilisearch] Sync error for contractor ${contractor.id}:`,
      error
    );
  }
}

/**
 * Remove a contractor document from Meilisearch
 */
export async function removeContractorFromMeili(
  contractorId: string
): Promise<void> {
  try {
    const meili = getMeiliClient();
    await meili.index("contractors").deleteDocument(contractorId);
  } catch (error) {
    console.error(
      `[Meilisearch] Delete error for contractor ${contractorId}:`,
      error
    );
  }
}

/**
 * Search contractors with faceted filters
 */
export async function searchContractors(params: {
  query?: string;
  city?: string;
  state?: string;
  serviceBrand?: string;
  minRating?: number;
  isVerified?: boolean;
  isPremium?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sort?: string;
  page?: number;
  hitsPerPage?: number;
}) {
  try {
    const meili = getMeiliClient();

    // Build filter string
    const filters: string[] = [];
    if (params.city) filters.push(`city = "${params.city}"`);
    if (params.state) filters.push(`state = "${params.state}"`);
    if (params.isVerified !== undefined)
      filters.push(`isVerified = ${params.isVerified}`);
    if (params.isPremium !== undefined)
      filters.push(`isPremium = ${params.isPremium}`);
    if (params.minRating)
      filters.push(`averageRating >= ${params.minRating}`);
    if (params.serviceBrand)
      filters.push(`serviceBrands = "${params.serviceBrand}"`);

    const filter = filters.length > 0 ? filters.join(" AND ") : undefined;

    // Build geo filter
    const geo =
      params.lat && params.lng && params.radiusKm
        ? {
            lat: params.lat,
            lng: params.lng,
            radiusInKm: params.radiusKm,
          }
        : undefined;

    const result = await meili.index("contractors").search(params.query || "", {
      filter,
      sort: params.sort ? [params.sort] : undefined,
      page: params.page || 1,
      hitsPerPage: params.hitsPerPage || 20,
      ...(geo ? { geoRadius: geo } : {}),
    });

    return result;
  } catch (error) {
    console.error("[Meilisearch] Search error:", error);
    return { hits: [], totalHits: 0, hitsPerPage: 20, page: 1 };
  }
}
