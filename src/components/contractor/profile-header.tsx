/**
 * Contractor Profile — Header Section
 * Logo, business name, rating, badges, quick info
 */

import { Star, Shield, BadgeCheck, MapPin, Phone, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPhone } from "@/lib/utils";
import Link from "next/link";

interface Props {
  contractor: any;
}

export function ProfileHeader({ contractor }: Props) {
  const isPremium = contractor.isPremium;
  // Parse JSON string fields
  let serviceBrands: string[] = [];
  try { serviceBrands = JSON.parse(contractor.serviceBrands || "[]"); } catch {}

  return (
    <div className="card-base">
      {/* Cover image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
        {contractor.coverImageUrl && (
          <img
            src={contractor.coverImageUrl}
            alt={`${contractor.businessName} cover`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-6 -mt-16 relative">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
            {contractor.logoUrl ? (
              <img
                src={contractor.logoUrl}
                alt={`${contractor.businessName} logo`}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                {contractor.businessName.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold profile-headline">
              {contractor.businessName}
            </h1>
            {contractor.tagline && (
              <p className="text-text-muted mt-1 profile-summary">{contractor.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-3">
              {/* Rating */}
              {contractor.reviewCount > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold">{contractor.averageRating.toFixed(1)}</span>
                  <span className="text-text-muted">
                    ({contractor.reviewCount} {contractor.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {/* Verification badges */}
              {contractor.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                  <Shield className="h-3 w-3" />
                  Verified
                </span>
              )}
              {contractor.badgeOfExcellence && (
                <span className="badge-excellence inline-flex items-center gap-1">
                  <BadgeCheck className="h-3 w-3" />
                  Badge of Excellence
                </span>
              )}
              {isPremium && (
                <span className="badge-premium inline-flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Premium Profile
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {contractor.phone && (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={`tel:${contractor.phone}`} className="hover:text-primary">
                {formatPhone(contractor.phone)}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <MapPin className="h-4 w-4 shrink-0" />
            {contractor.city}, {contractor.state}
          </div>
          {contractor.website && (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Globe className="h-4 w-4 shrink-0" />
              <a
                href={contractor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary truncate"
              >
                {new URL(contractor.website).hostname}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Clock className="h-4 w-4 shrink-0" />
            {contractor.responseTime || "Responds within 24 hours"}
          </div>
        </div>
      </div>
    </div>
  );
}
