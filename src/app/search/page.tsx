/**
 * Search Page — Server component wrapper with Suspense
 * The actual search logic lives in SearchContent (client component)
 */

import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Heat Pump Installers Near You",
  description:
    "Search and compare verified heat pump contractors. Filter by location, rating, and services. Get free quotes from top-rated installers.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-muted">
          <div className="container-content py-6">
            <div className="h-12 w-full skeleton rounded-lg mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-base p-5">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl skeleton shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-48 skeleton rounded" />
                      <div className="h-3 w-64 skeleton rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

import { SearchContent } from "./search-content";
