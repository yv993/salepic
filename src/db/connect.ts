import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Both drivers (Neon HTTP and PGlite) expose the same Drizzle query API for our
 * usage, so we type everything as the Neon database and cast the PGlite one.
 *
 * This module is intentionally NOT `server-only`: it's shared by the runtime
 * client (src/db/index.ts) and the plain-Node seed (src/db/seed.ts).
 */
export type DB = NeonHttpDatabase<typeof schema>;

/** Local on-disk PGlite directory (override with PGLITE_DIR). */
export const PGLITE_DIR = process.env.PGLITE_DIR || ".pglite";

/**
 * Use the local PGlite database when there's no real remote Postgres:
 * USE_PGLITE=1, or DATABASE_URL is empty/missing, or it points at localhost.
 */
export function isLocalDb(): boolean {
  if (process.env.USE_PGLITE === "1") return true;
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return true;
  return /localhost|127\.0\.0\.1/i.test(url);
}

/**
 * Build a Drizzle client for the active database. For PGlite, the generated
 * migrations in ./drizzle are applied on first init (idempotent), so the schema
 * exists without a separate push step.
 */
export async function createDb(): Promise<DB> {
  if (isLocalDb()) return createPgliteDb();

  const { drizzle } = await import("drizzle-orm/neon-http");
  const { neon } = await import("@neondatabase/serverless");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for the Neon driver.");
  return drizzle(neon(url), { schema });
}

async function createPgliteDb(): Promise<DB> {
  // Dynamic import so PGlite (WASM) never bundles into the client.
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");

  const client = new PGlite(PGLITE_DIR); // persistent: data survives restarts
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: "drizzle" });
  return db as unknown as DB;
}
