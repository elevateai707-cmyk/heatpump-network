/**
 * Rebate Eligibility Calculator
 * Interactive tool: ZIP → income → heating type → eligibility results
 * Uses static fallback data; in production, connect to DSIRE API
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { getRebatesByState } from "@/data/rebates-fallback";

export function RebateCalculator() {
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [income, setIncome] = useState("");
  const [heatingType, setHeatingType] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Simple ZIP → state mapping for demo
  const zipToState: Record<string, string> = {
    "97": "OR", "98": "WA", "99": "WA",
    "01": "MA", "02": "MA", "10": "NY", "11": "NY", "12": "NY", "13": "NY", "14": "NY",
    "05": "VT", "04": "ME", "55": "MN", "56": "MN",
    "60": "IL", "61": "IL", "62": "IL",
  };

  function detectState(zipCode: string): string {
    const prefix = zipCode.slice(0, 2);
    return zipToState[prefix] || "";
  }

  function handleSearch() {
    setLoading(true);
    setSearched(true);

    // Simulate calculation delay
    setTimeout(() => {
      const detectedState = state || detectState(zip) || "MA";
      const allRebates = getRebatesByState(detectedState);

      // Filter by heating type
      let filtered = allRebates;
      if (heatingType) {
        filtered = allRebates.filter((r) =>
          r.equipmentTypes.some((t) =>
            t.toLowerCase().includes(heatingType.toLowerCase())
          )
        );
      }

      // If no match by equipment, show all
      if (filtered.length === 0) filtered = allRebates;

      // Sort by relevance (amount)
      filtered.sort((a, b) => (b.amountMax || 0) - (a.amountMax || 0));

      setResults(filtered);
      setLoading(false);
    }, 800);
  }

  const totalEstimated = results
    ? results.reduce((sum, r) => sum + (r.amountMax || r.amountFixed || 0), 0)
    : 0;

  return (
    <div className="card-base overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6">
        <h2 className="text-xl font-bold mb-2">Rebate Eligibility Calculator</h2>
        <p className="text-sm text-text-muted">
          Find out how much you could save with federal tax credits, state
          rebates, and utility incentives.
        </p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              placeholder="Enter ZIP"
              maxLength={5}
              value={zip}
              onChange={(e) => {
                setZip(e.target.value);
                if (e.target.value.length >= 2) {
                  const s = detectState(e.target.value);
                  if (s) setState(s);
                }
              }}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1">
              State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Auto-detect from ZIP</option>
              <option value="OR">Oregon</option>
              <option value="WA">Washington</option>
              <option value="MA">Massachusetts</option>
              <option value="NY">New York</option>
              <option value="VT">Vermont</option>
              <option value="ME">Maine</option>
              <option value="MN">Minnesota</option>
              <option value="IL">Illinois</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1">
              Annual Household Income
            </label>
            <select
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select income range</option>
              <option value="low">Under $50,000</option>
              <option value="medium">$50,000 — $100,000</option>
              <option value="high">$100,000 — $200,000</option>
              <option value="very-high">Over $200,000</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1">
              Current Heating System
            </label>
            <select
              value={heatingType}
              onChange={(e) => setHeatingType(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select system</option>
              <option value="heat pump">Existing Heat Pump</option>
              <option value="gas">Natural Gas Furnace</option>
              <option value="oil">Oil Furnace</option>
              <option value="electric">Electric Baseboard</option>
              <option value="propane">Propane</option>
            </select>
          </div>
        </div>

        <Button onClick={handleSearch} disabled={loading || (!zip && !state)}>
          <Calculator className="h-4 w-4" />
          {loading ? "Calculating..." : "Check Eligibility"}
        </Button>

        {/* Results */}
        {searched && !loading && (
          <div className="mt-6 space-y-4">
            {/* Total estimate */}
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-sm text-text-muted mb-1">
                Estimated Total Available
              </p>
              <p className="text-3xl font-bold text-primary">
                ${totalEstimated.toLocaleString()}
              </p>
              <p className="text-xs text-text-muted mt-1">
                in federal, state, and utility incentives
              </p>
            </div>

            {results && results.length > 0 ? (
              <div className="space-y-3">
                {results.map((rebate, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">
                            {rebate.name}
                          </h3>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              rebate.programType === "tax_credit"
                                ? "bg-secondary/10 text-secondary"
                                : rebate.programType === "rebate"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-accent/10 text-accent-dark"
                            }`}
                          >
                            {rebate.programType === "tax_credit"
                              ? "Tax Credit"
                              : rebate.programType === "rebate"
                                ? "Rebate"
                                : "Incentive"}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">
                          {rebate.providerName} · {rebate.state === "US" ? "Federal" : rebate.state}
                        </p>
                        <p className="text-sm mt-2">{rebate.description}</p>
                        {rebate.incomeLimit && income === "low" && (
                          <p className="text-xs text-success mt-1 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Income-eligible for enhanced rebate
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-primary">
                          {rebate.amountFixed
                            ? `$${rebate.amountFixed.toLocaleString()}`
                            : `$${(rebate.amountMax || 0).toLocaleString()}`}
                        </p>
                        <p className="text-xs text-text-muted">
                          {rebate.amountDescription}
                        </p>
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

                    <div className="mt-2 text-xs text-text-muted bg-surface-muted rounded p-2">
                      <strong>Eligibility:</strong> {rebate.eligibilityRules}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-text-muted">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>No rebates found for your selection.</p>
                <p className="text-xs mt-1">
                  Try a different state or heating type.
                </p>
              </div>
            )}

            <div className="text-xs text-text-muted mt-4 p-3 bg-surface-muted rounded-lg">
              <strong>Disclaimer:</strong> This tool provides estimated rebate
              amounts based on publicly available data. Actual rebate amounts
              and eligibility depend on your specific circumstances. Always
              verify with the program administrator before making purchasing
              decisions. Rebate amounts may change without notice.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
