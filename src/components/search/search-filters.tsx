/**
 * Search Filters Component
 * Faceted filters for sort order, ratings, verification status
 */

"use client";

interface Props {
  currentSort: string;
  currentRating: string;
  onSortChange: (sort: string) => void;
  onRatingChange: (rating: string) => void;
}

const sortOptions = [
  { value: "relevance", label: "Best Match" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

const ratingOptions = [
  { value: "", label: "Any Rating" },
  { value: "4", label: "4+ Stars" },
  { value: "3", label: "3+ Stars" },
];

export function SearchFilters({
  currentSort,
  currentRating,
  onSortChange,
  onRatingChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Sort By</h3>
        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                currentSort === opt.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-surface-muted text-text-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Minimum Rating</h3>
        <div className="space-y-1">
          {ratingOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onRatingChange(opt.value)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                currentRating === opt.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-surface-muted text-text-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter info */}
      <div className="border-t border-border pt-4">
        <p className="text-xs text-text-muted">
          Results are based on relevance, distance, rating, and verification
          quality. Sponsored placements are always clearly marked and do not
          affect organic ranking.
        </p>
      </div>
    </div>
  );
}
