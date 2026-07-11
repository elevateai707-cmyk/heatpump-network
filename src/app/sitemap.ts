/**
 * Dynamic XML sitemap
 * Generates sitemap entries for all crawlable pages
 */

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://heatpump.network";

// Target states and major cities for programmatic pages
const TARGET_STATES = [
  { state: "oregon", cities: ["portland", "salem", "eugene", "bend"] },
  { state: "washington", cities: ["seattle", "spokane", "tacoma", "olympia"] },
  { state: "massachusetts", cities: ["boston", "worcester", "springfield", "cambridge"] },
  { state: "new-york", cities: ["new-york", "buffalo", "rochester", "albany"] },
  { state: "vermont", cities: ["burlington", "montpelier", "rutland"] },
  { state: "maine", cities: ["portland", "augusta", "bangor"] },
  { state: "minnesota", cities: ["minneapolis", "st-paul", "duluth", "rochester"] },
  { state: "illinois", cities: ["chicago", "peoria", "springfield", "rockford"] },
];

const staticRoutes = [
  "/",
  "/how-we-verify",
  "/monetisation-disclosure",
  "/privacy",
  "/terms",
  "/rebate-calculator",
  "/sizing-estimator",
  "/search",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  staticRoutes.forEach((route) => {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1.0 : 0.7,
    });
  });

  // Programmatic city installer pages
  TARGET_STATES.forEach(({ state, cities }) => {
    cities.forEach((city) => {
      entries.push({
        url: `${BASE_URL}/installers/${city}-${state}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    });
  });

  // State rebate pages
  TARGET_STATES.forEach(({ state }) => {
    entries.push({
      url: `${BASE_URL}//heat-pump-rebates/${state}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    });
  });

  // Cost estimator pages for major cities
  TARGET_STATES.forEach(({ state, cities }) => {
    cities.slice(0, 2).forEach((city) => {
      entries.push({
        url: `${BASE_URL}/cost-to-install-heat-pump/${city}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      });
    });
  });

  // Regional cold climate guides
  ["northeast", "pacific-northwest", "midwest"].forEach((region) => {
    entries.push({
      url: `${BASE_URL}/best-cold-climate-heat-pump-${region}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  });

  return entries;
}
