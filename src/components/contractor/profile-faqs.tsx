/**
 * Contractor Profile — FAQs Section
 * JSON-LD: FAQPage schema rendered in parent
 */

"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

interface Props {
  qas: any[];
  contractorName: string;
}

export function ProfileFAQs({ qas, contractorName }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (qas.length === 0) return null;

  return (
    <div className="card-base p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        Frequently Asked Questions
      </h2>

      <div className="space-y-2">
        {qas.map((qa) => {
          const isOpen = openId === qa.id;

          return (
            <div
              key={qa.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : qa.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-surface-muted/50 transition-colors"
              >
                <span className="font-medium text-sm pr-4">{qa.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && qa.answer && (
                <div className="border-t px-3 py-3 text-sm text-text-muted">
                  {qa.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
