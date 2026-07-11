/**
 * State Rebate Guide — /heat-pump-rebates/[state]
 * Conversational query page: direct answer (<60 words) → structured data → in-depth content
 * Optimised for featured snippets and AEO
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRebatesByState } from "@/data/rebates-fallback";
import { Calculator, DollarSign, ExternalLink, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ state: string }>;
}

const STATE_NAMES: Record<string, string> = {
  oregon: "Oregon", washington: "Washington", massachusetts: "Massachusetts",
  "new-york": "New York", vermont: "Vermont", maine: "Maine",
  minnesota: "Minnesota", illinois: "Illinois",
};

const STATE_CODES: Record<string, string> = {
  oregon: "OR", washington: "WA", massachusetts: "MA",
  "new-york": "NY", vermont: "VT", maine: "ME",
  minnesota: "MN", illinois: "IL",
};

// Direct answers (<60 words) for featured snippets
const DIRECT_ANSWERS: Record<string, string> = {
  oregon: "Oregon offers heat pump rebates up to $3,200 through the Energy Trust of Oregon. Combined with the 30% federal tax credit (up to $2,000), homeowners can save $5,200+ on installation.",
  washington: "Washington state offers heat pump rebates up to $10,000 for income-qualified households through the Department of Commerce. Utility rebates from PSE and others add $500-$2,500 more.",
  massachusetts: "Massachusetts homeowners can receive up to $15,000 through Mass Save heat pump rebates — the most generous state program in the US. Income-eligible households get the highest rebates.",
  "new-york": "New York offers up to $8,000 through the NYS Clean Heat program plus Con Edison rebates up to $5,000. Combined with federal credits, total savings can exceed $15,000.",
  vermont: "Vermont homeowners can get up to $4,000 from Efficiency Vermont for cold-climate heat pumps. Enhanced rebates for oil-to-heat-pump conversions make the switch affordable.",
  maine: "Maine offers up to $4,200 through Efficiency Maine for heat pump installations. Income-eligible households receive enhanced rebates. Maine leads the nation in per-capita heat pump adoption.",
  minnesota: "Minnesota offers state rebates up to $4,000 plus Xcel Energy rebates up to $1,500. Modern cold-climate heat pumps work efficiently in Minnesota's harsh winters.",
  illinois: "Illinois offers heat pump rebates up to $5,000 through the DCEO. ComEd customers can receive an additional $1,000. Federal tax credits of 30% apply on top.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const name = STATE_NAMES[state];
  if (!name) return { title: "State Not Found" };

  return {
    title: `Heat Pump Rebates in ${name} — ${new Date().getFullYear()} Guide`,
    description: DIRECT_ANSWERS[state] || `Complete guide to heat pump rebates and incentives in ${name}. Federal tax credits, state rebates, and utility incentives explained.`,
    openGraph: {
      title: `${name} Heat Pump Rebates & Incentives`,
      description: `Save thousands on heat pump installation in ${name}. Check rebates, tax credits, and utility incentives.`,
    },
  };
}

export default async function StateRebatePage({ params }: Props) {
  const { state } = await params;
  const name = STATE_NAMES[state];
  const code = STATE_CODES[state];

  if (!name) notFound();

  const rebates = getRebatesByState(code);
  const totalMax = rebates.reduce((sum, r) => sum + (r.amountMax || 0), 0);
  const directAnswer = DIRECT_ANSWERS[state] || `Heat pump rebates in ${name} include federal tax credits and state-specific incentives.`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much are heat pump rebates in ${name}?`,
        acceptedAnswer: { "@type": "Answer", text: directAnswer },
      },
      {
        "@type": "Question",
        name: `Do I qualify for income-based heat pump rebates in ${name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Many ${name} heat pump programs offer enhanced rebates for households earning below 80% of the area median income (AMI). Check each program's specific income limits.` },
      },
      {
        "@type": "Question",
        name: `Can I combine federal tax credits with ${name} state rebates?`,
        acceptedAnswer: { "@type": "Answer", text: `Yes. Federal tax credits (30% up to $2,000) can be combined with most state and utility rebates in ${name}. This stacking can significantly reduce your out-of-pocket costs.` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="container-content py-8">
        <div className="max-w-4xl mx-auto">
          {/* Direct answer — featured snippet optimisation */}
          <div className="bg-primary/5 rounded-xl p-6 mb-8 border-l-4 border-primary">
            <p className="text-lg leading-relaxed">
              {directAnswer}
            </p>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Heat Pump Rebates in {name}
          </h1>
          <p className="text-text-muted mb-6">
            {new Date().getFullYear()} complete guide to federal, state, and
            utility incentives for heat pump installation.
          </p>

          {/* Summary stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="card-base p-5 text-center">
              <p className="text-3xl font-bold text-primary">
                ${totalMax.toLocaleString()}
              </p>
              <p className="text-sm text-text-muted">
                Total Estimated Incentives
              </p>
            </div>
            <div className="card-base p-5 text-center">
              <p className="text-3xl font-bold text-secondary">
                {rebates.length}
              </p>
              <p className="text-sm text-text-muted">
                Available Programs
              </p>
            </div>
            <div className="card-base p-5 text-center">
              <p className="text-3xl font-bold text-success">30%</p>
              <p className="text-sm text-text-muted">
                Federal Tax Credit
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/rebate-calculator">
              <Button>
                <Calculator className="h-4 w-4" />
                Calculate Your Rebates
              </Button>
            </Link>
            <Link href={`/installers/portland-${state}`}>
              <Button variant="outline">
                <ArrowRight className="h-4 w-4" />
                Find Installers in {name}
              </Button>
            </Link>
          </div>

          {/* Rebate programs */}
          <h2 className="text-2xl font-bold mb-4">
            {name} Heat Pump Incentive Programs
          </h2>
          <div className="space-y-4 mb-8">
            {rebates.map((rebate, i) => (
              <div key={i} className="card-base p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{rebate.name}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        rebate.programType === "tax_credit" ? "bg-secondary/10 text-secondary" :
                        rebate.programType === "rebate" ? "bg-primary/10 text-primary" :
                        "bg-accent/10 text-accent-dark"
                      }`}>
                        {rebate.programType === "tax_credit" ? "Tax Credit" :
                         rebate.programType === "rebate" ? "Rebate" : "Incentive"}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mb-2">
                      {rebate.providerName} · {rebate.state === "US" ? "Federal" : rebate.state}
                    </p>
                    <p className="text-sm">{rebate.description}</p>
                    {rebate.eligibilityRules && (
                      <div className="mt-2 text-xs text-text-muted bg-surface-muted rounded p-2">
                        <strong>Eligibility:</strong> {rebate.eligibilityRules}
                      </div>
                    )}
                    {rebate.equipmentTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rebate.equipmentTypes.map((eq) => (
                          <span key={eq} className="text-[10px] px-2 py-0.5 bg-surface-muted rounded-full">
                            {eq}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-primary">
                      ${(rebate.amountFixed || rebate.amountMax || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-text-muted">{rebate.amountDescription}</p>
                  </div>
                </div>
                {rebate.applicationUrl && (
                  <a
                    href={rebate.applicationUrl}
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Apply for this rebate
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* How to apply section */}
          <div className="card-base p-6">
            <h2 className="text-xl font-bold mb-4">
              How to Claim {name} Heat Pump Rebates
            </h2>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <p className="font-medium">Get a quote from a participating contractor</p>
                  <p className="text-sm text-text-muted">Most rebate programs require using an approved contractor. Use our directory to find verified installers.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <p className="font-medium">Verify equipment eligibility</p>
                  <p className="text-sm text-text-muted">Ensure your contractor installs ENERGY STAR certified equipment that meets efficiency requirements.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <p className="font-medium">Submit rebate paperwork</p>
                  <p className="text-sm text-text-muted">Your contractor typically handles rebate applications. For federal tax credits, save your receipt for tax filing.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="mt-6 text-xs text-text-muted p-3 bg-surface-muted rounded-lg">
            <strong>Disclaimer:</strong> Rebate amounts and eligibility are subject to change. Always verify with the program administrator. This data is sourced from publicly available information and may not reflect real-time program status.
          </div>
        </div>
      </div>
    </>
  );
}
