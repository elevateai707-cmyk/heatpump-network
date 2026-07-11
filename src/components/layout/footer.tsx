import Link from "next/link";
import { Leaf } from "lucide-react";

const footerLinks = {
  contractors: [
    { href: "/how-we-verify", label: "How We Verify Contractors" },
    { href: "/monetisation-disclosure", label: "Monetisation & Advertising" },
    { href: "/contractor/dashboard", label: "Contractor Dashboard" },
  ],
  resources: [
    { href: "/heat-pump-rebates", label: "Heat Pump Rebates" },
    { href: "/cost-to-install-heat-pump", label: "Installation Cost Guide" },
    { href: "/rebate-calculator", label: "Rebate Calculator" },
    { href: "/sizing-estimator", label: "Sizing Estimator" },
  ],
  company: [
    { href: "/how-we-verify", label: "About Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/monetisation-disclosure", label: "Disclosures" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-surface-muted mt-auto">
      <div className="container-content py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              Heat Pump Network
            </Link>
            <p className="text-sm text-text-muted max-w-xs">
              Connecting homeowners with pre-verified heat pump contractors.
              Transparent, ethical, and free for homeowners.
            </p>
          </div>

          {/* Link columns */}
          <div>
            <h4 className="font-semibold text-sm mb-4">For Contractors</h4>
            <ul className="space-y-2">
              {footerLinks.contractors.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} Heat Pump Network. All rights reserved.</p>
          <p className="mt-1">
            We do not sell or share your personal information. 
            <Link href="/privacy" className="underline ml-1 hover:text-primary">
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
