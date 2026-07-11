# Heat Pump Network

A production-ready local directory connecting homeowners with pre-verified, high-quality heat pump and electrification retrofit contractors across the US. Built with Next.js 15, Prisma 7, PostgreSQL, Meilisearch, and Tailwind CSS v4.

## Target Markets

**Primary geographies** (high demand, lower digital competition):
WA · OR · MA · NY · VT · ME · MN · IL

**Excluded** (oversaturated): CA · FL · AZ · TX · CO

## Quick Start

### 1. Prerequisites

- Node.js 22+
- PostgreSQL 16 (or use SQLite for local dev — swap `prisma/schema.prisma` provider)
- Meilisearch (optional — search falls back to Prisma)
- Stripe account (for payment processing)

### 2. Clone & Install

```bash
git clone <repo-url> heatpump-network
cd heatpump-network
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string. For local dev: `file:./dev.db` |
| `NEXTAUTH_SECRET` | ✅ | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | `http://localhost:3000` for dev |
| `GOOGLE_CLIENT_ID` | For Google OAuth | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google OAuth | Google OAuth client secret |
| `RESEND_API_KEY` | For email | Resend.com API key for magic link emails |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key (sk_live_ or sk_test_) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | For payments | Stripe webhook signing secret |
| `MEILISEARCH_HOST` | For search | `http://localhost:7700` |
| `MEILI_MASTER_KEY` | For search | Meilisearch master key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | For maps | Mapbox GL JS public token |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `http://localhost:3000` for dev |

### 4. Database Setup

**SQLite (local dev):**
```bash
# Schema is already SQLite-compatible
npx prisma generate
npx prisma db push
npx tsx prisma/seed.mjs
```

**PostgreSQL (production):**
1. Update `prisma/schema.prisma` — change provider to `postgresql`
2. Update `prisma.config.ts` env variable
3. Update `src/lib/prisma.ts` — uses `@prisma/adapter-pg` automatically for PG URLs
4. Run:
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.mjs
```

### 5. Run

```bash
npm run dev        # Development at http://localhost:3000
npm run build      # Production build
npm run start      # Run production build
```

### 6. Docker (Production)

```bash
docker-compose up -d
```

This starts: Next.js app, PostgreSQL 16, Meilisearch 1.12.

## Seed Data

The seed script (`prisma/seed.mjs`) populates:

| Entity | Count | Details |
|--------|-------|---------|
| Contractors | 50 | Across all 8 target states, realistic business names, phone, ratings, service areas |
| Rebate Programs | 20 | Federal tax credits (30% up to $2K) + state/utility rebates ($1K–$15K per program) |
| Case Studies | 50+ | Before/after projects with energy savings data (62% avg reduction) |
| Reviews | 200+ | Moderated homeowner reviews with 3.0–5.0 star ratings |
| Sponsored Placements | 5 | 1 global + 4 city-specific, $299/mo |
| Content Review Items | 3 | Pending AI-generated content for admin review |
| Admin User | 1 | admin@heatpump.network / admin123! |

**Default admin:** `admin@heatpump.network` / `admin123!`

## Project Structure

```
heatpump-network/
├── prisma/
│   ├── schema.prisma       # 15 models: User, Contractor, Lead, CaseStudy, etc.
│   ├── seed.mjs            # 50 contractors + 20 rebates + reviews + case studies
│   └── migrations/         # Generated (gitignored)
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage: hero, top cities, tools CTA, trust
│   │   ├── layout.tsx            # Root layout: Inter font, metadata, security
│   │   ├── search/               # Search results: faceted filters, map toggle
│   │   ├── pro/[slug]/           # Contractor profiles: JSON-LD, lead form
│   │   ├── installers/[city-state]/  # 8 programmatic city pages
│   │   ├── heat-pump-rebates/[state]/ # 8 state rebate guides (AEO optimised)
│   │   ├── cost-to-install-heat-pump/[city]/ # 8 city cost pages
│   │   ├── best-cold-climate-heat-pump-[region]/ # 3 regional guides
│   │   ├── rebate-calculator/    # Interactive rebate eligibility tool
│   │   ├── sizing-estimator/     # Interactive sizing & cost tool
│   │   ├── how-we-verify/        # Transparency: verification process (E-E-A-T)
│   │   ├── monetisation-disclosure/ # FTC-compliant revenue model explanation
│   │   ├── (auth)/               # Sign in, sign up, error pages
│   │   ├── contractor/dashboard/ # Full lead mgmt, credits, subscription tabs
│   │   ├── admin/                # Verification queue, content review, sponsored
│   │   ├── api/                  # REST endpoints: search, leads, stripe, admin
│   │   ├── sitemap.ts            # Dynamic XML sitemap
│   │   └── robots.ts             # Disallows /admin/, /dashboard
│   ├── components/
│   │   ├── ui/                   # shadcn-style Button, Toast
│   │   ├── layout/               # Header (auth-aware), Footer
│   │   ├── contractor/           # Profile sections (header, about, case studies, etc.)
│   │   ├── search/               # Cards, filters, skeletons, sponsored card
│   │   └── tools/                # Rebate calculator, sizing estimator
│   ├── lib/
│   │   ├── prisma.ts             # Singleton with SQLite/PG auto-detect
│   │   ├── auth.ts               # NextAuth with custom Prisma adapter
│   │   ├── stripe.ts             # Lazy-init Stripe client, pricing constants
│   │   ├── meilisearch.ts        # Index settings, sync, search with geo
│   │   ├── meili-sync.ts         # Prisma sync middleware, re-index
│   │   └── utils.ts              # cn(), formatDollars(), slugify(), etc.
│   ├── data/
│   │   └── rebates-fallback.ts   # Static rebate/climate data (marked fallback)
│   └── types/
│       └── index.ts              # Shared TypeScript types
├── __tests__/
│   ├── schema.test.ts            # Model validation, config, compliance
│   ├── credits.test.ts           # Credit deduction logic, pricing
│   ├── api.test.ts               # Lead validation, status transitions
│   └── core-web-vitals.test.ts   # LCP, CLS, INP, a11y, link checks
└── docker-compose.yml            # App + PostgreSQL + Meilisearch
```

## Key Architecture Decisions

### Ethical Monetisation (No Pay-for-Ranking)

1. **Free Listings** — All verified contractors get complete profiles for free. No pay-to-play.
2. **Lead Credits** — $25–$50 per lead. Contractors buy credit packs; only charged when they mark a lead as CONTACTED.
3. **Premium Profiles** — $99/mo. Enhanced design, early lead access, CSV exports. **No ranking boost.**
4. **Sponsored Placements** — $299/mo. Clearly labelled with dashed yellow border and "Sponsored" badge. `rel="sponsored"` links. Separate from organic.
5. **Affiliate Links** — Minimal. Only to government/utility rebate programs. Full disclosure. `rel="noopener nofollow"`.

### Google June 2026 Compliance

- **E-E-A-T**: License number, insurance, years in business, case studies with energy savings data
- **No AI content without review**: ContentReviewItem model + admin review queue
- **Transparency pages**: /how-we-verify, /monetisation-disclosure, /privacy, /terms
- **No keyword stuffing**: Business name and description validation
- **UGC moderation**: Reviews and Q&A are moderated; aggregate rating only at 5+ reviews
- **Structured data**: HVACBusiness, Service, FAQPage, HowTo, Speakable, AggregateRating
- **Core Web Vitals**: Font preloading, image optimization, lazy loading, reduced motion

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/search` | GET | Contractor search with faceted filters + geo |
| `/api/leads` | POST | Submit lead to contractor |
| `/api/leads/[id]/status` | PATCH | Update lead status (deducts credit) |
| `/api/stripe/create-checkout` | POST | Stripe checkout session |
| `/api/stripe/webhook` | POST | Stripe event handler |
| `/api/stripe/portal` | POST | Customer billing portal |
| `/api/auth/[...nextauth]` | * | NextAuth endpoints |
| `/api/auth/signup` | POST | User registration |
| `/api/admin/verify/[id]` | PATCH | Approve/reject contractor |
| `/api/admin/reindex` | POST | Re-index Meilisearch |
| `/api/admin/content-review/[id]` | PATCH | Review AI content |
| `/api/admin/sponsored` | GET/POST | Manage placements |
| `/api/admin/sponsored/[id]` | PATCH | Toggle placement |

## Testing

```bash
npm test                     # Run all tests (38 tests across 4 suites)
npm test -- --reporter=verbose  # Detailed output
npx vitest run credits.test.ts  # Run specific suite
```

**Test coverage:**
- Schema validation (15 models, indexes, config files)
- Lead credit deduction logic (6 edge cases)
- API validation (required fields, email format, status transitions)
- Core Web Vitals assertions (font preload, reduced motion, focus styles, broken links)

## Post-Launch SEO/AEO Checklist

- [ ] **Schema.org validation** — Run all pages through validator.schema.org
- [ ] **DSIRE API integration** — Replace static fallback data with live DSIRE API
- [ ] **NREL API integration** — Connect sizing estimator to real climate zone data
- [ ] **Google Search Console** — Submit sitemap.xml, monitor indexing
- [ ] **Core Web Vitals** — Verify LCP <1.2s, CLS <0.05, INP <150ms via PageSpeed Insights
- [ ] **Structured data testing** — Google Rich Results Test on /pro/[slug] and /search
- [ ] **Meilisearch tuning** — Adjust ranking rules based on real search data
- [ ] **Content gap analysis** — Identify programmatic page opportunities beyond 8 cities
- [ ] **Review solicitation** — Implement automated review request emails
- [ ] **Lead credit balance monitoring** — Set up alerts for low balance contractors
- [ ] **Sponsored placement analytics** — Track CTR and conversion on sponsored cards
- [ ] **Affiliate link monetisation** — Enable with proper disclosure on rebate pages
- [ ] **Crawl budget optimisation** — Monitor Googlebot crawl patterns
- [ ] **Internal linking audit** — Ensure max 3 clicks from homepage to any listing
- [ ] **Robots.txt and sitemap** — Verify with robots.txt tester
- [ ] **Security audit** — npm audit, security headers check, CSP implementation
- [ ] **Privacy/compliance review** — CCPA/CAN-SPAM compliance for lead data
- [ ] **Performance budget** — Set up Lighthouse CI to prevent regressions
- [ ] **Mapbox integration** — Enable interactive map on search results page
- [ ] **CI/CD pipeline** — GitHub Actions for lint, test, build, deploy

## Deployment

### Fly.io

```bash
fly launch
fly secrets set DATABASE_URL=<postgres-url>
fly secrets set NEXTAUTH_SECRET=<secret>
fly secrets set STRIPE_SECRET_KEY=<key>
fly deploy
```

### Railway

```bash
railway up
# Set environment variables in Railway dashboard
```

### VPS (Manual)

```bash
docker-compose -f docker-compose.yml up -d
# Set up nginx reverse proxy with SSL
# Configure Cloudflare or similar CDN
```

## License

MIT — see LICENSE file.
