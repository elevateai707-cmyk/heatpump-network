/**
 * Contractor Profile Page — /pro/[slug]
 * Full E-E-A-T compliance: license, insurance, case studies, reviews
 * JSON-LD: LocalBusiness (HVACBusiness), Service, FAQPage, Speakable, aggregateRating
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProfileHeader } from "@/components/contractor/profile-header";
import { ProfileAbout } from "@/components/contractor/profile-about";
import { ProfileCaseStudies } from "@/components/contractor/profile-case-studies";
import { ProfileReviews } from "@/components/contractor/profile-reviews";
import { ProfileLeadForm } from "@/components/contractor/profile-lead-form";
import { ProfileServiceAreas } from "@/components/contractor/profile-service-areas";
import { ProfileFAQs } from "@/components/contractor/profile-faqs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const contractor = await prisma.contractor.findUnique({
    where: { slug },
    select: { businessName: true, tagline: true, city: true, state: true, description: true },
  });

  if (!contractor) return { title: "Contractor Not Found" };

  return {
    title: `${contractor.businessName} — Heat Pump Installer in ${contractor.city}, ${contractor.state}`,
    description:
      contractor.tagline ||
      `Verified heat pump contractor serving ${contractor.city}, ${contractor.state}. View case studies, reviews, and request a quote.`,
    openGraph: {
      title: `${contractor.businessName} | Heat Pump Network`,
      description: `Verified heat pump installer in ${contractor.city}, ${contractor.state}.`,
    },
  };
}

export default async function ContractorProfilePage({ params }: Props) {
  const { slug } = await params;

  const contractor = await prisma.contractor.findUnique({
    where: { slug },
    include: {
      serviceAreas: true,
      caseStudies: {
        where: { isPublished: true, adminApproved: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      qas: {
        where: { status: "APPROVED" },
        take: 10,
      },
    },
  });

  if (!contractor) notFound();

  // Parse JSON string fields
  const serviceBrands = safeJsonParse<string[]>(contractor.serviceBrands, []);
  const certifications = safeJsonParse<string[]>(contractor.certifications, []);
  const photoGallery = safeJsonParse<string[]>(contractor.photoGallery, []);

  // Build structured data
  const jsonLd = buildProfileSchema(contractor, serviceBrands, certifications);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-content py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content — 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileHeader contractor={contractor} />
            <ProfileAbout
              contractor={contractor}
              serviceBrands={serviceBrands}
              certifications={certifications}
            />
            <ProfileServiceAreas areas={contractor.serviceAreas} />
            <ProfileCaseStudies caseStudies={contractor.caseStudies} />
            <ProfileReviews reviews={contractor.reviews} />
            <ProfileFAQs qas={contractor.qas} contractorName={contractor.businessName} />
          </div>

          {/* Sidebar — 1/3 width */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <ProfileLeadForm contractor={contractor} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function safeJsonParse<T>(jsonStr: string, fallback: T): T {
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}

function buildProfileSchema(
  contractor: any,
  serviceBrands: string[],
  certifications: string[]
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://heatpump.network";
  const profileUrl = `${siteUrl}/pro/${contractor.slug}`;

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: contractor.businessName,
    description: contractor.description,
    url: contractor.website || profileUrl,
    telephone: contractor.phone,
    email: contractor.email,
    image: contractor.logoUrl || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: contractor.addressLine1 || undefined,
      addressLocality: contractor.city,
      addressRegion: contractor.state,
      postalCode: contractor.zipCode,
      addressCountry: "US",
    },
    geo: contractor.latitude && contractor.longitude
      ? {
          "@type": "GeoCoordinates",
          latitude: contractor.latitude,
          longitude: contractor.longitude,
        }
      : undefined,
    areaServed: contractor.serviceAreas?.map((a: any) => ({
      "@type": "City",
      name: `${a.city}, ${a.state}`,
    })) || undefined,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Heat Pump Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Heat Pump Installation" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Heat Pump Repair" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mini-Split Installation" } },
      ],
    },
    knowsAbout: [...serviceBrands, ...certifications].slice(0, 10),
    foundingDate: contractor.createdAt ? new Date(contractor.createdAt).getFullYear().toString() : undefined,
    priceRange: "$$",
    openingHoursSpecification: contractor.businessHours
      ? parseBusinessHours(contractor.businessHours)
      : undefined,
  };

  // Add aggregateRating only when 5+ reviews
  if (contractor.reviewCount >= 5 && contractor.averageRating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: contractor.averageRating,
      reviewCount: contractor.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  // Add Speakable for voice/AEO
  schema.speakable = {
    "@type": "SpeakableSpecification",
    cssSelector: [".profile-headline", ".profile-summary"],
  };

  return schema;
}

function parseBusinessHours(hoursJson: string): any[] | undefined {
  try {
    const hours = JSON.parse(hoursJson);
    if (Array.isArray(hours)) return hours;
    return Object.entries(hours).map(([day, h]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day,
      opens: (h as any).open || "09:00",
      closes: (h as any).close || "17:00",
    }));
  } catch {
    return undefined;
  }
}
