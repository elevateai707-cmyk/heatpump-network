/**
 * SAMPLE STATIC REBATE DATA — Fallback for DSIRE API
 *
 * IMPORTANT: This is sample data for development/testing only.
 * In production, replace with live data from:
 *   - DSIRE API: https://www.dsireusa.org/
 *   - NREL API: https://developer.nrel.gov/
 *   - State utility websites
 *
 * This data represents realistic estimates based on publicly available
 * information but should NOT be used as definitive rebate amounts.
 * Always verify with the actual program administrator.
 *
 * Marked as isFallbackData=true when stored in the database.
 */

export interface RebateData {
  name: string;
  provider: string;
  providerName: string;
  state: string;
  programType: "rebate" | "tax_credit" | "loan" | "incentive";
  amountDescription: string;
  amountMin: number | null;
  amountMax: number | null;
  amountFixed: number | null;
  percentageCoverage: number | null;
  equipmentTypes: string[];
  description: string;
  eligibilityRules: string;
  applicationUrl: string | null;
  incomeLimit: number | null;
  requiresExisting: string | null;
}

/**
 * Federal tax credits (apply to ALL target states)
 */
const FEDERAL_CREDITS: RebateData[] = [
  {
    name: "Federal Energy Efficient Home Improvement Credit",
    provider: "Federal",
    providerName: "IRS",
    state: "US",
    programType: "tax_credit",
    amountDescription: "30% of cost, up to $2,000",
    amountMin: null,
    amountMax: 2000,
    amountFixed: null,
    percentageCoverage: 30,
    equipmentTypes: ["Air Source Heat Pump", "Mini-Split", "Central Heat Pump"],
    description:
      "Federal tax credit covering 30% of the cost of qualified heat pump installations, up to $2,000 per year. Available through 2032. No income limit.",
    eligibilityRules:
      "Must install an ENERGY STAR certified heat pump. Must be an existing home (not new construction). Primary residence only. Cannot exceed $2,000 maximum annual credit.",
    applicationUrl: "https://www.energystar.gov/about/federal_tax_credits",
    incomeLimit: null,
    requiresExisting: "Existing home only",
  },
  {
    name: "High-Efficiency Heat Pump Tax Credit",
    provider: "Federal",
    providerName: "IRS",
    state: "US",
    programType: "tax_credit",
    amountDescription: "Up to $2,000 for qualifying high-efficiency units",
    amountMin: null,
    amountMax: 2000,
    amountFixed: null,
    percentageCoverage: 30,
    equipmentTypes: ["Cold Climate Heat Pump", "High-Efficiency Heat Pump"],
    description:
      "Enhanced tax credit for cold-climate heat pumps meeting the highest efficiency tiers. 30% of cost up to $2,000.",
    eligibilityRules:
      "Unit must meet CEE advanced tier or equivalent efficiency standards. Must have HSPF2 ≥ 10.0 and SEER2 ≥ 18.0.",
    applicationUrl: "https://www.energystar.gov/about/federal_tax_credits",
    incomeLimit: null,
    requiresExisting: "Existing home only",
  },
  {
    name: "Heat Pump Water Heater Tax Credit",
    provider: "Federal",
    providerName: "IRS",
    state: "US",
    programType: "tax_credit",
    amountDescription: "30% of cost, up to $2,000",
    amountMin: null,
    amountMax: 2000,
    amountFixed: null,
    percentageCoverage: 30,
    equipmentTypes: ["Heat Pump Water Heater"],
    description:
      "Federal tax credit for heat pump water heaters meeting ENERGY STAR requirements. 30% of cost, up to $2,000.",
    eligibilityRules:
      "Must install an ENERGY STAR certified heat pump water heater with UEF ≥ 3.0.",
    applicationUrl: "https://www.energystar.gov/about/federal_tax_credits",
    incomeLimit: null,
    requiresExisting: "Existing home only",
  },
];

/**
 * State-specific rebates for target states
 */
const STATE_REBATES: Record<string, RebateData[]> = {
  MA: [
    {
      name: "Mass Save Heat Pump Rebate",
      provider: "State",
      providerName: "Mass Save",
      state: "MA",
      programType: "rebate",
      amountDescription: "Up to $15,000 for whole-home heat pumps",
      amountMin: 1000,
      amountMax: 15000,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Cold Climate Heat Pump", "Mini-Split"],
      description:
        "Mass Save offers substantial rebates for heat pump installations. Income-eligible households can receive up to $15,000. Standard rebates up to $5,000.",
      eligibilityRules:
        "Must use a Mass Save participating contractor. Income-eligible households (≤60% of state median income) qualify for enhanced rebates. Home must be owner-occupied.",
      applicationUrl: "https://www.masssave.com/savings/rebates/heat-pumps",
      incomeLimit: 70000,
      requiresExisting: "Existing home only",
    },
    {
      name: "Massachusetts Clean Energy Center Grant",
      provider: "State",
      providerName: "MassCEC",
      state: "MA",
      programType: "incentive",
      amountDescription: "Up to $1,000 per ton",
      amountMin: 500,
      amountMax: 3000,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Ground Source Heat Pump"],
      description:
        "Additional incentives for air-source and ground-source heat pump installations through the MassCEC.",
      eligibilityRules:
        "Must work with an approved contractor. Additional income-based incentives available.",
      applicationUrl: "https://www.masscec.com/programs",
      incomeLimit: null,
      requiresExisting: null,
    },
  ],
  NY: [
    {
      name: "NYS Clean Heat Rebate",
      provider: "State",
      providerName: "NYSERDA",
      state: "NY",
      programType: "rebate",
      amountDescription: "Up to $8,000 for heat pump installation",
      amountMin: 2000,
      amountMax: 8000,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Cold Climate Heat Pump", "Ground Source Heat Pump"],
      description:
        "New York's Clean Heat program offers substantial rebates for heat pump installation. Enhanced incentives for low-to-moderate income households.",
      eligibilityRules:
        "Must use a NYSERDA participating contractor. Income-based incentives available for households under 80% of AMI.",
      applicationUrl: "https://www.nyserda.ny.gov/clean-heat",
      incomeLimit: null,
      requiresExisting: "Existing home only",
    },
    {
      name: "Con Edison Heat Pump Rebate",
      provider: "Utility",
      providerName: "Con Edison",
      state: "NY",
      programType: "rebate",
      amountDescription: "Up to $5,000 for heat pump installation",
      amountMin: 1000,
      amountMax: 5000,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Mini-Split"],
      description:
        "Con Edison customers can receive rebates for heat pump installations in their service territory.",
      eligibilityRules:
        "Must be a Con Edison electric customer. Must use approved equipment. Homeowner must use a participating contractor.",
      applicationUrl: "https://www.coned.com/en/save-money/rebates-incentives",
      incomeLimit: null,
      requiresExisting: "Existing home only",
    },
  ],
  OR: [
    {
      name: "Energy Trust of Oregon Heat Pump Rebate",
      provider: "State",
      providerName: "Energy Trust of Oregon",
      state: "OR",
      programType: "rebate",
      amountDescription: "Up to $3,200 for heat pump installation",
      amountMin: 500,
      amountMax: 3200,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Ductless Heat Pump", "Heat Pump Water Heater"],
      description:
        "Energy Trust of Oregon provides cash incentives for heat pump installations to residential customers of Portland General Electric, Pacific Power, NW Natural, and Cascade Natural Gas.",
      eligibilityRules:
        "Must be a customer of a participating utility. Must use a Trade Ally contractor. Equipment must meet efficiency requirements.",
      applicationUrl: "https://www.energytrust.org/rebates/heat-pumps/",
      incomeLimit: null,
      requiresExisting: null,
    },
  ],
  WA: [
    {
      name: "Washington State Heat Pump Rebate",
      provider: "State",
      providerName: "Washington Department of Commerce",
      state: "WA",
      programType: "rebate",
      amountDescription: "Up to $10,000 for income-qualified households",
      amountMin: 2000,
      amountMax: 10000,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Mini-Split", "Cold Climate Heat Pump"],
      description:
        "Washington state offers significant rebates for heat pump installation, with enhanced amounts for income-qualified households.",
      eligibilityRules:
        "Income-qualified households (≤80% of AMI) eligible for enhanced rebates. Must use a registered contractor.",
      applicationUrl: "https://www.commerce.wa.gov/energy/heat-pumps/",
      incomeLimit: null,
      requiresExisting: "Existing home only",
    },
    {
      name: "Puget Sound Energy Heat Pump Rebate",
      provider: "Utility",
      providerName: "Puget Sound Energy",
      state: "WA",
      programType: "rebate",
      amountDescription: "Up to $2,500 for heat pump installation",
      amountMin: 500,
      amountMax: 2500,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Ductless Heat Pump"],
      description:
        "PSE customers can receive rebates for installing energy-efficient heat pumps. Additional financing options available.",
      eligibilityRules:
        "Must be a PSE electric customer. Equipment must meet ENERGY STAR requirements. Contractor must be PSE-approved.",
      applicationUrl: "https://www.pse.com/en/savings/rebates",
      incomeLimit: null,
      requiresExisting: null,
    },
  ],
  VT: [
    {
      name: "Efficiency Vermont Heat Pump Rebate",
      provider: "State",
      providerName: "Efficiency Vermont",
      state: "VT",
      programType: "rebate",
      amountDescription: "Up to $4,000 for heat pump installation",
      amountMin: 500,
      amountMax: 4000,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Cold Climate Heat Pump", "Mini-Split", "Air Source Heat Pump"],
      description:
        "Efficiency Vermont offers rebates for cold-climate heat pump installations. Enhanced rebates available for oil-to-heat-pump conversions.",
      eligibilityRules:
        "Must use an Efficiency Vermont recognized contractor. Equipment must be on the Cold Climate Heat Pump list. Existing homes only.",
      applicationUrl: "https://www.efficiencyvermont.com/rebates/heat-pumps",
      incomeLimit: null,
      requiresExisting: "Existing home only",
    },
  ],
  ME: [
    {
      name: "Efficiency Maine Heat Pump Rebate",
      provider: "State",
      providerName: "Efficiency Maine",
      state: "ME",
      programType: "rebate",
      amountDescription: "Up to $4,200 for heat pump installation",
      amountMin: 400,
      amountMax: 4200,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Cold Climate Heat Pump", "Mini-Split", "Central Heat Pump"],
      description:
        "Efficiency Maine provides some of the most generous heat pump rebates in the country. Income-eligible households receive enhanced incentives.",
      eligibilityRules:
        "Must use an Efficiency Maine participating contractor. Income-eligible households (≤60% of state median) qualify for higher rebates.",
      applicationUrl: "https://www.efficiencymaine.com/heat-pumps/",
      incomeLimit: null,
      requiresExisting: "Existing home only",
    },
  ],
  MN: [
    {
      name: "Minnesota Heat Pump Rebate Program",
      provider: "State",
      providerName: "Minnesota Department of Commerce",
      state: "MN",
      programType: "rebate",
      amountDescription: "Up to $4,000 for heat pump installation",
      amountMin: 1000,
      amountMax: 4000,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Cold Climate Heat Pump"],
      description:
        "Minnesota offers state rebates for cold-climate heat pump installations. Income-qualified households eligible for enhanced rebates.",
      eligibilityRules:
        "Must use a licensed Minnesota contractor. Equipment must be ENERGY STAR certified and rated for cold climate use.",
      applicationUrl: "https://mn.gov/commerce/energy/heat-pumps/",
      incomeLimit: null,
      requiresExisting: null,
    },
    {
      name: "Xcel Energy Heat Pump Rebate",
      provider: "Utility",
      providerName: "Xcel Energy",
      state: "MN",
      programType: "rebate",
      amountDescription: "Up to $1,500 for heat pump installation",
      amountMin: 300,
      amountMax: 1500,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Ductless Heat Pump"],
      description:
        "Xcel Energy Minnesota customers can receive rebates for qualifying heat pump installations.",
      eligibilityRules:
        "Must be an Xcel Energy customer. Equipment must meet efficiency requirements. Rebate varies by equipment type and efficiency level.",
      applicationUrl: "https://www.xcelenergy.com/rebates",
      incomeLimit: null,
      requiresExisting: null,
    },
  ],
  IL: [
    {
      name: "Illinois Heat Pump Rebate",
      provider: "State",
      providerName: "Illinois Department of Commerce & Economic Opportunity",
      state: "IL",
      programType: "rebate",
      amountDescription: "Up to $5,000 for heat pump installation",
      amountMin: 1000,
      amountMax: 5000,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Cold Climate Heat Pump", "Ground Source Heat Pump"],
      description:
        "Illinois offers rebates for heat pump installations through the state energy office. Enhanced incentives for income-qualified households.",
      eligibilityRules:
        "Must use a licensed Illinois contractor. Equipment must meet ENERGY STAR standards. Income-eligible households receive enhanced rebates.",
      applicationUrl: "https://www2.illinois.gov/dceo/energy/heatpumps",
      incomeLimit: null,
      requiresExisting: null,
    },
    {
      name: "ComEd Heat Pump Rebate",
      provider: "Utility",
      providerName: "ComEd",
      state: "IL",
      programType: "rebate",
      amountDescription: "Up to $1,000 for qualifying heat pumps",
      amountMin: 300,
      amountMax: 1000,
      amountFixed: null,
      percentageCoverage: null,
      equipmentTypes: ["Air Source Heat Pump", "Mini-Split"],
      description:
        "ComEd customers in northern Illinois can receive rebates for heat pump installations.",
      eligibilityRules:
        "Must be a ComEd customer. Contractor must be ComEd-approved. Equipment must be ENERGY STAR certified.",
      applicationUrl: "https://www.comed.com/rebates",
      incomeLimit: null,
      requiresExisting: null,
    },
  ],
};

// Climate zone data (from NREL/DOE)
export const CLIMATE_ZONES: Record<string, { zone: string; description: string; avgWinterTemp: number; avgSummerTemp: number; recommendedHSPF: number; recommendedSEER: number; cities: string[] }> = {
  "4C": { zone: "4C", description: "Marine — Cool, moist winters; mild summers", avgWinterTemp: 37, avgSummerTemp: 72, recommendedHSPF: 9.0, recommendedSEER: 15, cities: ["Portland, OR", "Seattle, WA", "Olympia, WA"] },
  "5A": { zone: "5A", description: "Cool-Humid — Cold winters; warm, humid summers", avgWinterTemp: 25, avgSummerTemp: 75, recommendedHSPF: 9.5, recommendedSEER: 15, cities: ["Chicago, IL", "Minneapolis, MN", "Boston, MA", "Portland, ME"] },
  "5B": { zone: "5B", description: "Cool-Dry — Cold, dry winters; hot, dry summers", avgWinterTemp: 27, avgSummerTemp: 76, recommendedHSPF: 9.5, recommendedSEER: 15, cities: [] },
  "6A": { zone: "6A", description: "Cold-Humid — Very cold winters; warm summers", avgWinterTemp: 18, avgSummerTemp: 72, recommendedHSPF: 10.0, recommendedSEER: 14, cities: ["Burlington, VT", "Rochester, NY", "Buffalo, NY", "St. Paul, MN"] },
  "6B": { zone: "6B", description: "Cold-Dry — Very cold, dry winters; warm summers", avgWinterTemp: 16, avgSummerTemp: 74, recommendedHSPF: 10.0, recommendedSEER: 14, cities: [] },
  "7": { zone: "7", description: "Very Cold — Extremely cold winters; cool summers", avgWinterTemp: 8, avgSummerTemp: 68, recommendedHSPF: 10.5, recommendedSEER: 13, cities: [] },
};

// City → climate zone mapping
export const CITY_CLIMATE_ZONES: Record<string, string> = {
  "portland-or": "4C", "seattle-wa": "4C", "olympia-wa": "4C",
  "boston-ma": "5A", "worcester-ma": "5A", "springfield-ma": "5A",
  "new-york-ny": "5A", "buffalo-ny": "6A", "rochester-ny": "6A", "albany-ny": "6A", "syracuse-ny": "6A",
  "burlington-vt": "6A", "montpelier-vt": "6A", "rutland-vt": "6A",
  "portland-me": "5A", "augusta-me": "5A", "bangor-me": "5A",
  "minneapolis-mn": "5A", "st-paul-mn": "5A", "duluth-mn": "6A", "rochester-mn": "5A",
  "chicago-il": "5A", "peoria-il": "5A", "springfield-il": "5A", "rockford-il": "5A",
};

// Cost estimates by region
export const COST_ESTIMATES: Record<string, { low: number; high: number; average: number; unit: string }> = {
  "base": { low: 4500, high: 16000, average: 8500, unit: "per unit" },
  "cold-climate": { low: 6000, high: 20000, average: 12000, unit: "per unit" },
  "mini-split-single": { low: 3000, high: 8000, average: 5000, unit: "per zone" },
  "mini-split-multi": { low: 8000, high: 25000, average: 15000, unit: "multi-zone" },
  "ground-source": { low: 15000, high: 40000, average: 25000, unit: "per system" },
};

/**
 * Get all rebates for a specific state
 */
export function getRebatesByState(state: string): RebateData[] {
  const stateKey = state.toUpperCase().replace("-", "_");
  const stateRebates = STATE_REBATES[stateKey] || [];
  return [...FEDERAL_CREDITS, ...stateRebates];
}

/**
 * Get rebate programs filtered by equipment type
 */
export function getRebatesByEquipment(
  state: string,
  equipmentType: string
): RebateData[] {
  return getRebatesByState(state).filter((r) =>
    r.equipmentTypes.some(
      (t) => t.toLowerCase().includes(equipmentType.toLowerCase())
    )
  );
}

/**
 * Get climate zone for a city slug
 */
export function getClimateZone(citySlug: string): { zone: string; data: typeof CLIMATE_ZONES[string] } | null {
  const zoneKey = CITY_CLIMATE_ZONES[citySlug];
  if (!zoneKey || !CLIMATE_ZONES[zoneKey]) return null;
  return { zone: zoneKey, data: CLIMATE_ZONES[zoneKey] };
}
