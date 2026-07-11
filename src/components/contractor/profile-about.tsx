/**
 * Contractor Profile — About Section
 * Description, certifications, service brands, business details
 */

import { Award, Wrench, Building2, Calendar } from "lucide-react";

interface Props {
  contractor: any;
  serviceBrands: string[];
  certifications: string[];
}

export function ProfileAbout({ contractor, serviceBrands, certifications }: Props) {
  return (
    <div className="card-base p-6">
      <h2 className="text-xl font-semibold mb-4">About {contractor.businessName}</h2>

      <div className="prose prose-sm max-w-none text-text-muted mb-6">
        <p>{contractor.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Business details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Business Details
          </h3>
          <dl className="space-y-2 text-sm">
            {contractor.yearsInBusiness > 0 && (
              <div className="flex justify-between">
                <dt className="text-text-muted">Years in Business</dt>
                <dd className="font-medium">{contractor.yearsInBusiness}+ years</dd>
              </div>
            )}
            {contractor.licenseNumber && (
              <div className="flex justify-between">
                <dt className="text-text-muted">License</dt>
                <dd className="font-medium">
                  {contractor.licenseNumber}
                  {contractor.licenseState && ` (${contractor.licenseState})`}
                </dd>
              </div>
            )}
            {contractor.responseRate && (
              <div className="flex justify-between">
                <dt className="text-text-muted">Response Rate</dt>
                <dd className="font-medium text-success">{contractor.responseRate}%</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/5 text-secondary text-xs font-medium rounded-full border border-secondary/20"
                >
                  <Award className="h-3 w-3" />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Service brands */}
        {serviceBrands.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              Equipment Brands
            </h3>
            <div className="flex flex-wrap gap-2">
              {serviceBrands.map((brand) => (
                <span
                  key={brand}
                  className="px-3 py-1 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/20"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
