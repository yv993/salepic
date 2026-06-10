/**
 * Seed the postcard catalog (80 cards across 8 categories).
 *
 * Runs in plain Node (via `tsx`), so it can't import the server-only getDb —
 * it constructs Drizzle inline against DATABASE_URL, loading .env.local the
 * same way drizzle.config.ts does. Idempotent: upserts by slug.
 *
 *   npm run db:seed
 */
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { products } from "./schema";
import { SEED } from "./catalog";
import { createDb, isLocalDb, PGLITE_DIR } from "./connect";

// Load .env.local before any driver selection reads process.env.
config({ path: ".env.local" });

async function main() {
  // createDb selects PGlite locally (creating + migrating ./.pglite on first
  // run) or Neon when a real DATABASE_URL is set.
  console.log(
    isLocalDb()
      ? `Seeding local PGlite database at ${PGLITE_DIR}…`
      : "Seeding remote Postgres (DATABASE_URL)…",
  );
  const db = await createDb();

  // Upsert by slug so re-seeding refreshes existing rows (e.g. swapped artwork)
  // rather than skipping them.
  const result = await db
    .insert(products)
    .values(SEED)
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        imageUrl: sql`excluded.image_url`,
        images: sql`excluded.images`,
        title: sql`excluded.title`,
        description: sql`excluded.description`,
        priceCents: sql`excluded.price_cents`,
        category: sql`excluded.category`,
        stock: sql`excluded.stock`,
        featured: sql`excluded.featured`,
        status: sql`excluded.status`,
        available: sql`excluded.available`,
        widthMm: sql`excluded.width_mm`,
        heightMm: sql`excluded.height_mm`,
        updatedAt: new Date(),
      },
    })
    .returning({ slug: products.slug });

  console.log(`Seed complete. Upserted ${result.length} of ${SEED.length} postcards.`);
  // PGlite holds a process-wide handle; exit cleanly so the script ends.
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
