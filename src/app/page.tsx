import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AgentWidgetClient } from "@/components/AgentWidgetClient";
import {
  Search,
  Shield,
  Calculator,
  DollarSign,
  Leaf,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// JSON-LD for homepage
const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Heat Pump Network",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://heatpump.network",
  description:
    "Connect with pre-verified, high-quality heat pump contractors across the US. Compare installers, check rebates, and calculate your savings.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "{search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />

      {/* ─── HERO ─── */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="container-content py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find a Certified{" "}
              <span className="text-primary">Heat Pump</span> Installer Near
              You
            </h1>
            <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
              Connect with pre-verified, high-quality contractors. Compare
              quotes, check rebate eligibility, and calculate your energy
              savings — all free for homeowners.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <input
                    type="search"
                    placeholder="Enter your city or ZIP code..."
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-white text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Link href="/search">
                  <Button size="lg">Search</Button>
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" />
                Pre-Verified Contractors
              </span>
              <span className="flex items-center gap-1.5">
                <Calculator className="h-4 w-4 text-primary" />
                Free Rebate Check
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-primary" />
                Real Reviews
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-primary" />
                No Hidden Fees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOP CITIES ─── */}
      <section className="py-16">
        <div className="container-content">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Find Installers in Top Cities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: "Portland", state: "OR", slug: "portland-or" },
              { city: "Seattle", state: "WA", slug: "seattle-wa" },
              { city: "Boston", state: "MA", slug: "boston-ma" },
              { city: "New York", state: "NY", slug: "new-york-ny" },
              { city: "Burlington", state: "VT", slug: "burlington-vt" },
              { city: "Portland", state: "ME", slug: "portland-me" },
              { city: "Minneapolis", state: "MN", slug: "minneapolis-mn" },
              { city: "Chicago", state: "IL", slug: "chicago-il" },
            ].map((loc) => (
              <Link
                key={loc.slug}
                href={`/installers/${loc.slug}`}
                className="card-base p-4 text-center hover:shadow-md transition-shadow group"
              >
                <p className="font-semibold group-hover:text-primary transition-colors">
                  {loc.city}
                </p>
                <p className="text-sm text-text-muted">{loc.state}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-surface-muted py-16">
        <div className="container-content">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                icon: Search,
                title: "Search & Compare",
                description:
                  "Browse verified contractors in your area. Compare ratings, certifications, and real project case studies.",
              },
              {
                step: "2",
                icon: Calculator,
                title: "Estimate Costs & Rebates",
                description:
                  "Use our interactive tools to estimate installation costs, calculate energy savings, and check rebate eligibility.",
              },
              {
                step: "3",
                icon: ArrowRight,
                title: "Connect & Save",
                description:
                  "Submit one request and receive quotes from multiple contractors. No obligation, no spam, no hidden fees.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REBATE CALCULATOR CTA ─── */}
      <section className="py-16">
        <div className="container-content">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Check Your Heat Pump Rebate Eligibility
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Find out how much you could save with federal tax credits, state
              rebates, and utility incentives. Enter your ZIP code to get
              started.
            </p>
            <Link href="/rebate-calculator">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Check Your Rebates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TRUST SIGNALS (E-E-A-T) ─── */}
      <section className="bg-surface-muted py-16">
        <div className="container-content">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Our Commitment to Trust & Transparency
          </h2>
          <p className="text-text-muted text-center mb-10 max-w-2xl mx-auto">
            Every contractor on Heat Pump Network undergoes rigorous
            verification. We never accept payment for ranking — search results
            are based on relevance and quality alone.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "License & Insurance Verified",
                desc: "Every contractor provides a valid state license and certificate of insurance.",
              },
              {
                icon: CheckCircle2,
                title: "Real Project Case Studies",
                desc: "Contractors publish verified before/after projects with energy savings data.",
              },
              {
                icon: Star,
                title: "Authentic Reviews Only",
                desc: "All reviews are moderated. No fake reviews. Aggregate ratings shown at 5+ reviews.",
              },
              {
                icon: Search,
                title: "No Pay-for-Ranking",
                desc: "Monetisation never affects organic search results. Sponsored placements are clearly labelled.",
              },
            ].map((item) => (
              <div key={item.title} className="card-base p-6">
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/how-we-verify">
              <Button variant="outline">
                Learn How We Verify Contractors{" "}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TARGET STATE LINKS ─── */}
      <section className="py-16">
        <div className="container-content">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Heat Pump Rebates by State
          </h2>
          <p className="text-text-muted text-center mb-10 max-w-xl mx-auto">
            Federal tax credits of up to 30% plus state and utility incentives.
            Check what&apos;s available in your state.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              "oregon",
              "washington",
              "massachusetts",
              "new-york",
              "vermont",
              "maine",
              "minnesota",
              "illinois",
            ].map((state) => (
              <Link
                key={state}
                href={`/heat-pump-rebates/${state}`}
                className="card-base px-4 py-3 text-center text-sm font-medium hover:text-primary transition-colors"
              >
                {state
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AGENT CHAT WIDGET ─── */}
      <div className="fixed bottom-4 right-4 z-[60]">
        <AgentWidgetClient
          sessionId="heatpump-network-home"
          initialMode="advisory"
          useMobileButton
        />
      </div>
    </>
  );
}
