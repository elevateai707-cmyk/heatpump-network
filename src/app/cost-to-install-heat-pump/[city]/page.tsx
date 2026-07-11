/**
 * Cost Estimator Page — /cost-to-install-heat-pump/[city]
 * Conversational query page: direct answer → cost table → in-depth guide
 * Featured snippet optimised
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Home, Thermometer } from "lucide-react";
import { getClimateZone, getRebatesByState, COST_ESTIMATES, CITY_CLIMATE_ZONES } from "@/data/rebates-fallback";

interface Props {
  params: Promise<{ city: string }>;
}

const CITY_NAMES: Record<string, { name: string; state: string; stateFull: string }> = {
  "portland": { name: "Portland", state: "OR", stateFull: "Oregon" },
  "seattle": { name: "Seattle", state: "WA", stateFull: "Washington" },
  "boston": { name: "Boston", state: "MA", stateFull: "Massachusetts" },
  "new-york": { name: "New York", state: "NY", stateFull: "New York" },
  "burlington": { name: "Burlington", state: "VT", stateFull: "Vermont" },
  "portland-me": { name: "Portland", state: "ME", stateFull: "Maine" },
  "minneapolis": { name: "Minneapolis", state: "MN", stateFull: "Minnesota" },
  "chicago": { name: "Chicago", state: "IL", stateFull: "Illinois" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const data = CITY_NAMES[city];
  if (!data) return { title: "City Not Found" };

  return {
    title: `Heat Pump Installation Cost in ${data.name}, ${data.state} — ${new Date().getFullYear()}`,
    description: `Average heat pump installation cost in ${data.name}, ${data.state}: $4,500–$16,000. Get detailed pricing for air-source, mini-split, and cold-climate heat pumps plus available rebates.`,
    openGraph: {
      title: `Heat Pump Cost in ${data.name}, ${data.state}`,
      description: `Complete cost breakdown for heat pump installation in ${data.name}. Compare types, sizes, and find rebates.`,
    },
  };
}

export default async function CostPage({ params }: Props) {
  const { city } = await params;
  const data = CITY_NAMES[city];
  if (!data) notFound();

  const slug = `${city}-${data.state.toLowerCase()}`;
  const climate = getClimateZone(slug);
  const rebates = getRebatesByState(data.state);
  const totalRebates = rebates.reduce((sum, r) => sum + (r.amountMax || 0), 0);

  const isColdClimate = climate && climate.data.avgWinterTemp < 25;
  const costBase = isColdClimate ? COST_ESTIMATES["cold-climate"] : COST_ESTIMATES["base"];

  const costSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much does a heat pump cost in ${data.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Heat pump installation in ${data.name} typically costs between $${costBase.low.toLocaleString()} and $${costBase.high.toLocaleString()}. Average installation runs $${costBase.average.toLocaleString()}. Cold-climate models may cost 20-40% more but deliver better performance in ${data.name}'s climate.`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(costSchema) }} />

      <div className="container-content py-8">
        <div className="max-w-4xl mx-auto">
          {/* Direct answer — featured snippet */}
          <div className="bg-primary/5 rounded-xl p-6 mb-8 border-l-4 border-primary">
            <p className="text-lg leading-relaxed">
              Heat pump installation in {data.name} typically costs between{" "}
              <strong>${costBase.low.toLocaleString()}</strong> and{" "}
              <strong>${costBase.high.toLocaleString()}</strong>. Average
              installation runs{" "}
              <strong>${costBase.average.toLocaleString()}</strong>.
              {isColdClimate
                ? " Cold-climate models are recommended and may cost 20-40% more."
                : ""}
            </p>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Heat Pump Installation Cost in {data.name}, {data.state}
          </h1>
          <p className="text-text-muted mb-8">
            Updated for {new Date().getFullYear()}. Includes equipment, installation,
            and available rebates.
          </p>

          {/* Quick stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="card-base p-4 text-center">
              <DollarSign className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">
                ${costBase.average.toLocaleString()}
              </p>
              <p className="text-xs text-text-muted">Average Cost</p>
            </div>
            <div className="card-base p-4 text-center">
              <Home className="h-6 w-6 text-secondary mx-auto mb-1" />
              <p className="text-2xl font-bold text-secondary">
                ${((costBase.average * 0.7) / 1000).toFixed(1)}k–${((costBase.average * 1.3) / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-text-muted">Typical Range</p>
            </div>
            <div className="card-base p-4 text-center">
              <DollarSign className="h-6 w-6 text-success mx-auto mb-1" />
              <p className="text-2xl font-bold text-success">
                ${totalRebates.toLocaleString()}
              </p>
              <p className="text-xs text-text-muted">Available Rebates</p>
            </div>
            <div className="card-base p-4 text-center">
              <Thermometer className="h-6 w-6 text-accent-dark mx-auto mb-1" />
              <p className="text-2xl font-bold text-accent-dark">
                {climate?.data.avgWinterTemp || "?"}°F
              </p>
              <p className="text-xs text-text-muted">Avg Winter Low</p>
            </div>
          </div>

          {/* Cost comparison table */}
          <h2 className="text-2xl font-bold mb-4">
            Cost Comparison by Heat Pump Type
          </h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">System Type</th>
                  <th className="text-right py-3 px-4 font-semibold">Low</th>
                  <th className="text-right py-3 px-4 font-semibold">Average</th>
                  <th className="text-right py-3 px-4 font-semibold">High</th>
                  <th className="text-left py-3 px-4 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Air-Source Heat Pump", low: 4500, avg: 7500, high: 12000, best: "Most homes with existing ductwork" },
                  { type: `Cold-Climate Heat Pump${isColdClimate ? " ★" : ""}`, low: 6000, avg: 10000, high: 16000, best: `${data.name}'s winter conditions` },
                  { type: "Mini-Split (Single Zone)", low: 3000, avg: 5000, high: 8000, best: "Room additions, no ductwork" },
                  { type: "Mini-Split (Multi-Zone)", low: 8000, avg: 14000, high: 22000, best: "Whole-home, no ductwork" },
                  { type: "Ducted Heat Pump", low: 8000, avg: 12000, high: 18000, best: "Complete HVAC replacement" },
                  { type: "Ground-Source (Geothermal)", low: 15000, avg: 25000, high: 40000, best: "Maximum efficiency, long-term" },
                ].map((row) => (
                  <tr key={row.type} className="border-b border-border hover:bg-surface-muted/50">
                    <td className="py-3 px-4 font-medium">{row.type}</td>
                    <td className="text-right py-3 px-4">${row.low.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 font-semibold">${row.avg.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">${row.high.toLocaleString()}</td>
                    <td className="py-3 px-4 text-text-muted text-xs">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cost factors */}
          <div className="card-base p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              What Affects Heat Pump Cost in {data.name}?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { factor: "Home Size", detail: "Larger homes need more capacity. A 2,000 sq ft home typically needs a 3-4 ton system." },
                { factor: "Ductwork", detail: "Installing new ductwork adds $3,000-$8,000. Ductless mini-splits avoid this cost." },
                { factor: "Equipment Efficiency", detail: "Higher SEER/HSPF ratings cost more upfront but save more on energy bills." },
                { factor: "Climate Requirements", detail: `${data.name} needs cold-climate rated equipment. Standard heat pumps lose efficiency below 25°F.` },
                { factor: "Installation Complexity", detail: "Retrofits, multi-story homes, and difficult access increase labor costs." },
                { factor: "Permits & Inspections", detail: `Permit fees in ${data.name} typically range from $150-$500 depending on scope.` },
              ].map((item) => (
                <div key={item.factor} className="p-3 bg-surface-muted rounded-lg">
                  <h3 className="font-semibold text-sm mb-1">{item.factor}</h3>
                  <p className="text-xs text-text-muted">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold mb-2">
              Get Accurate Quotes from Local Pros
            </h2>
            <p className="text-text-muted mb-4">
              Compare quotes from verified {data.name} heat pump contractors.
            </p>
            <Link href={`/installers/${slug}`}>
              <Button>
                Find Installers in {data.name} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
