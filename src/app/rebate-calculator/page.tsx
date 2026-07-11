/**
 * Rebate Calculator Page — /rebate-calculator
 * Interactive rebate eligibility tool with JSON-LD
 */

import type { Metadata } from "next";
import { RebateCalculator } from "@/components/tools/rebate-calculator";

export const metadata: Metadata = {
  title: "Heat Pump Rebate Calculator — Check Your Eligibility",
  description:
    "Find out how much you could save on a heat pump installation. Check federal tax credits, state rebates, and utility incentives based on your location and income.",
  openGraph: {
    title: "Heat Pump Rebate Calculator",
    description: "Check your eligibility for heat pump rebates and tax credits.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Heat Pump Rebate Calculator",
  description: "Interactive tool to estimate heat pump rebate eligibility based on ZIP code, income, and current heating system.",
  browserFeatures: ["HTML5"],
  operatingSystem: "All",
};

export default function RebateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />

      <div className="container-content py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Heat Pump Rebate Calculator
            </h1>
            <p className="text-lg text-text-muted max-w-2xl">
              Find out how much you could save with federal tax credits,
              state rebates, and utility incentives. Enter your ZIP code to
              get personalized estimates.
            </p>
          </div>

          <RebateCalculator />

          {/* Educational content */}
          <div className="mt-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Available Heat Pump Incentives
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="card-base p-5">
                  <h3 className="font-semibold mb-2">Federal Tax Credits</h3>
                  <p className="text-sm text-text-muted">
                    30% of installation cost, up to $2,000 per year. Available
                    through 2032. No income limit. Applies to ENERGY STAR
                    certified equipment.
                  </p>
                </div>
                <div className="card-base p-5">
                  <h3 className="font-semibold mb-2">State Rebates</h3>
                  <p className="text-sm text-text-muted">
                    Many states offer additional rebates ranging from $500 to
                    $15,000. Income-qualified households often receive
                    enhanced incentives.
                  </p>
                </div>
                <div className="card-base p-5">
                  <h3 className="font-semibold mb-2">Utility Incentives</h3>
                  <p className="text-sm text-text-muted">
                    Local electric and gas utilities often provide rebates and
                    special financing for heat pump installations. Check with
                    your utility provider.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
