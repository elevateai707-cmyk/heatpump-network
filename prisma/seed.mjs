#!/usr/bin/env tsx
import "dotenv/config";
import { PrismaClient } from "../src/generated/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
// bcryptjs-compatible hash function
async function hashPassword(password) {
  const { default: bcrypt } = await import("bcryptjs");
  return bcrypt.hashSync(password, 12);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

// Data
const CONTRACTOR_NAMES = [
  "Pacific Northwest Heat Pump Pros", "Columbia HVAC & Energy", "Evergreen Heating & Cooling",
  "Cascadia Heat Pump Solutions", "Sound Energy Systems", "Olympic Climate Control",
  "Bay State Heat Pump Co.", "Boston Green HVAC", "Liberty Heating & Cooling",
  "Commonwealth Heat Pump Specialists", "Mass Energy Savers", "Plymouth Climate Solutions",
  "Empire State Heat Pump Installers", "Hudson Valley HVAC Pros", "Adirondack Heating Solutions",
  "Metro NY Heat Pump Experts", "Niagara Frontier Climate Control", "Finger Lakes HVAC",
  "Green Mountain Heat Pumps", "Champlain Valley Energy", "Vermont EnergyWorks",
  "Maple Leaf HVAC & Heat Pumps", "Pine Tree State Heating", "Down East Energy Solutions",
  "Acadia Heat Pump Pros", "Northern Lights HVAC", "Lakes & Pines Energy",
  "North Star Heat Pump Co.", "Twin Cities Climate Control", "Minnesota Energy Savers",
  "Prairie HVAC Solutions", "North Shore Heating & Cooling", "Land of Lincoln Heat Pumps",
  "Windy City HVAC Experts", "Prairie State Energy Systems", "Great Lakes Climate Control",
  "Rockford Heating Solutions", "Peoria Heat Pump Pros", "Rogue Valley Heat Pumps",
  "Willamette HVAC Services", "Mt. Hood Energy Systems", "Salem Climate Solutions",
  "Puget Sound Heat Pump Co.", "Spokane HVAC Pros", "Tacoma Energy Systems",
  "Olympia Climate Control NW", "Berkshire Heat Pumps", "Cape Cod HVAC",
  "Mohawk Valley Energy", "Lake Champlain Heating",
];

const FIRST_NAMES = ["James", "Maria", "Robert", "Sarah", "Michael", "Jennifer", "David", "Lisa", "Daniel", "Amanda"];
const LAST_NAMES = ["Johnson", "Martinez", "Williams", "Chen", "Anderson", "Patel", "Thompson", "Garcia", "Miller", "Davis"];

const CITIES_BY_STATE = {
  OR: ["Portland", "Salem", "Eugene", "Bend", "Medford"],
  WA: ["Seattle", "Spokane", "Tacoma", "Olympia", "Vancouver"],
  MA: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  NY: ["New York", "Buffalo", "Rochester", "Albany", "Syracuse"],
  VT: ["Burlington", "Montpelier", "Rutland", "Stowe", "South Burlington"],
  ME: ["Portland", "Augusta", "Bangor", "Lewiston", "Scarborough"],
  MN: ["Minneapolis", "St. Paul", "Duluth", "Rochester", "Bloomington"],
  IL: ["Chicago", "Peoria", "Springfield", "Rockford", "Naperville"],
};

const BRANDS = ["Mitsubishi", "Daikin", "Carrier", "Trane", "Lennox", "Fujitsu", "LG", "Rheem", "Goodman", "Bosch"];
const CERTIFICATIONS = ["NATE Certified", "EPA Section 608", "HERS Rater", "BPI Certified", "RESNET Certified", "LEED AP", "NAHB Green Certified", "BOCA Certified"];

const CASE_STUDY_TEMPLATES = [
  { title: "Full Home Heat Pump Conversion — Oil to Cold Climate", equipmentType: "Cold Climate Heat Pump", previousSystem: "Oil Furnace", installedSystem: "Mitsubishi Hyper-Heat Zoned System", homeSize: 2200, savingsDollars: 2400, reductionPercent: 62, totalCost: 18500, paybackYears: 5 },
  { title: "Ductless Mini-Split for Home Addition", equipmentType: "Mini-Split", previousSystem: "Electric Baseboard", installedSystem: "Fujitsu AOU Series Multi-Zone", homeSize: 800, savingsDollars: 600, reductionPercent: 42, totalCost: 6500, paybackYears: 4 },
  { title: "Whole-Home Heat Pump Retrofit with Ductwork", equipmentType: "Air Source Heat Pump", previousSystem: "Natural Gas Furnace", installedSystem: "Daikin Fit Variable Speed System", homeSize: 2800, savingsDollars: 1200, reductionPercent: 35, totalCost: 22000, paybackYears: 8 },
  { title: "Heat Pump Water Heater Replacement", equipmentType: "Heat Pump Water Heater", previousSystem: "Electric Resistive Water Heater", installedSystem: "Rheem ProTerra Hybrid Heat Pump", homeSize: 1800, savingsDollars: 450, reductionPercent: 55, totalCost: 3200, paybackYears: 3 },
  { title: "Cold Climate Heat Pump — Vermont Winter Performance", equipmentType: "Cold Climate Heat Pump", previousSystem: "Propane Furnace", installedSystem: "LG Red Cold Climate System", homeSize: 1600, savingsDollars: 1800, reductionPercent: 58, totalCost: 15000, paybackYears: 4 },
  { title: "Multi-Family Heat Pump Retrofit", equipmentType: "Air Source Heat Pump", previousSystem: "Electric Baseboard", installedSystem: "Carrier Infinity 4-Ton System", homeSize: 3200, savingsDollars: 3200, reductionPercent: 48, totalCost: 28000, paybackYears: 6 },
];

const REBATE_DATA = [
  { name: "Federal Energy Efficient Home Improvement Credit", provider: "Federal", providerName: "IRS", state: "US", programType: "tax_credit", amountMax: 2000, percentageCoverage: 30, equipmentTypes: ["Air Source Heat Pump", "Mini-Split"], description: "30% of cost, up to $2,000.", eligibilityRules: "ENERGY STAR certified. Existing home only.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Mass Save Heat Pump Rebate", provider: "State", providerName: "Mass Save", state: "MA", programType: "rebate", amountMax: 15000, equipmentTypes: ["Air Source Heat Pump", "Cold Climate Heat Pump"], description: "Up to $15,000 for whole-home heat pumps.", eligibilityRules: "Must use Mass Save contractor.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "NYS Clean Heat Rebate", provider: "State", providerName: "NYSERDA", state: "NY", programType: "rebate", amountMax: 8000, equipmentTypes: ["Air Source Heat Pump", "Ground Source Heat Pump"], description: "Up to $8,000.", eligibilityRules: "Must use NYSERDA contractor.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Energy Trust of Oregon Rebate", provider: "State", providerName: "Energy Trust of Oregon", state: "OR", programType: "rebate", amountMax: 3200, equipmentTypes: ["Air Source Heat Pump", "Ductless Heat Pump"], description: "Up to $3,200.", eligibilityRules: "Must be customer of participating utility.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Washington State Heat Pump Rebate", provider: "State", providerName: "WA Dept. of Commerce", state: "WA", programType: "rebate", amountMax: 10000, equipmentTypes: ["Air Source Heat Pump", "Cold Climate Heat Pump"], description: "Up to $10,000 income-qualified.", eligibilityRules: "Income ≤80% AMI.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Efficiency Vermont Rebate", provider: "State", providerName: "Efficiency Vermont", state: "VT", programType: "rebate", amountMax: 4000, equipmentTypes: ["Cold Climate Heat Pump"], description: "Up to $4,000.", eligibilityRules: "Must use recognized contractor.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Efficiency Maine Rebate", provider: "State", providerName: "Efficiency Maine", state: "ME", programType: "rebate", amountMax: 4200, equipmentTypes: ["Cold Climate Heat Pump", "Mini-Split"], description: "Up to $4,200.", eligibilityRules: "Must use participating contractor.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Minnesota Heat Pump Rebate", provider: "State", providerName: "MN Dept. of Commerce", state: "MN", programType: "rebate", amountMax: 4000, equipmentTypes: ["Air Source Heat Pump", "Cold Climate Heat Pump"], description: "Up to $4,000.", eligibilityRules: "Must use licensed MN contractor.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Illinois Heat Pump Rebate", provider: "State", providerName: "IL DCEO", state: "IL", programType: "rebate", amountMax: 5000, equipmentTypes: ["Air Source Heat Pump", "Ground Source Heat Pump"], description: "Up to $5,000.", eligibilityRules: "Must use licensed IL contractor.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Con Edison Heat Pump Rebate", provider: "Utility", providerName: "Con Edison", state: "NY", programType: "rebate", amountMax: 5000, equipmentTypes: ["Air Source Heat Pump", "Mini-Split"], description: "Up to $5,000 Con Edison customers.", eligibilityRules: "Must be Con Edison customer.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Puget Sound Energy Rebate", provider: "Utility", providerName: "Puget Sound Energy", state: "WA", programType: "rebate", amountMax: 2500, equipmentTypes: ["Air Source Heat Pump", "Ductless Heat Pump"], description: "Up to $2,500 PSE customers.", eligibilityRules: "Must be PSE customer.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Xcel Energy Heat Pump Rebate", provider: "Utility", providerName: "Xcel Energy", state: "MN", programType: "rebate", amountMax: 1500, equipmentTypes: ["Air Source Heat Pump"], description: "Up to $1,500.", eligibilityRules: "Must be Xcel Energy customer.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "ComEd Heat Pump Rebate", provider: "Utility", providerName: "ComEd", state: "IL", programType: "rebate", amountMax: 1000, equipmentTypes: ["Air Source Heat Pump", "Mini-Split"], description: "Up to $1,000.", eligibilityRules: "Must be ComEd customer.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "MassCEC Clean Energy Grant", provider: "State", providerName: "MassCEC", state: "MA", programType: "incentive", amountMax: 3000, equipmentTypes: ["Air Source Heat Pump", "Ground Source Heat Pump"], description: "Additional MassCEC incentives.", eligibilityRules: "Must use approved contractor.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Efficiency Maine Income-Eligible", provider: "State", providerName: "Efficiency Maine", state: "ME", programType: "rebate", amountMax: 8000, equipmentTypes: ["Cold Climate Heat Pump"], description: "Enhanced income-eligible rebate.", eligibilityRules: "Income ≤60% state median.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "NY Affordable Heat Pump Loan", provider: "State", providerName: "NYSERDA", state: "NY", programType: "loan", amountMax: 15000, equipmentTypes: ["Air Source Heat Pump", "Cold Climate Heat Pump"], description: "Low-interest financing.", eligibilityRules: "Income-eligible.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Oregon Low-Income Heat Pump Program", provider: "State", providerName: "Energy Trust of Oregon", state: "OR", programType: "rebate", amountMax: 6000, equipmentTypes: ["Air Source Heat Pump"], description: "Enhanced rebate plus no-cost install.", eligibilityRules: "Income ≤60% AMI.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Mass Save 0% Heat Pump Loan", provider: "State", providerName: "Mass Save", state: "MA", programType: "loan", amountMax: 25000, equipmentTypes: ["Air Source Heat Pump", "Cold Climate Heat Pump"], description: "0% APR financing.", eligibilityRules: "Must use Mass Save contractor.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Federal HPWH Tax Credit", provider: "Federal", providerName: "IRS", state: "US", programType: "tax_credit", amountMax: 2000, percentageCoverage: 30, equipmentTypes: ["Heat Pump Water Heater"], description: "30% tax credit HPWH.", eligibilityRules: "ENERGY STAR UEF ≥ 3.0.", isActive: true, dataSource: "static", isFallbackData: true },
  { name: "Vermont Clean Heat for All", provider: "State", providerName: "Efficiency Vermont", state: "VT", programType: "rebate", amountMax: 6000, equipmentTypes: ["Cold Climate Heat Pump", "Mini-Split"], description: "Income-qualified enhanced rebate.", eligibilityRules: "Income ≤80% AMI.", isActive: true, dataSource: "static", isFallbackData: true },
];

// Helpers
function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals) {
  if (decimals === undefined) decimals = 1;
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// Main seed
async function main() {
  console.log("Seeding Heat Pump Network database...\n");

  // Clear all — use model names as Prisma generates them
  // Some models cascade-delete through Contractor
  await prisma.lead.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.sponsoredPlacement.deleteMany();
  await prisma.contentReviewItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.serviceArea.deleteMany();
  await prisma.contractor.deleteMany();
  await prisma.rebateProgram.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleared existing data");

  // Admin user
  const adminPassword = await hashPassword("admin123!");
  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@heatpump.network", passwordHash: adminPassword, role: "SUPERADMIN" },
  });
  console.log("Admin created (admin@heatpump.network / admin123!)");

  // Rebates
  for (const r of REBATE_DATA) {
    await prisma.rebateProgram.create({
      data: {
        name: r.name, provider: r.provider, providerName: r.providerName, state: r.state,
        programType: r.programType, amountMax: r.amountMax, amountMin: 0,
        amountDescription: "Up to $" + (r.amountMax || 0).toLocaleString(),
        percentageCoverage: r.percentageCoverage || null,
        equipmentTypes: JSON.stringify(r.equipmentTypes),
        description: r.description, eligibilityRules: r.eligibilityRules,
        isActive: r.isActive, dataSource: r.dataSource, isFallbackData: r.isFallbackData,
      },
    });
  }
  console.log(REBATE_DATA.length + " rebates created");

  // Contractors
  let idx = 0;
  const states = Object.keys(CITIES_BY_STATE);
  const contractorIds = [];

  for (const stateCode of states) {
    const cities = CITIES_BY_STATE[stateCode];
    const perState = Math.ceil(50 / states.length);

    for (let i = 0; i < perState && idx < CONTRACTOR_NAMES.length; i++) {
      const name = CONTRACTOR_NAMES[idx];
      const slug = slugify(name) + "-" + stateCode.toLowerCase();
      const city = random(cities);
      const ownerName = random(FIRST_NAMES) + " " + random(LAST_NAMES);
      const isVerified = Math.random() > 0.2;
      const isPremium = isVerified && Math.random() > 0.6;
      const hasExcellence = isVerified && Math.random() > 0.7;
      const rating = isVerified ? randomFloat(3.8, 5.0) : randomFloat(3.0, 4.5);
      const reviewCount = isVerified ? randomInt(5, 45) : randomInt(0, 8);
      const brands = pickN(BRANDS, randomInt(2, 5));
      const certs = pickN(CERTIFICATIONS, randomInt(1, 4));

      const contractor = await prisma.contractor.create({
        data: {
          businessName: name, slug,
          description: name + " is a trusted HVAC contractor serving " + city + " and the surrounding " + stateCode + " area. Specializing in heat pump installations and energy efficiency retrofits.",
          tagline: city + "'s trusted heat pump specialist since " + (2015 + randomInt(0, 8)),
          licenseNumber: stateCode + randomInt(100000, 999999),
          licenseState: stateCode,
          yearsInBusiness: randomInt(2, 25),
          verificationStatus: isVerified ? "VERIFIED" : "PENDING",
          email: slugify(ownerName) + "@" + slugify(name) + ".com",
          phone: "(" + randomInt(200, 999) + ") " + randomInt(200, 999) + "-" + randomInt(1000, 9999),
          website: "https://" + slugify(name) + ".com",
          city, state: stateCode,
          zipCode: "" + randomInt(10000, 99999),
          latitude: randomFloat(41.0, 48.0, 4),
          longitude: randomFloat(-73.0, -89.0, 4),
          logoUrl: null, coverImageUrl: null,
          photoGallery: "[]",
          reviewCount, averageRating: rating,
          responseRate: isVerified ? randomInt(85, 100) : randomInt(50, 80),
          responseTime: random(["Within 30 min", "Within 1 hr", "Within 2 hrs", "Within 4 hrs", "Within 24 hrs"]),
          isPremium, badgeOfExcellence: hasExcellence,
          businessHours: JSON.stringify({ Monday: { open: "08:00", close: "18:00" }, Tuesday: { open: "08:00", close: "18:00" }, Wednesday: { open: "08:00", close: "18:00" }, Thursday: { open: "08:00", close: "18:00" }, Friday: { open: "08:00", close: "17:00" }, Saturday: { open: "09:00", close: "14:00" } }),
          serviceBrands: JSON.stringify(brands),
          certifications: JSON.stringify(certs),
          isVerified, verifiedAt: isVerified ? new Date() : null,
          leadBalance: isVerified ? randomInt(5, 50) : 0,
        },
      });

      contractorIds.push(contractor.id);

      // Service area
      await prisma.serviceArea.create({
        data: { contractorId: contractor.id, city, state: stateCode, zipCodes: JSON.stringify(["" + randomInt(10000, 99999)]), radiusMiles: randomInt(25, 60), isPrimary: true },
      });

      const nearby = cities.filter((c) => c !== city);
      if (nearby.length > 0) {
        await prisma.serviceArea.create({
          data: { contractorId: contractor.id, city: random(nearby), state: stateCode, radiusMiles: randomInt(15, 40), isPrimary: false },
        });
      }

      // Case studies
      if (isVerified && Math.random() > 0.3) {
        const numStudies = randomInt(1, 4);
        const studies = [...CASE_STUDY_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, numStudies);
        for (const t of studies) {
          const reviewTexts = [
            "Excellent service! Our energy bills dropped dramatically.",
            "Very professional team. They explained everything clearly.",
            "Great installation. The house is so much more comfortable now.",
            "Couldn't be happier with the results. Highly recommend!",
            "Knowledgeable and fair pricing. The savings have been incredible.",
          ];
          await prisma.caseStudy.create({
            data: {
              contractorId: contractor.id,
              title: t.title,
              slug: slugify(t.title) + "-" + contractor.id.slice(0, 8),
              summary: "Completed in " + city + ", " + stateCode + ". Replaced " + t.previousSystem + " with " + t.installedSystem + ". Estimated annual savings: $" + t.savingsDollars + ".",
              content: "This project involved replacing an existing " + t.previousSystem + " with a " + t.installedSystem + " in a " + t.homeSize + " sq ft home in " + city + ", " + stateCode + ". Total project cost was $" + t.totalCost.toLocaleString() + " with estimated payback of " + t.paybackYears + " years including rebates.",
              equipmentType: t.equipmentType,
              homeType: "Single Family", homeSize: t.homeSize,
              previousSystem: t.previousSystem,
              installedSystem: t.installedSystem,
              estimatedAnnualSavings: t.savingsDollars,
              energyReductionPercent: t.reductionPercent,
              totalProjectCost: t.totalCost,
              paybackPeriod: t.paybackYears,
              beforeImages: "[]", afterImages: "[]",
              customerName: random(FIRST_NAMES) + " " + random(LAST_NAMES),
              customerReview: random(reviewTexts),
              isPublished: true, adminApproved: true, approvedAt: new Date(), approvedBy: admin.id,
            },
          });
        }
      }

      // Reviews
      if (isVerified && rating > 3.5) {
        const numReviews = Math.min(reviewCount, 8);
        const rTexts = [
          "Excellent service. They explained everything clearly.",
          "Very knowledgeable team. The savings have been incredible.",
          "Professional, punctual, and fairly priced.",
          "Good work. The heat pump has been working perfectly.",
          "Transparent pricing and no pressure sales.",
          "Highly recommend to anyone considering a heat pump.",
        ];
        for (let r = 0; r < numReviews; r++) {
          const rRating = Math.max(1, Math.min(5, Math.round(rating + randomFloat(-1, 1, 0))));
          await prisma.review.create({
            data: {
              contractorId: contractor.id,
              reviewerName: random(FIRST_NAMES) + " " + random(LAST_NAMES),
              reviewerEmail: "reviewer" + r + "@example.com",
              rating: rRating,
              title: random(["Great experience!", "Highly recommend", "Professional service", "Satisfied customer"]),
              content: random(rTexts),
              status: "APPROVED", isVerified: Math.random() > 0.5,
            },
          });
        }
      }

      idx++;
    }
  }
  console.log(idx + " contractors created");

  // Sponsored placements
  const verified = await prisma.contractor.findMany({ where: { isVerified: true }, take: 5, orderBy: { averageRating: "desc" } });
  for (let i = 0; i < Math.min(5, verified.length); i++) {
    const c = verified[i];
    const end = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    await prisma.sponsoredPlacement.create({
      data: {
        contractorId: c.id,
        city: i === 0 ? null : c.city, state: i === 0 ? null : c.state,
        isGlobal: i === 0, placementType: "FEATURED_CARD",
        title: "Featured: " + c.businessName,
        description: "Verified heat pump installer in " + c.city + ", " + c.state + ".",
        isActive: true, monthlyRateCents: 29900,
        startsAt: new Date(), endsAt: end, autoRenew: true,
      },
    });
  }
  console.log(Math.min(5, verified.length) + " sponsored placements created");

  // Sample lead
  if (verified.length > 0) {
    await prisma.lead.create({
      data: {
        contractorId: verified[0].id, firstName: "Jane", lastName: "Smith",
        email: "jane@example.com", phone: "(555) 123-4567",
        city: verified[0].city, state: verified[0].state, zipCode: "02108",
        projectType: "Full Heat Pump Installation", homeSize: 2000,
        currentHeating: "Natural Gas", preferredTimeline: "Within 30 days",
        status: "NEW", source: "profile_page", creditDeducted: false,
      },
    });
  }

  // Content review queue
  await prisma.contentReviewItem.createMany({
    data: [
      { contentType: "CITY_INTRO", title: "Portland, OR Heat Pump Guide", content: "Portland homeowners are increasingly turning to heat pumps for year-round comfort with lower energy bills.", targetUrl: "/installers/portland-or", status: "PENDING", generatedBy: "AI Generator" },
      { contentType: "META_DESCRIPTION", title: "Boston Installers Meta", content: "Find top-rated heat pump installers in Boston, MA. Compare verified contractors and get free quotes.", targetUrl: "/installers/boston-ma", status: "PENDING", generatedBy: "AI Generator" },
      { contentType: "FAQ_ANSWER", title: "Are heat pumps effective in cold climates?", content: "Yes. Modern cold-climate heat pumps maintain full heating capacity at temperatures as low as -13°F.", targetUrl: "/cost-to-install-heat-pump/burlington", status: "PENDING", generatedBy: "AI Generator" },
    ],
  });

  console.log("3 content review items created");
  console.log("\nSeed complete!");
  console.log("Admin: admin@heatpump.network / admin123!");
  console.log("Run: npm run dev");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
