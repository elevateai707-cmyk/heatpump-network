/**
 * Sizing Estimator Page — /sizing-estimator
 * Interactive heat pump sizing and cost tool
 */

import type { Metadata } from "next";
import { SizingEstimator } from "@/components/tools/sizing-estimator";

export const metadata: Metadata = {
  title: "Heat Pump Sizing & Cost Estimator",
  description:
    "Get an estimated heat pump size, installation cost, and energy savings for your home. Based on home size, climate zone, and current heating system.",
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Heat Pump Sizing & Cost Estimator",
  description: "Estimate the right heat pump size for your home and get cost projections.",
};

export default function SizingEstimatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />

      <div className="container-content py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Heat Pump Sizing & Cost Estimator
            </h1>
            <p className="text-lg text-text-muted max-w-2xl">
              Get an estimated heat pump size and installation cost based on
              your home&apos;s square footage, climate zone, and current
              heating system. Always get a professional Manual J calculation
              for accurate sizing.
            </p>
          </div>

          <SizingEstimator />

          <div className="mt-12 card-base p-6">
            <h2 className="text-xl font-bold mb-4">
              Sizing FAQ
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">
                  Why is proper sizing important?
                </h3>
                <p className="text-sm text-text-muted">
                  An oversized heat pump will cycle on and off frequently,
                  reducing efficiency and comfort. An undersized unit will run
                  constantly and struggle to maintain temperature, especially
                  in extreme weather. Proper sizing ensures optimal
                  efficiency, comfort, and equipment longevity.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  What is a Manual J calculation?
                </h3>
                <p className="text-sm text-text-muted">
                  Manual J is the industry-standard method for calculating
                  heating and cooling loads. It considers home size, window
                  area, insulation levels, air leakage, climate, and more.
                  Every reputable contractor should perform a Manual J
                  calculation before recommending equipment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  Do I need a cold-climate heat pump?
                </h3>
                <p className="text-sm text-text-muted">
                  If you live in an area where winter temperatures regularly
                  drop below 20°F (-7°C), a cold-climate heat pump is
                  recommended. These units maintain full heating capacity at
                  much lower temperatures than standard heat pumps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
