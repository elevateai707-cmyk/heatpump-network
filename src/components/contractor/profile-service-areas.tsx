/**
 * Contractor Profile — Service Areas Section
 * Shows cities/counties the contractor serves
 */

import { MapPin } from "lucide-react";

interface Props {
  areas: any[];
}

export function ProfileServiceAreas({ areas }: Props) {
  if (areas.length === 0) return null;

  const grouped = areas.reduce<Record<string, any[]>>((acc, area) => {
    if (!acc[area.state]) acc[area.state] = [];
    acc[area.state].push(area);
    return acc;
  }, {});

  return (
    <div className="card-base p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        Service Areas
      </h2>

      <div className="space-y-3">
        {Object.entries(grouped).map(([state, stateAreas]) => (
          <div key={state}>
            <h3 className="text-sm font-semibold text-text-muted mb-1">{state}</h3>
            <div className="flex flex-wrap gap-2">
              {(stateAreas as any[]).map((area) => (
                <span
                  key={area.id}
                  className="px-3 py-1 bg-surface-muted text-sm rounded-full"
                >
                  {area.city}
                  {area.isPrimary && (
                    <span className="ml-1 text-primary text-xs">★</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted mt-3">
        Service radius: {areas[0]?.radiusMiles || 30} miles
      </p>
    </div>
  );
}
