import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next, so load the local env file explicitly.
config({ path: ".env.local" });

const PGLITE_DIR = process.env.PGLITE_DIR || ".pglite";
const url = process.env.DATABASE_URL?.trim();
const useLocal =
  process.env.USE_PGLITE === "1" || !url || /localhost|127\.0\.0\.1/i.test(url);

// Local: drive the on-disk PGlite database (db:push / db:studio target it).
// Remote: the Neon Postgres pooled connection string.
export default defineConfig(
  useLocal
    ? {
        schema: "./src/db/schema.ts",
        out: "./drizzle",
        dialect: "postgresql",
        driver: "pglite",
        dbCredentials: { url: PGLITE_DIR },
        strict: true,
        verbose: true,
      }
    : {
        schema: "./src/db/schema.ts",
        out: "./drizzle",
        dialect: "postgresql",
        dbCredentials: { url: url! },
        strict: true,
        verbose: true,
      },
);
