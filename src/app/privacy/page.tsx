import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Heat Pump Network privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="container-content py-12">
      <div className="max-w-3xl mx-auto prose prose-sm">
        <h1>Privacy Policy</h1>
        <p className="text-text-muted">Last updated: June 2026</p>

        <h2>Information We Collect</h2>
        <p>
          We collect information you provide when using Heat Pump Network: name, email
          address, phone number, project details, and property information when requesting
          quotes or creating an account.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To connect homeowners with verified contractors for quote requests</li>
          <li>To improve our tools and user experience</li>
          <li>To send email notifications about your quote requests and account</li>
          <li>To prevent fraud and ensure platform integrity</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>
          We share your quote request information only with the contractors you select.
          We never sell your personal information to third parties. We never share your
          data for advertising purposes.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your account information as long as your account is active. Quote
          request data is retained for 2 years and then anonymized. You may request
          deletion of your data at any time by contacting us.
        </p>

        <h2>Cookies</h2>
        <p>
          We use essential cookies for authentication and security. We do not use tracking
          cookies or third-party advertising cookies. Analytics are privacy-preserving and
          anonymized.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy concerns, contact us at privacy@heatpump.network.
        </p>
      </div>
    </div>
  );
}
