import "server-only";
import { createDb, type DB } from "./connect";

export type { DB } from "./connect";

// Cache on globalThis so every server bundle (RSC, server actions, route
// handlers) shares ONE Drizzle client across the process. This is also what
// keeps a single persistent PGlite connection per process in local mode.
const globalForDb = globalThis as unknown as { __pcDb?: Promise<DB> };

/**
 * Lazily-initialized, process-global Drizzle client. Picks the driver at
 * runtime (PGlite locally, Neon HTTP when a real DATABASE_URL is set) — see
 * ./connect.
 */
export function getDb(): Promise<DB> {
  if (!globalForDb.__pcDb) globalForDb.__pcDb = createDb();
  return globalForDb.__pcDb;
}
