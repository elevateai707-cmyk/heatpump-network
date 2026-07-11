/**
 * Contractor setup page for new contractor accounts
 * Used after initial signup to create contractor profile
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Up Your Contractor Profile",
};

// Placeholder — full implementation in Phase 2/3
export default function ContractorSetupPage() {
  return (
    <div className="container-content py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Set Up Your Contractor Profile
        </h1>
        <p className="text-text-muted mb-8">
          Complete your profile to start receiving leads. You'll need your state
          license number, insurance certificate, and business information.
        </p>

        <div className="card-base p-6">
          <p className="text-center text-text-muted py-8">
            The full contractor setup form will be implemented in Phase 2.
            Please check back soon.
          </p>
        </div>
      </div>
    </div>
  );
}
