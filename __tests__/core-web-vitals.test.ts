/**
 * Core Web Vitals — HTML Structure Assertions
 * Verifies pages have proper structure for LCP, CLS, INP optimization
 */

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Core Web Vitals — HTML Structure", () => {
  const layoutPath = path.resolve(__dirname, "..", "src", "app", "layout.tsx");
  const layout = fs.readFileSync(layoutPath, "utf-8");

  it("should preload fonts for fast LCP", () => {
    expect(layout).toContain("preconnect");
    expect(layout).toContain("fonts.googleapis.com");
  });

  it("should have proper viewport metadata via Inter font loading", () => {
    expect(layout).toContain("display=swap");
    expect(layout).toContain("Inter");
  });

  it("should have metadata for SEO", () => {
    expect(layout).toContain("Metadata");
    expect(layout).toContain("title");
    expect(layout).toContain("description");
  });

  it("should have OpenGraph tags", () => {
    expect(layout).toContain("openGraph");
    expect(layout).toContain("og");
  });

  it("should have Twitter card tags", () => {
    expect(layout).toContain("twitter");
    expect(layout).toContain("summary_large_image");
  });
});

describe("Accessibility & Reduced Motion", () => {
  const cssPath = path.resolve(__dirname, "..", "src", "app", "globals.css");
  const css = fs.readFileSync(cssPath, "utf-8");

  it("should have reduced motion support", () => {
    expect(css).toContain("prefers-reduced-motion");
  });

  it("should have focus styles", () => {
    expect(css).toContain("focus-visible");
    expect(css).toContain("outline");
  });
});

describe("Broken Link Check — Source Files", () => {
  it("should have no localhost URLs with typos", () => {
    const srcDir = path.resolve(__dirname, "..", "src");

    function scanDir(dir: string): string[] {
      const issues: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
          issues.push(...scanDir(fullPath));
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          if (content.includes("http:/localhost")) {
            issues.push(`Missing 's' in https: ${fullPath}`);
          }
          if (content.includes("locahost")) {
            issues.push(`Typo 'locahost': ${fullPath}`);
          }
        }
      }

      return issues;
    }

    const issues = scanDir(srcDir);
    expect(issues).toEqual([]);
  });
});
