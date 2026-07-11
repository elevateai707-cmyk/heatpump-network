/**
 * Monetisation & Advertising Disclosure
 * FTC compliance: transparent explanation of all revenue sources
 */

import type { Metadata } from "next";
import { DollarSign, CreditCard, BadgePercent, Star, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Monetisation & Advertising Disclosure",
  description:
    "Heat Pump Network's complete monetisation model explained transparently. We never charge for ranking or basic inclusion.",
};

const disclosureSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Monetisation & Advertising Disclosure",
  description:
    "Complete transparency on how Heat Pump Network generates revenue while maintaining search integrity.",
};

export default function MonetisationDisclosurePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(disclosureSchema) }}
      />

      <div className="container-content py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Monetisation & Advertising Disclosure
          </h1>
          <p className="text-lg text-text-muted mb-8">
            Heat Pump Network is committed to complete transparency. Here is
            exactly how we generate revenue and how it does — and does not —
            affect your experience.
          </p>

          {/* Revenue sources */}
          <div className="space-y-6 mb-12">
            {[
              {
                icon: DollarSign,
                title: "Lead Credits (Primary Revenue)",
                subtitle: "Pay-per-lead — no subscription needed",
                details: [
                  "Contractors purchase credit packs ($30-$80 per lead)",
                  "One credit is deducted for each qualified contact-form submission",
                  "No recurring subscription required to receive leads",
                  "Contractors only pay for leads they actually receive",
                  "Pricing is transparent and listed on the contractor dashboard",
                ],
                color: "text-primary",
              },
              {
                icon: Star,
                title: "Premium Profile Features",
                subtitle: "Optional monthly subscription — no ranking impact",
                details: [
                  "$49-$129/month for enhanced profile features",
                  "Includes: photo gallery, video embed, project timeline",
                  "Early access to high-intent leads (15-minute head start)",
                  "Advanced dashboard analytics with CSV export",
                  "Priority phone and email support",
                  "CRITICAL: Premium profiles do NOT receive a ranking boost",
                ],
                color: "text-accent-dark",
              },
              {
                icon: BadgePercent,
                title: "Sponsored Placements",
                subtitle: "Clearly labelled and visually distinct from organic",
                details: [
                  "Flat monthly fee per city/category",
                  "Displayed with a yellow 'Sponsored' badge",
                  "Visually distinct card design with dashed border",
                  'Marked with rel="sponsored" for compliance',
                  "Does not affect organic search rankings in any way",
                  "Homeowners can always filter to show organic results only",
                ],
                color: "text-warning",
              },
              {
                icon: CreditCard,
                title: "Affiliate Links (Minimal)",
                subtitle: "Optional, fully disclosed",
                details: [
                  "Links to government and utility rebate programs",
                  "Full disclosure on every affiliate link",
                  'Marked with rel="noopener nofollow"',
                  "No misleading language or fake urgency",
                  "No affiliate links in editorial content or tool results",
                ],
                color: "text-text-muted",
              },
            ].map((item) => (
              <div key={item.title} className="card-base p-6">
                <div className="flex items-start gap-4">
                  <item.icon className={`h-8 w-8 shrink-0 ${item.color}`} />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">
                      {item.title}
                    </h2>
                    <p className="text-sm text-primary mb-3">
                      {item.subtitle}
                    </p>
                    <ul className="space-y-1.5">
                      {item.details.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-sm text-text-muted"
                        >
                          <span className="text-primary mt-1.5">•</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* What we DO NOT do */}
          <div className="bg-danger/5 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-danger">
              What We Do NOT Do
            </h2>
            <ul className="space-y-2">
              {[
                "Accept payment for ranking position in organic search results",
                "Allow premium subscribers to bypass verification requirements",
                "Sell homeowner data or contact information",
                "Charge homeowners any fees for using the platform",
                "Display fake reviews or pay for testimonials",
                "Use dark patterns or deceptive interfaces",
                "Claim guaranteed energy savings or payback periods",
                "Generate AI content without admin review",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-danger font-bold shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* FTC compliance */}
          <div className="bg-surface-muted rounded-xl p-6">
            <h2 className="text-lg font-bold mb-3">
              FTC & Google Compliance
            </h2>
            <p className="text-sm text-text-muted mb-3">
              Our monetisation model is designed to comply fully with:
            </p>
            <ul className="space-y-1.5 text-sm text-text-muted">
              <li>
                • FTC Guidelines on Endorsements and Testimonials (16 CFR Part 255)
              </li>
              <li>
                • FTC Native Advertising Guidelines (Enforcement Policy Statement)
              </li>
              <li>
                • Google Webmaster Quality Guidelines (no link schemes, no paid links passing PageRank)
              </li>
              <li>• Google E-E-A-T requirements for YMYL websites</li>
              <li>• CAN-SPAM Act for all lead-related email communications</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
