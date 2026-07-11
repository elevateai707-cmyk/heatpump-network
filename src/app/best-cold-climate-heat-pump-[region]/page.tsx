/**
 * Regional Cold Climate Guide — /best-cold-climate-heat-pump-[region]
 * Best-of guide with comparison, JSON-LD, and expert recommendations
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Snowflake, Star, Thermometer, Award, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ region: string }>;
}

const REGION_DATA: Record<string, { name: string; states: string; description: string; avgWinterTemp: number; minHSPF: number; keyBrands: string[]; tip: string }> = {
  "northeast": {
    name: "the Northeast",
    states: "Massachusetts, New York, Vermont, Maine",
    description: "The Northeast has some of the coldest winters in the continental US, particularly in northern New England. Cold-climate heat pumps from Mitsubishi, Fujitsu, and LG are the standard here, maintaining full heating capacity down to -13°F to -25°F.",
    avgWinterTemp: 18,
    minHSPF: 9.5,
    keyBrands: ["Mitsubishi Hyper-Heat", "Fujitsu AOU Series", "LG Red"],
    tip: "Look for HSPF2 ratings of 10.0+ and units rated for 100% heating capacity at -13°F or lower. The Mass Save and Efficiency Maine rebate programs specifically require cold-climate certified equipment.",
  },
  "pacific-northwest": {
    name: "the Pacific Northwest",
    states: "Oregon, Washington",
    description: "The Pacific Northwest's marine climate is milder than other cold regions, but the persistent damp cold makes efficiency a priority. Heat pumps perform well year-round here, with most homes not needing supplemental heating.",
    avgWinterTemp: 35,
    minHSPF: 9.0,
    keyBrands: ["Daikin Fit", "Carrier Infinity", "Trane XV20i"],
    tip: "Since winter temperatures rarely drop below 20°F in most PNW cities, standard cold-climate heat pumps work well. Focus on SEER ratings for summer cooling efficiency in addition to HSPF for heating.",
  },
  "midwest": {
    name: "the Midwest",
    states: "Minnesota, Illinois",
    description: "The Upper Midwest experiences extreme temperature swings from -20°F in winter to 95°F in summer. Modern cold-climate variable-speed heat pumps handle this range efficiently, though most homes benefit from a dual-fuel setup with a gas furnace backup for the coldest days.",
    avgWinterTemp: 12,
    minHSPF: 10.0,
    keyBrands: ["Mitsubishi Hyper-Heat", "Lennox SL25XPV", "Rheem Prestige"],
    tip: "Consider a dual-fuel system (heat pump + gas furnace) for Minnesota's extreme cold. The heat pump handles 95% of heating needs, with the gas furnace only engaging below 10°F. Set the balance point at 20°F for optimal efficiency.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const data = REGION_DATA[region];
  if (!data) return { title: "Region Not Found" };

  return {
    title: `Best Cold Climate Heat Pumps for ${data.name} — ${new Date().getFullYear()}`,
    description: `Compare the best cold-climate heat pumps for ${data.name}. Top brands: ${data.keyBrands.join(", ")}. Minimum HSPF: ${data.minHSPF}+. Expert tips for ${data.states}.`,
    openGraph: {
      title: `Best Cold Climate Heat Pumps — ${data.name}`,
      description: `Expert guide to cold-climate heat pumps for ${data.name}. Compare efficiency, brands, and installation costs.`,
    },
  };
}

export default async function ColdClimateGuidePage({ params }: Props) {
  const { region } = await params;
  const data = REGION_DATA[region];
  if (!data) notFound();

  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Best Cold Climate Heat Pumps for ${data.name}`,
    description: `Expert comparison of cold-climate heat pumps for homes in ${data.states}. Features HSPF ratings, brand recommendations, and installation tips.`,
    about: { "@type": "Product", name: "Cold Climate Heat Pump" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }} />

      <div className="container-content py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best Cold Climate Heat Pumps for {data.name}
          </h1>
          <p className="text-lg text-text-muted mb-6">
            Updated for {new Date().getFullYear()}. Expert-recommended heat pumps
            that excel in {data.name}&apos;s climate conditions.
          </p>

          {/* Key stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="card-base p-4 text-center">
              <Snowflake className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-primary">{data.avgWinterTemp}°F</p>
              <p className="text-xs text-text-muted">Avg Winter Temp</p>
            </div>
            <div className="card-base p-4 text-center">
              <Star className="h-6 w-6 text-accent-dark mx-auto mb-1" />
              <p className="text-lg font-bold text-accent-dark">{data.minHSPF}+</p>
              <p className="text-xs text-text-muted">Min Recommended HSPF</p>
            </div>
            <div className="card-base p-4 text-center">
              <Award className="h-6 w-6 text-secondary mx-auto mb-1" />
              <p className="text-lg font-bold text-secondary">{data.keyBrands.length}</p>
              <p className="text-xs text-text-muted">Top Brands</p>
            </div>
            <div className="card-base p-4 text-center">
              <Thermometer className="h-6 w-6 text-success mx-auto mb-1" />
              <p className="text-lg font-bold text-success">-13°F</p>
              <p className="text-xs text-text-muted">Min Operating Temp</p>
            </div>
          </div>

          {/* Guide content */}
          <div className="prose prose-sm max-w-none mb-8">
            <h2>Why Cold Climate Heat Pumps?</h2>
            <p>
              Standard heat pumps lose heating capacity as outdoor temperatures drop, typically
              becoming ineffective below 25°F. Cold-climate heat pumps use advanced inverter
              technology, enhanced compressors, and optimized coil designs to maintain full
              heating capacity at much lower temperatures — typically down to -13°F to -25°F.
            </p>
            <p>
              For {data.name}, where average winter temperatures range from{" "}
              {data.avgWinterTemp}°F with occasional deep freezes, a cold-climate heat pump
              is not just recommended — it&apos;s essential for reliable winter performance.
            </p>

            <h2>Top Cold Climate Heat Pump Brands</h2>
            <ul>
              {data.keyBrands.map((brand) => (
                <li key={brand}>
                  <strong>{brand}</strong> — Industry leader in cold-climate performance
                </li>
              ))}
            </ul>

            <h2>Efficiency Ratings to Look For</h2>
            <ul>
              <li>
                <strong>HSPF2 ≥ {data.minHSPF}</strong> — Heating Seasonal Performance
                Factor. Higher is better for heating efficiency.
              </li>
              <li>
                <strong>SEER2 ≥ 15</strong> — Cooling efficiency. Important for summer
                performance.
              </li>
              <li>
                <strong>100% capacity at -13°F</strong> — Look for units that maintain
                full heating output at very low temperatures.
              </li>
            </ul>

            <h2>Installation Considerations for {data.name}</h2>
            <p>{data.description}</p>

            <div className="bg-primary/5 rounded-lg p-4 not-prose">
              <h3 className="font-semibold mb-1">💡 Expert Tip</h3>
              <p className="text-sm text-text-muted">{data.tip}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="card-base p-6">
            <h2 className="text-xl font-bold mb-2">
              Find a Certified Cold-Climate Installer
            </h2>
            <p className="text-text-muted mb-4">
              Connect with verified contractors who specialize in cold-climate
              heat pump installations in {data.states}.
            </p>
            <div className="flex flex-wrap gap-3">
              {data.states.split(", ").map((state) => {
                const stateSlug = state.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link key={state} href={`/installers/boston-${stateSlug === "new-york" ? "ny" : stateSlug === "massachusetts" ? "ma" : stateSlug === "vermont" ? "vt" : stateSlug === "maine" ? "me" : stateSlug === "minnesota" ? "mn" : stateSlug === "illinois" ? "il" : stateSlug === "oregon" ? "or" : stateSlug === "washington" ? "wa" : stateSlug}`}>
                    <Button variant="outline" size="sm">
                      Find Installers in {state} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
