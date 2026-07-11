/**
 * Schema Validation Tests
 * Verifies Prisma models have the expected structure
 */

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Prisma Schema", () => {
  const schemaPath = path.resolve(__dirname, "..", "prisma", "schema.prisma");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  it("should define all required models", () => {
    const models = [
      "User",
      "Contractor",
      "ServiceArea",
      "CaseStudy",
      "RebateProgram",
      "Lead",
      "CreditTransaction",
      "Subscription",
      "SponsoredPlacement",
      "Review",
      "QA",
      "ContentReviewItem",
      "Account",
      "Session",
      "VerificationToken",
    ];

    for (const model of models) {
      expect(schema).toContain(`model ${model}`);
    }
  });

  it("should have contractor indexes for geo queries", () => {
    expect(schema).toContain("@@index([latitude, longitude])");
  });

  it("should have lead status index", () => {
    expect(schema).toContain("@@index([contractorId, status])");
  });

  it("should have content review status index", () => {
    expect(schema).toContain("@@index([status])");
    expect(schema).toContain("@@index([contentType])");
  });
});

describe("Project Configuration", () => {
  it("should have required config files", () => {
    const root = path.resolve(__dirname, "..");
    const files = [
      "package.json",
      "tsconfig.json",
      "next.config.ts",
      "prisma/schema.prisma",
      "prisma.config.ts",
      "docker-compose.yml",
      ".env.example",
    ];

    for (const file of files) {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    }
  });

  it("should have all required npm scripts", () => {
    const pkgPath = path.resolve(__dirname, "..", "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const requiredScripts = ["dev", "build", "start", "db:generate", "test", "ci"];

    for (const script of requiredScripts) {
      expect(pkg.scripts).toHaveProperty(script);
    }
  });
});

describe("SEO & Compliance", () => {
  it("should have robots.txt that disallows admin", () => {
    const robotsPath = path.resolve(__dirname, "..", "src", "app", "robots.ts");
    const robots = fs.readFileSync(robotsPath, "utf-8");
    expect(robots).toContain("disallow");
    expect(robots).toContain("/admin/");
  });

  it("should have sitemap generating all routes", () => {
    const sitemapPath = path.resolve(__dirname, "..", "src", "app", "sitemap.ts");
    const sitemap = fs.readFileSync(sitemapPath, "utf-8");
    expect(sitemap).toContain("sitemap");
    expect(sitemap).toContain("/search");
    expect(sitemap).toContain("/installers/");
    expect(sitemap).toContain("/heat-pump-rebates/");
  });

  it("should have security headers configured", () => {
    const configPath = path.resolve(__dirname, "..", "next.config.ts");
    const config = fs.readFileSync(configPath, "utf-8");
    expect(config).toContain("X-Frame-Options");
    expect(config).toContain("X-Content-Type-Options");
    expect(config).toContain("Strict-Transport-Security");
    expect(config).toContain("Permissions-Policy");
  });

  it("should have transparency pages", () => {
    const pagesDir = path.resolve(__dirname, "..", "src", "app");
    expect(fs.existsSync(path.join(pagesDir, "how-we-verify", "page.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "monetisation-disclosure", "page.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "privacy", "page.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "terms", "page.tsx"))).toBe(true);
  });
});
