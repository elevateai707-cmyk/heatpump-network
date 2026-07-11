/**
 * Contractor Card — Search Result
 * Displays contractor info, rating, badges, and action buttons
 * Links to the contractor's profile page
 */

import Link from "next/link";
import {
  Star,
  Shield,
  BadgeCheck,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPhone } from "@/lib/utils";

interface Props {
  contractor: any;
}

export function ContractorCard({ contractor }: Props) {
  // Parse JSON fields
  let serviceBrands: string[] = [];
  let certifications: string[] = [];
  try {
    serviceBrands = JSON.parse(contractor.serviceBrands || "[]");
  } catch {}
  try {
    certifications = JSON.parse(contractor.certifications || "[]");
  } catch {}

  return (
    <div className="card-base group">
      <div className="p-5 flex gap-4">
        {/* Logo */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl border border-border overflow-hidden shrink-0 bg-white">
          {contractor.logoUrl ? (
            <img
              src={contractor.logoUrl}
              alt={`${contractor.businessName} logo`}
              className="w-full h-full object-contain p-1"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {contractor.businessName?.charAt(0) || "?"}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/pro/${contractor.slug}`}
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {contractor.businessName}
              </Link>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Badges */}
                {contractor.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                    <Shield className="h-3 w-3" />
                    Verified
                  </span>
                )}
                {contractor.badgeOfExcellence && (
                  <span className="badge-excellence text-[10px] px-1.5 py-0.5">
                    <BadgeCheck className="h-2.5 w-2.5 inline" /> Excellence
                  </span>
                )}
                {contractor.isPremium && (
                  <span className="badge-premium text-[10px] px-1.5 py-0.5">
                    Premium
                  </span>
                )}
              </div>
            </div>

            {/* Rating */}
            {contractor.averageRating > 0 && (
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold">
                    {contractor.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  {contractor.reviewCount} review
                  {contractor.reviewCount !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          {contractor.tagline && (
            <p className="text-sm text-text-muted mt-1 line-clamp-1">
              {contractor.tagline}
            </p>
          )}

          {/* Location & phone */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {contractor.city}, {contractor.state}
            </span>
            {contractor.phone && (
              <a
                href={`tel:${contractor.phone}`}
                className="flex items-center gap-1 hover:text-primary"
              >
                <Phone className="h-3 w-3" />
                {formatPhone(contractor.phone)}
              </a>
            )}
            <span>
              Response rate: {contractor.responseRate}%
            </span>
          </div>

          {/* Tags */}
          {(serviceBrands.length > 0 || certifications.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {serviceBrands.slice(0, 3).map((brand) => (
                <span
                  key={brand}
                  className="text-[10px] px-2 py-0.5 bg-primary/5 text-primary rounded-full border border-primary/10"
                >
                  {brand}
                </span>
              ))}
              {certifications.slice(0, 2).map((cert) => (
                <span
                  key={cert}
                  className="text-[10px] px-2 py-0.5 bg-secondary/5 text-secondary rounded-full border border-secondary/10"
                >
                  {cert}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link href={`/pro/${contractor.slug}`}>
            <Button variant="ghost" size="sm">
              View Profile <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
