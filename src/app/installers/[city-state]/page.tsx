/**
 * City Installer Page — /installers/[city-state]
 * Programmatic page with unique content per city: climate data, rebates, local contractors
 * Zero boilerplate — each page pulls real data
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getClimateZone, getRebatesByState, COST_ESTIMATES, CLIMATE_ZONES } from "@/data/rebates-fallback";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Thermometer, DollarSign, Sun, Snowflake, MapPin, ArrowRight } from "lucide-react";
import { ContractorCard } from "@/components/search/contractor-card";

interface Props {
  params: Promise<{ "city-state": string }>;
}

// Known city data for programmatic pages
const CITY_DATA: Record<string, { name: string; state: string; stateFull: string; description: string; avgHomeSize: number; dominantFuel: string }> = {
  "portland-or": { name: "Portland", state: "OR", stateFull: "Oregon", description: "Portland's mild winters and increasing utility rates make heat pumps an excellent investment. With Energy Trust of Oregon rebates up to $3,200, the payback period is among the shortest in the Pacific Northwest.", avgHomeSize: 1800, dominantFuel: "gas" },
  "seattle-wa": { name: "Seattle", state: "WA", stateFull: "Washington", description: "Seattle's temperate marine climate is ideal for heat pumps. With Washington state rebates up to $10,000 for income-qualified households and PSE incentives, electrification is more accessible than ever.", avgHomeSize: 2000, dominantFuel: "electric" },
  "boston-ma": { name: "Boston", state: "MA", stateFull: "Massachusetts", description: "Massachusetts leads the nation in heat pump adoption with Mass Save rebates up to $15,000. Boston's older housing stock benefits significantly from cold-climate heat pump retrofits.", avgHomeSize: 1600, dominantFuel: "gas" },
  "new-york-ny": { name: "New York", state: "NY", stateFull: "New York", description: "New York's Clean Heat program offers up to $8,000 for heat pump installation. Con Edison and other utility customers can stack additional rebates for significant savings.", avgHomeSize: 1400, dominantFuel: "oil" },
  "burlington-vt": { name: "Burlington", state: "VT", stateFull: "Vermont", description: "Burlington's cold winters require cold-climate heat pumps rated for sub-zero performance. Efficiency Vermont offers up to $4,000 for qualifying installations.", avgHomeSize: 1700, dominantFuel: "oil" },
  "portland-me": { name: "Portland", state: "ME", stateFull: "Maine", description: "Maine has one of the highest heat pump adoption rates in the country. Efficiency Maine rebates up to $4,200 make the switch affordable for most homeowners.", avgHomeSize: 1800, dominantFuel: "oil" },
  "minneapolis-mn": { name: "Minneapolis", state: "MN", stateFull: "Minnesota", description: "Modern cold-climate heat pumps perform efficiently even in Minneapolis's harsh winters. Combined with Minnesota state rebates and Xcel Energy incentives, switching from gas or electric resistance heating saves significantly.", avgHomeSize: 1900, dominantFuel: "gas" },
  "chicago-il": { name: "Chicago", state: "IL", stateFull: "Illinois", description: "Chicago's climate requires a properly sized cold-climate heat pump. Illinois state rebates up to $5,000 plus ComEd incentives make heat pump adoption increasingly cost-effective.", avgHomeSize: 1700, dominantFuel: "gas" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "city-state": slug } = await params;
  const cityData = CITY_DATA[slug];
  if (!cityData) return { title: "City Not Found" };

  const climate = getClimateZone(slug);

  return {
    title: `Heat Pump Installers in ${cityData.name}, ${cityData.state} — ${new Date().getFullYear()} Guide`,
    description: `Find verified heat pump contractors in ${cityData.name}, ${cityData.state}. ${climate?.data.description}. Compare ratings, check rebates, and get free quotes.`,
    openGraph: {
      title: `Heat Pump Installation in ${cityData.name}, ${cityData.state}`,
      description: `Compare top-rated heat pump installers in ${cityData.name}. Get free quotes and check rebate eligibility.`,
    },
  };
}

export default async function CityInstallerPage({ params }: Props) {
  const { "city-state": slug } = await params;
  const cityData = CITY_DATA[slug];

  if (!cityData) notFound();

  const climate = getClimateZone(slug);
  const rebates = getRebatesByState(cityData.state);
  const maxRebate = rebates.reduce((sum, r) => sum + (r.amountMax || 0), 0);

  // Fetch contractors from this city
  const contractors = await prisma.contractor.findMany({
    where: {
      isVerified: true,
      city: { contains: cityData.name.split(" ")[0] },
      state: cityData.state,
    },
    orderBy: { averageRating: "desc" },
    take: 20,
  });

  const cityPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Heat Pump Installers in ${cityData.name}, ${cityData.state}`,
    description: cityData.description,
    about: { "@type": "City", name: cityData.name },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: contractors.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "HVACBusiness",
          name: c.businessName,
          url: `/pro/${c.slug}`,
        },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityPageSchema) }} />

      <div className="container-content py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Heat Pump Installers in {cityData.name}, {cityData.state}
          </h1>
          <p className="text-lg text-text-muted max-w-3xl">
            {cityData.description}
          </p>
        </div>

        {/* Climate & rebate stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {climate && (
            <>
              <div className="card-base p-4 text-center">
                <Snowflake className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold">{climate.data.avgWinterTemp}°F</p>
                <p className="text-xs text-text-muted">Avg Winter Temp</p>
                <p className="text-[10px] text-text-muted">Climate Zone {climate.zone}</p>
              </div>
              <div className="card-base p-4 text-center">
                <Sun className="h-6 w-6 text-accent-dark mx-auto mb-1" />
                <p className="text-lg font-bold">{climate.data.avgSummerTemp}°F</p>
                <p className="text-xs text-text-muted">Avg Summer Temp</p>
              </div>
            </>
          )}
          <div className="card-base p-4 text-center">
            <DollarSign className="h-6 w-6 text-success mx-auto mb-1" />
            <p className="text-lg font-bold">${maxRebate.toLocaleString()}</p>
            <p className="text-xs text-text-muted">Max Available Rebates</p>
          </div>
          <div className="card-base p-4 text-center">
            <Thermometer className="h-6 w-6 text-secondary mx-auto mb-1" />
            <p className="text-lg font-bold">
              {climate?.data.recommendedHSPF || 9.5}+
            </p>
            <p className="text-xs text-text-muted">Recommended HSPF</p>
          </div>
        </div>

        {/* Action links */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href={`/heat-pump-rebates/${cityData.stateFull.toLowerCase()}`}>
            <Button variant="outline" size="sm">
              {cityData.stateFull} Heat Pump Rebates <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <Link href={`/cost-to-install-heat-pump/${slug}`}>
            <Button variant="outline" size="sm">
              Installation Cost in {cityData.name} <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <Link href="/rebate-calculator">
            <Button variant="outline" size="sm">
              Calculate Your Rebates <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Contractor results */}
        {contractors.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-4">
              {contractors.length} Verified Installer{contractors.length !== 1 ? "s" : ""} in {cityData.name}
            </h2>
            <div className="space-y-4">
              {contractors.map((c) => (
                <ContractorCard key={c.id} contractor={c} />
              ))}
            </div>
          </div>
        ) : (
          <div className="card-base p-8 text-center">
            <MapPin className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              No Verified Installers Yet in {cityData.name}
            </h2>
            <p className="text-sm text-text-muted mb-4 max-w-md mx-auto">
              We&apos;re actively expanding our network. Check nearby cities or
              search all installers in {cityData.state}.
            </p>
            <Link href={`/search?state=${cityData.state}`}>
              <Button>Search All {cityData.state} Installers</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
