/**
 * Contractor Profile — Case Studies Section
 * E-E-A-T critical: before/after with energy savings data
 * JSON-LD: HowTo schema for each case study
 */

"use client";

import { useState } from "react";
import { FileText, TrendingDown, DollarSign, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDollars } from "@/lib/utils";

interface Props {
  caseStudies: any[];
}

export function ProfileCaseStudies({ caseStudies }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (caseStudies.length === 0) return null;

  return (
    <div className="card-base p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Project Case Studies
        <span className="text-sm font-normal text-text-muted">
          ({caseStudies.length})
        </span>
      </h2>

      <div className="space-y-4">
        {caseStudies.map((study) => {
          let beforeImages: string[] = [];
          let afterImages: string[] = [];
          try { beforeImages = JSON.parse(study.beforeImages || "[]"); } catch {}
          try { afterImages = JSON.parse(study.afterImages || "[]"); } catch {}

          const isExpanded = expandedId === study.id;
          const savings =
            study.estimatedAnnualSavings ?? study.rebateAmount ?? null;

          return (
            <div
              key={study.id}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : study.id)
                }
                className="w-full p-4 flex items-start justify-between text-left hover:bg-surface-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{study.title}</h3>
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">
                    {study.summary}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-text-muted">
                    {study.equipmentType && (
                      <span>{study.equipmentType}</span>
                    )}
                    {study.totalProjectCost && (
                      <span>
                        Cost: {formatDollars(study.totalProjectCost * 100)}
                      </span>
                    )}
                    {savings && (
                      <span className="text-success font-medium">
                        Est. savings: ${savings}/yr
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 shrink-0 mt-1 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 space-y-4">
                  <div
                    className="prose prose-sm max-w-none text-text-muted"
                    dangerouslySetInnerHTML={{
                      __html: study.content.replace(/\n/g, "<br/>"),
                    }}
                  />

                  {/* Savings highlights */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {study.estimatedAnnualSavings && (
                      <div className="bg-success/5 rounded-lg p-3 text-center">
                        <p className="text-xs text-text-muted">Annual Savings</p>
                        <p className="text-lg font-bold text-success">
                          ${study.estimatedAnnualSavings}
                        </p>
                      </div>
                    )}
                    {study.energyReductionPercent && (
                      <div className="bg-primary/5 rounded-lg p-3 text-center">
                        <p className="text-xs text-text-muted">Energy Reduction</p>
                        <p className="text-lg font-bold text-primary">
                          {study.energyReductionPercent}%
                        </p>
                      </div>
                    )}
                    {study.totalProjectCost && (
                      <div className="bg-secondary/5 rounded-lg p-3 text-center">
                        <p className="text-xs text-text-muted">Project Cost</p>
                        <p className="text-lg font-bold text-secondary">
                          {formatDollars(study.totalProjectCost * 100)}
                        </p>
                      </div>
                    )}
                    {study.paybackPeriod && (
                      <div className="bg-surface-muted rounded-lg p-3 text-center">
                        <p className="text-xs text-text-muted">Payback</p>
                        <p className="text-lg font-bold">{study.paybackPeriod} yrs</p>
                      </div>
                    )}
                  </div>

                  {/* Before/After images */}
                  {(beforeImages.length > 0 || afterImages.length > 0) && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {beforeImages.length > 0 && (
                        <div>
                          <p className="text-xs text-text-muted font-medium mb-2">
                            Before
                          </p>
                          <div className="grid gap-2">
                            {beforeImages.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`Before photo ${i + 1}: ${study.title}`}
                                className="rounded-lg w-full h-40 object-cover"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {afterImages.length > 0 && (
                        <div>
                          <p className="text-xs text-text-muted font-medium mb-2">
                            After
                          </p>
                          <div className="grid gap-2">
                            {afterImages.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`After photo ${i + 1}: ${study.title} installation`}
                                className="rounded-lg w-full h-40 object-cover"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Customer testimonial */}
                  {study.customerReview && (
                    <div className="bg-surface-muted rounded-lg p-4 italic text-sm text-text-muted">
                      &ldquo;{study.customerReview}&rdquo;
                      {study.customerName && (
                        <p className="mt-2 not-italic font-medium">
                          — {study.customerName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
