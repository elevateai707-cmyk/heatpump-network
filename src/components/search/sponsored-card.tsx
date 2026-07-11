/**
 * Sponsored Placement Card
 * Visually distinct from organic results with dashed border and "Sponsored" badge
 * rel="sponsored" marked links
 */

import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  placement: any;
}

export function SponsoredCard({ placement }: Props) {
  const contractor = placement.contractor;

  if (!contractor) return null;

  return (
    <div className="card-base sponsored-border relative">
      {/* Sponsored badge */}
      <div className="absolute top-2 right-2 z-10">
        <span
          className="text-[10px] font-bold bg-warning text-white px-2 py-0.5 rounded-full uppercase tracking-wider"
          title="Paht, clearly labelled sponsored placement"
        >
          Sponsored
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg border border-border overflow-hidden shrink-0 bg-white">
            {contractor.logoUrl ? (
              <img
                src={contractor.logoUrl}
                alt={`${contractor.businessName} logo`}
                className="w-full h-full object-contain p-0.5"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {contractor.businessName?.charAt(0) || "?"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/pro/${contractor.slug}`}
              rel="sponsored"
              className="font-semibold text-sm hover:text-primary transition-colors"
            >
              {contractor.businessName}
            </Link>
            {contractor.averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="font-medium">
                  {contractor.averageRating.toFixed(1)}
                </span>
                <span>
                  ({contractor.reviewCount})
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {contractor.city}, {contractor.state}
        </p>

        {placement.title && (
          <p className="text-sm font-medium mb-2">{placement.title}</p>
        )}
        {placement.description && (
          <p className="text-xs text-text-muted mb-3 line-clamp-2">
            {placement.description}
          </p>
        )}

        <Link href={`/pro/${contractor.slug}`} rel="sponsored">
          <Button variant="sponsored" size="sm" className="w-full text-xs">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
