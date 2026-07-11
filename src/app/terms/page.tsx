import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Heat Pump Network terms and conditions.",
};

export default function TermsPage() {
  return (
    <div className="container-content py-12">
      <div className="max-w-3xl mx-auto prose prose-sm">
        <h1>Terms of Service</h1>
        <p className="text-text-muted">Last updated: June 2026</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By using Heat Pump Network, you agree to these terms. If you do not agree, do not
          use the service.
        </p>

        <h2>Homeowner Terms</h2>
        <p>
          Using Heat Pump Network to request quotes is free. You agree to provide accurate
          information and to communicate respectfully with contractors. We do not guarantee
          responses from contractors or the quality of work performed.
        </p>

        <h2>Contractor Terms</h2>
        <p>
          Contractors must maintain valid licensing, insurance, and accurate profile
          information. Violations of our no-pay-for-ranking policy, submission of fake
          reviews, or misrepresentation will result in immediate account suspension.
        </p>

        <h2>Lead Credits</h2>
        <p>
          Lead credits are non-refundable except as required by law. Credits expire one year
          from purchase. Unused credit balances may be refunded on a case-by-case basis at
          our discretion.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          Heat Pump Network is a directory and lead-generation platform. We are not a party
          to any contracts between homeowners and contractors. We are not responsible for
          the quality, safety, or legality of work performed by listed contractors.
        </p>

        <h2>Termination</h2>
        <p>
          We may suspend or terminate accounts for violations of these terms, fraudulent
          activity, or at the request of the account holder.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms with 30 days notice to account holders. Continued use
          after changes constitutes acceptance.
        </p>
      </div>
    </div>
  );
}
