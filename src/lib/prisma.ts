/**
 * Prisma Client singleton
 * Uses driver adapter pattern for Prisma v7
 * Auto-detects SQLite vs PostgreSQL from DATABASE_URL
 */

import { PrismaClient } from "@/generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as path from "node:path";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "";

  if (dbUrl.startsWith("file:")) {
    // SQLite (development)
    const dbPath = path.resolve(process.cwd(), dbUrl.replace("file:", ""));
    const adapter = new PrismaBetterSqlite3({ url: dbPath });
    return new PrismaClient({ adapter });
  }

  // PostgreSQL (production)
  // Use require for PG adapter to avoid import issues when not installed
  try {
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { Pool } = require("pg");
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch {
    console.error("[Prisma] Failed to create PostgreSQL adapter. Is @prisma/adapter-pg installed?");
    process.exit(1);
  }
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
