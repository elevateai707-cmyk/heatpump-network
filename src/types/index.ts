/**
 * Shared TypeScript types for the Heat Pump Network
 */

// Search parameters
export interface SearchParams {
  query?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sort?: "relevance" | "rating" | "distance" | "newest";
  minRating?: number;
  isVerified?: boolean;
  isPremium?: boolean;
  page?: number;
  limit?: number;
}

// Search result item
export interface ContractorResult {
  id: string;
  businessName: string;
  slug: string;
  tagline: string | null;
  city: string;
  state: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  averageRating: number;
  reviewCount: number;
  isVerified: boolean;
  isPremium: boolean;
  badgeOfExcellence: boolean;
  phone: string | null;
  website: string | null;
  responseRate: number;
  distance?: number;
  serviceBrands: string[];
  certifications: string[];
}

// Lead submission payload
export interface LeadSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  streetAddress?: string;
  city: string;
  state: string;
  zipCode: string;
  projectType?: string;
  homeSize?: number;
  currentHeating?: string;
  currentCooling?: string;
  preferredTimeline?: string;
  contactMethod?: string;
  contractorIds?: string[]; // for multi-quote requests
}

// Rebate program display type
export interface RebateProgramBrief {
  id: string;
  name: string;
  provider: string;
  providerName: string | null;
  state: string;
  programType: string;
  amountDescription: string;
  amountMin: number | null;
  amountMax: number | null;
  equipmentTypes: string[];
  description: string;
  expirationDate: Date | null;
  isActive: boolean;
}

// Case study brief for listing cards
export interface CaseStudyBrief {
  id: string;
  title: string;
  slug: string;
  summary: string;
  estimatedAnnualSavings: number | null;
  equipmentType: string | null;
  featuredImage: string | null;
}

// Climate zone data
export interface ClimateZone {
  zone: string;
  description: string;
  averageWinterTemp: number;
  averageSummerTemp: number;
  recommendedHSPF: number;
  recommendedSEER: number;
}

// Calculator result
export interface HeatPumpEstimate {
  recommendedCapacity: string; // "3-ton"
  estimatedCost: {
    low: number;
    high: number;
    average: number;
  };
  estimatedAnnualSavings: number;
  paybackYears: number;
  rebatesAvailable: RebateProgramBrief[];
  hspfRating: number;
  seerRating: number;
}

// Sponsored placement
export interface SponsoredPlacementBrief {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  contractor: {
    businessName: string;
    slug: string;
    logoUrl: string | null;
  };
  placementType: string;
}
