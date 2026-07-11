/**
 * Search Results Content — Client Component
 * Faceted search with map toggle, sponsored placements, JSON-LD
 * Wrapped in Suspense by parent page.tsx
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Map, List, SlidersHorizontal, Star, Shield, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/components/search/search-filters";
import { ContractorCard } from "@/components/search/contractor-card";
import { SponsoredCard } from "@/components/search/sponsored-card";
import { SkeletonCard } from "@/components/search/skeleton-card";

interface SearchResult {
  id: string;
  businessName: string;
  slug: string;
  tagline?: string;
  city: string;
  state: string;
  logoUrl?: string;
  averageRating: number;
  reviewCount: number;
  isVerified: boolean;
  isPremium: boolean;
  badgeOfExcellence: boolean;
  phone?: string;
  responseRate: number;
  serviceBrands: string;
  certifications: string;
  yearsInBusiness?: number;
  responseTime?: string;
}

export function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [sponsored, setSponsored] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(searchParams.get("location") || "");

  const limit = 20;

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      const loc = searchParams.get("location");
      if (loc) params.set("city", loc);
      const st = searchParams.get("state");
      if (st) params.set("state", st);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      const sort = searchParams.get("sort");
      if (sort) params.set("sort", sort);
      const rating = searchParams.get("minRating");
      if (rating) params.set("minRating", rating);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.results || []);
      setSponsored(data.sponsored || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, [query, searchParams, page]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("location", query);
    } else {
      params.delete("location");
    }
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  }

  const totalPages = Math.ceil(total / limit);

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `Heat Pump Installers${query ? ` near ${query}` : ""}`,
    description: `Find verified heat pump contractors and installers${query ? ` in ${query}` : ""}. Compare reviews, ratings, and certifications.`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }}
      />

      <div className="min-h-[80vh] bg-surface-muted">
        <div className="container-content py-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by city, ZIP, or contractor name..."
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-white text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </div>
          </form>

          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">
                {query ? `Heat Pump Installers near ${query}` : "All Heat Pump Installers"}
              </h1>
              {!loading && (
                <p className="text-sm text-text-muted">
                  {total} contractor{total !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              <Button
                variant={showMap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? <List className="h-4 w-4" /> : <Map className="h-4 w-4" />}
                {showMap ? "List" : "Map"}
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters sidebar */}
            {showFilters && (
              <div className="w-64 shrink-0 hidden md:block">
                <SearchFilters
                  currentSort={searchParams.get("sort") || "relevance"}
                  currentRating={searchParams.get("minRating") || ""}
                  onSortChange={(s) => updateFilter("sort", s)}
                  onRatingChange={(r) => updateFilter("minRating", r)}
                />
              </div>
            )}

            {/* Results area */}
            <div className="flex-1 min-w-0">
              {/* Mobile filters bar */}
              {showFilters && (
                <div className="md:hidden mb-4 p-4 card-base">
                  <SearchFilters
                    currentSort={searchParams.get("sort") || "relevance"}
                    currentRating={searchParams.get("minRating") || ""}
                    onSortChange={(s) => updateFilter("sort", s)}
                    onRatingChange={(r) => updateFilter("minRating", r)}
                  />
                </div>
              )}

              {/* Sponsored placements (clearly labelled) */}
              {sponsored.length > 0 && !showMap && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium bg-sponsored text-warning px-2 py-0.5 rounded-full">
                      Sponsored
                    </span>
                    <span className="text-xs text-text-muted">
                      Paid placements — clearly marked and separate from organic results
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {sponsored.map((s: any) => (
                      <SponsoredCard key={s.id} placement={s} />
                    ))}
                  </div>
                </div>
              )}

              {/* Loading skeletons */}
              {loading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* Results list */}
              {!loading && results.length === 0 && (
                <div className="card-base p-12 text-center">
                  <Search className="h-12 w-12 text-text-muted mx-auto mb-4" />
                  <h2 className="text-lg font-semibold mb-2">No contractors found</h2>
                  <p className="text-sm text-text-muted mb-4">
                    Try adjusting your filters or search for a different location.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      router.push("/search");
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}

              {/* Map view placeholder */}
              {showMap && (
                <div className="card-base h-[500px] mb-4 flex items-center justify-center bg-surface-muted">
                  <div className="text-center text-text-muted">
                    <Map className="h-12 w-12 mx-auto mb-2" />
                    <p>Map view requires Mapbox GL JS token</p>
                    <p className="text-xs mt-1">
                      Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local
                    </p>
                  </div>
                </div>
              )}

              {/* Contractor cards */}
              {!loading && !showMap && (
                <div className="space-y-4">
                  {results.map((contractor) => (
                    <ContractorCard key={contractor.id} contractor={contractor} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-text-muted px-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
