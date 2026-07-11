/**
 * How We Verify Contractors
 * Transparency page — E-E-A-T compliance
 * Describes the complete verification process with JSON-LD
 */

import type { Metadata } from "next";
import { Shield, CheckCircle2, FileCheck, Star, Search, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "How We Verify Contractors",
  description:
    "Every contractor on Heat Pump Network is thoroughly verified. Learn about our multi-step verification process including license checks, insurance validation, and case study review.",
};

const verificationSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "How We Verify Contractors",
  description:
    "Heat Pump Network's contractor verification process ensures only qualified, insured, and licensed professionals are listed.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "How We Verify Contractors",
      },
    ],
  },
};

export default function HowWeVerifyPage() {
  const steps = [
    {
      icon: FileCheck,
      title: "License Verification",
      description:
        "Every contractor must provide a valid state-issued HVAC/trade license number. We verify it directly with the state licensing board.",
      detail:
        "We check that the license is current, in good standing, and matches the business name. Licenses must be renewed annually.",
    },
    {
      icon: Shield,
      title: "Insurance Validation",
      description:
        "Contractors upload their certificate of insurance. We verify general liability ($1M+) and workers' compensation coverage.",
      detail:
        "Insurance certificates are checked for current coverage periods and adequate limits. Expired or insufficient coverage results in profile suspension.",
    },
    {
      icon: Award,
      title: "Years in Business",
      description:
        "We require a minimum of 2 years in business with verifiable project history. Newer contractors can apply with references.",
      detail:
        "Business registration documents, tax records, or BBB accreditation are used to verify operational history.",
    },
    {
      icon: Search,
      title: "Case Study Review",
      description:
        "Contractors publish real project case studies with before/after photos and energy savings data.",
      detail:
        "Each case study is reviewed for authenticity. We may request additional documentation for large projects. Energy savings claims must be supported by utility bill analysis or Manual J calculations.",
    },
    {
      icon: CheckCircle2,
      title: "Background Check",
      description:
        "We check BBB ratings, state contractor board complaints, and online reputation.",
      detail:
        "A history of unresolved complaints, license suspensions, or fraudulent practices results in disqualification.",
    },
    {
      icon: Star,
      title: "Ongoing Monitoring",
      description:
        "Verification isn't a one-time event. We monitor license renewals, insurance expiry, and review quality continuously.",
      detail:
        "Contractors receive automated reminders 30 days before any credential expires. Profiles are automatically paused if verification lapses.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(verificationSchema) }}
      />

      <div className="container-content py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How We Verify Contractors
          </h1>
          <p className="text-lg text-text-muted">
            Trust is the foundation of Heat Pump Network. Every contractor on
            our platform undergoes a rigorous, multi-step verification process
            before they can receive leads. We never accept payment for
            verification status.
          </p>
        </div>

        {/* Verification steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((step) => (
            <div key={step.title} className="card-base p-6">
              <step.icon className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-lg font-semibold mb-2">{step.title}</h2>
              <p className="text-sm text-text-muted mb-3">
                {step.description}
              </p>
              <p className="text-sm text-text-muted/70">{step.detail}</p>
            </div>
          ))}
        </div>

        {/* Verification tiers */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6">Verification Tiers</h2>
          <div className="space-y-4">
            {[
              {
                tier: "Verified",
                color: "text-success",
                badge: "bg-success/10 text-success",
                desc: "Completed all verification steps. License, insurance, and case studies confirmed.",
              },
              {
                tier: "Badge of Excellence",
                color: "text-secondary",
                badge: "bg-secondary/10 text-secondary",
                desc: "Awarded to Verified contractors who exceed quality thresholds: 4.5+ rating, 20+ reviews, 10+ published case studies, 95%+ response rate.",
              },
              {
                tier: "Premium Profile",
                color: "text-warning",
                badge: "bg-warning/10 text-warning",
                desc: "Premium profiles have enhanced features (photo gallery, video, analytics) but NO ranking boost. Verification standards remain identical.",
              },
            ].map((tier) => (
              <div key={tier.tier} className="card-base p-5 flex items-start gap-4">
                <div className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${tier.badge}`}>
                  {tier.tier}
                </div>
                <p className="text-sm text-text-muted">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* No pay-for-ranking promise */}
        <div className="bg-primary/5 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-3">
            Our No Pay-for-Ranking Promise
          </h2>
          <p className="text-text-muted">
            Premium subscriptions, sponsored placements, and lead credit
            purchases do NOT affect organic search ranking. Search results are
            based entirely on: relevance to search query • proximity to the
            homeowner • verification level • average review rating • response
            rate and quality.
          </p>
          <p className="text-text-muted mt-3">
            Sponsored placements are clearly labelled and visually distinct from
            organic results. This is a contractual commitment, not just a
            promise.
          </p>
        </div>
      </div>
    </>
  );
}
