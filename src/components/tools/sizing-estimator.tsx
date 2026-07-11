/**
 * Heat Pump Sizing & Cost Estimator
 * Interactive tool: home size, climate, current system → size + cost estimate
 * Based on NREL/DOE climate zone data with static fallback
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Thermometer, DollarSign, Home, Percent, TrendingDown } from "lucide-react";
import { CITY_CLIMATE_ZONES, CLIMATE_ZONES, COST_ESTIMATES, getRebatesByState } from "@/data/rebates-fallback";

export function SizingEstimator() {
  const [homeSize, setHomeSize] = useState("1500");
  const [homeType, setHomeType] = useState("single");
  const [currentSystem, setCurrentSystem] = useState("gas");
  const [zipCode, setZipCode] = useState("");
  const [insulation, setInsulation] = useState("average");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Simple ZIP to state mapping
  const zipPrefixToState: Record<string, string> = {
    "97": "OR", "98": "WA", "99": "WA",
    "01": "MA", "02": "MA", "10": "NY", "11": "NY", "12": "NY", "13": "NY", "14": "NY",
    "05": "VT", "04": "ME", "55": "MN", "56": "MN",
    "60": "IL", "61": "IL", "62": "IL",
  };

  function detectState(zip: string): string {
    return zipPrefixToState[zip.slice(0, 2)] || "MA";
  }

  function handleCalculate() {
    setLoading(true);

    setTimeout(() => {
      const sqft = parseInt(homeSize) || 1500;
      const state = detectState(zipCode || "02108");
      const climateKey = Object.values(CITY_CLIMATE_ZONES)[0] || "5A";
      const climate = CLIMATE_ZONES[climateKey];

      // Sizing calculation (simplified Manual J approximation)
      // Standard: 1 ton per 500-600 sq ft for average insulation
      const baseFactor = insulation === "poor" ? 400 : insulation === "average" ? 550 : 650;
      const baseTons = Math.ceil(sqft / baseFactor);

      // Climate adjustment
      const climateFactor = climate
        ? climate.avgWinterTemp < 20
          ? 1.3
          : climate.avgWinterTemp < 30
            ? 1.15
            : 1.0
        : 1.0;
      const adjustedTons = Math.ceil(baseTons * climateFactor);

      // Cost estimate
      const costBase = climate && climate.avgWinterTemp < 20
        ? COST_ESTIMATES["cold-climate"]
        : COST_ESTIMATES["base"];
      const lowCost = costBase.low * adjustedTons;
      const highCost = costBase.high * adjustedTons;
      const avgCost = costBase.average * adjustedTons;

      // Energy savings estimate (vs current system)
      const savingsBySystem: Record<string, { low: number; high: number }> = {
        oil: { low: 800, high: 2500 },
        propane: { low: 600, high: 2000 },
        electric: { low: 400, high: 1500 },
        gas: { low: 200, high: 800 },
        heatpump: { low: 100, high: 400 },
      };
      const savings = savingsBySystem[currentSystem] || { low: 200, high: 800 };

      // Rebate estimates
      const rebates = getRebatesByState(state);
      const totalRebates = rebates.reduce(
        (sum, r) => sum + (r.amountMax || r.amountFixed || 0),
        0
      );

      setResults({
        recommendedTons: adjustedTons,
        btu: adjustedTons * 12000,
        cost: { low: lowCost, high: highCost, average: avgCost },
        annualSavings: savings,
        paybackYears: Math.round(avgCost / ((savings.low + savings.high) / 2 + totalRebates / 5)),
        rebatesAvailable: totalRebates,
        climateInfo: climate,
        hspfRating: climate?.recommendedHSPF || 9.5,
        seerRating: climate?.recommendedSEER || 15,
        zone: climateKey,
      });

      setLoading(false);
    }, 1000);
  }

  return (
    <div className="card-base overflow-hidden">
      <div className="bg-gradient-to-r from-secondary/5 to-secondary/10 p-6">
        <h2 className="text-xl font-bold mb-2">
          Heat Pump Sizing & Cost Estimator
        </h2>
        <p className="text-sm text-text-muted">
          Get an estimated heat pump size, installation cost, and energy savings
          based on your home details.
        </p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1">
              Home Size (sq ft)
            </label>
            <input
              type="number"
              value={homeSize}
              onChange={(e) => setHomeSize(e.target.value)}
              min={500}
              max={10000}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1">
              Home Type
            </label>
            <select
              value={homeType}
              onChange={(e) => setHomeType(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="single">Single Family</option>
              <option value="duplex">Duplex / Townhouse</option>
              <option value="multi">Multi-Family (2-4 units)</option>
              <option value="apartment">Apartment / Condo</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={5}
              placeholder="Enter ZIP"
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1">
              Current Heating System
            </label>
            <select
              value={currentSystem}
              onChange={(e) => setCurrentSystem(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="gas">Natural Gas</option>
              <option value="oil">Oil</option>
              <option value="propane">Propane</option>
              <option value="electric">Electric Baseboard</option>
              <option value="heatpump">Existing Heat Pump</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1">
              Insulation Quality
            </label>
            <select
              value={insulation}
              onChange={(e) => setInsulation(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="poor">Poor / Older Home</option>
              <option value="average">Average</option>
              <option value="good">Good / Well-Insulated</option>
            </select>
          </div>
        </div>

        <Button onClick={handleCalculate} disabled={loading}>
          <Thermometer className="h-4 w-4" />
          {loading ? "Calculating..." : "Calculate Estimate"}
        </Button>

        {results && !loading && (
          <div className="mt-6 space-y-6">
            {/* Size result */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary/5 rounded-lg p-4 text-center">
                <Thermometer className="h-6 w-6 text-secondary mx-auto mb-1" />
                <p className="text-2xl font-bold text-secondary">
                  {results.recommendedTons}-ton
                </p>
                <p className="text-xs text-text-muted">
                  Recommended Size ({results.btu.toLocaleString()} BTU)
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4 text-center">
                <DollarSign className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold text-primary">
                  ${results.cost.average.toLocaleString()}
                </p>
                <p className="text-xs text-text-muted">
                  Estimated Average Cost
                </p>
              </div>
              <div className="bg-success/5 rounded-lg p-4 text-center">
                <TrendingDown className="h-6 w-6 text-success mx-auto mb-1" />
                <p className="text-2xl font-bold text-success">
                  ${results.annualSavings.low}–${results.annualSavings.high}
                </p>
                <p className="text-xs text-text-muted">
                  Est. Annual Energy Savings
                </p>
              </div>
              <div className="bg-accent/5 rounded-lg p-4 text-center">
                <DollarSign className="h-6 w-6 text-accent-dark mx-auto mb-1" />
                <p className="text-2xl font-bold text-accent-dark">
                  ${results.rebatesAvailable.toLocaleString()}
                </p>
                <p className="text-xs text-text-muted">
                  Available Rebates & Credits
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Estimate Details</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Cost Range</span>
                  <span className="font-medium">
                    ${results.cost.low.toLocaleString()} – $
                    {results.cost.high.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Payback Period</span>
                  <span className="font-medium">
                    ~{results.paybackYears} years (with savings + rebates)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Recommended HSPF</span>
                  <span className="font-medium">{results.hspfRating}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Recommended SEER</span>
                  <span className="font-medium">{results.seerRating}+</span>
                </div>
                {results.climateInfo && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Climate Zone</span>
                    <span className="font-medium">
                      {results.zone} — {results.climateInfo.description}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-muted">Energy Reduction</span>
                  <span className="font-medium text-success">
                    {currentSystem === "oil"
                      ? "40–60%"
                      : currentSystem === "electric"
                        ? "30–50%"
                        : "20–40%"}{" "}
                    estimated
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-text-muted p-3 bg-surface-muted rounded-lg">
              <strong>Disclaimer:</strong> This is a simplified estimate based
              on typical values. A professional Manual J load calculation is
              required for accurate sizing. Costs vary by region, equipment
              brand, installation complexity, and contractor. Always obtain
              multiple quotes from verified contractors.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
