/**
 * Search API endpoint
 * GET /api/search?query=...&city=...&state=...&lat=...&lng=...&radius=...&page=...
 * Returns contractors + sponsored placements
 * Uses Meilisearch if available, falls back to Prisma DB search
 */

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { searchContractors } from "@/lib/meilisearch";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "50";
  const minRating = searchParams.get("minRating");
  const sort = searchParams.get("sort") || "relevance";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    // Try Meilisearch first for fast faceted search
    const meiliResults = await searchContractors({
      query: query || undefined,
      city: city || undefined,
      state: state || undefined,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      radiusKm: parseInt(radius),
      minRating: minRating ? parseFloat(minRating) : undefined,
      sort: sort === "rating" ? "averageRating:desc" : undefined,
      page,
      hitsPerPage: limit,
    });

    // Build sort for DB fallback
    let orderBy: any = { averageRating: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };
    if (sort === "rating") orderBy = { averageRating: "desc" };

    // If Meilisearch returned results, use them; otherwise fallback to DB
    let results;
    let totalCount = 0;

    if (meiliResults.hits.length > 0) {
      results = meiliResults.hits;
      totalCount = meiliResults.totalHits as number;
    } else {
      // DB fallback
      const dbResults = await prisma.contractor.findMany({
        where: {
          isVerified: true,
          ...(city ? { city: { contains: city } } : {}),
          ...(state ? { state } : {}),
          ...(minRating ? { averageRating: { gte: parseFloat(minRating) } } : {}),
          ...(query
            ? {
                OR: [
                  { businessName: { contains: query } },
                  { description: { contains: query } },
                  { city: { contains: query } },
                ],
              }
            : {}),
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      });

      const count = await prisma.contractor.count({
        where: {
          isVerified: true,
          ...(city ? { city: { contains: city } } : {}),
          ...(state ? { state } : {}),
          ...(query
            ? {
                OR: [
                  { businessName: { contains: query } },
                  { description: { contains: query } },
                  { city: { contains: query } },
                ],
              }
            : {}),
        },
      });

      results = dbResults;
      totalCount = count;
    }

    // Get sponsored placements for this location
    const sponsored = await prisma.sponsoredPlacement.findMany({
      where: {
        isActive: true,
        endsAt: { gte: new Date() },
        OR: [
          { isGlobal: true },
          ...(city ? [{ city }] : []),
          ...(state ? [{ state }] : []),
        ],
      },
      include: {
        contractor: {
          select: {
            businessName: true,
            slug: true,
            logoUrl: true,
            city: true,
            state: true,
            averageRating: true,
            reviewCount: true,
            isVerified: true,
            badgeOfExcellence: true,
          },
        },
      },
      take: 3,
    });

    return Response.json({
      results,
      sponsored,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("[Search API] Error:", error);
    return Response.json(
      { error: "Search failed", results: [], sponsored: [], total: 0, page: 1, limit, totalPages: 0 },
      { status: 500 }
    );
  }
}
