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
import { sql, eq, inArray } from "drizzle-orm";
import { products, reviews } from "./schema";
import { SEED } from "./catalog";
import { createDb, isLocalDb, PGLITE_DIR } from "./connect";

// Load .env.local before any driver selection reads process.env.
config({ path: ".env.local" });

/** Sample published reviews (re-seeded each run) so the wall isn't empty. */
const SAMPLE_REVIEWS: {
  slug: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  title?: string;
  body: string;
  daysAgo: number;
}[] = [
  { slug: "kyoto-at-dusk", authorName: "Maya Lindqvist", authorLocation: "Stockholm", rating: 5, title: "Even richer in person", body: "The colours are even warmer than the photo — that lantern glow is gorgeous. It's on my fridge and I smile every morning. Arrived perfectly flat.", daysAgo: 4 },
  { slug: "harbor-lights", authorName: "Felix Brandt", authorLocation: "Hamburg", rating: 5, title: "Gifted a whole stack", body: "Ordered one on a whim and ended up gifting a dozen at the holidays. The card stock feels genuinely lovely and the printing is crisp.", daysAgo: 9 },
  { slug: "the-red-fox", authorName: "Priya Nair", authorLocation: "Bristol", rating: 5, title: "So much character", body: "The little fox has so much personality. I framed it instead of mailing it — sorry, Grandma, this one's mine.", daysAgo: 2 },
  { slug: "wildflower-field", authorName: "Hana Sato", authorLocation: "Osaka", rating: 4, title: "Beautiful, wanted bigger", body: "A tiny luxury — the meadow is full of light. Only wish is that a larger print existed. The matte finish takes ink beautifully.", daysAgo: 14 },
  { slug: "neon-district", authorName: "Tomás Rivera", authorLocation: "Mexico City", rating: 5, title: "Peak city-at-night mood", body: "Rain-slick and moody in the best way. People always ask where it's from when they see it pinned above my desk.", daysAgo: 6 },
  { slug: "first-snow", authorName: "Daniel Okafor", authorLocation: "Lagos", rating: 5, body: "Sent this to a friend who'd never seen snow. She said it was the nicest piece of post she'd had in years. Quick shipping too.", daysAgo: 20 },
  { slug: "hello-sunshine", authorName: "Amara Bello", authorLocation: "Lisbon", rating: 5, title: "Instant pick-me-up", body: "The hand-lettering is so cheerful. I keep a few on hand for quick thank-you notes — they make the message feel special.", daysAgo: 3 },
  { slug: "postal-nostalgia", authorName: "Greta Olsen", authorLocation: "Copenhagen", rating: 4, body: "Lovely airmail feel and deckled edges. Exactly the vintage look I wanted for a scrapbook. Would happily buy more of this series.", daysAgo: 11 },
  { slug: "lavender-rows", authorName: "Élodie Martin", authorLocation: "Aix-en-Provence", rating: 5, title: "Smells like summer (almost)", body: "Reminds me of the drive past the fields at home. The purple is rich and not at all garish. Beautifully printed.", daysAgo: 7 },
  { slug: "snowy-owl", authorName: "Ingrid Haugen", authorLocation: "Tromsø", rating: 5, body: "Those eyes! A friend who studies birds was thrilled to receive it. The paper is sturdy and the colours are true.", daysAgo: 16 },
  { slug: "cobalt-drift", authorName: "Sam Whitfield", authorLocation: "Portland", rating: 4, body: "Calming abstract piece — sits perfectly in a little frame on my shelf. Shipping was fast and packaging was thoughtful.", daysAgo: 5 },
  { slug: "santorini-blue", authorName: "Chiara Russo", authorLocation: "Naples", rating: 5, title: "That blue!", body: "The whitewash-and-blue is so crisp. Bought three and they all arrived in perfect shape. Will be back for the rest of the travel set.", daysAgo: 1 },
];

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

  // Sample published reviews — refreshed each run (identified by userId).
  const slugs = [...new Set(SAMPLE_REVIEWS.map((r) => r.slug))];
  const prodRows = await db
    .select({ id: products.id, slug: products.slug })
    .from(products)
    .where(inArray(products.slug, slugs));
  const idBySlug = new Map(prodRows.map((r) => [r.slug, r.id]));

  await db.delete(reviews).where(eq(reviews.userId, "seed-sample"));
  const toInsert = SAMPLE_REVIEWS.filter((r) => idBySlug.has(r.slug)).map(
    (r) => ({
      productId: idBySlug.get(r.slug)!,
      userId: "seed-sample",
      authorName: r.authorName,
      authorLocation: r.authorLocation,
      rating: r.rating,
      title: r.title ?? null,
      body: r.body,
      verified: true,
      status: "published" as const,
      createdAt: new Date(Date.now() - r.daysAgo * 86_400_000),
    }),
  );
  if (toInsert.length) await db.insert(reviews).values(toInsert);
  console.log(`Seeded ${toInsert.length} sample reviews.`);

  // PGlite holds a process-wide handle; exit cleanly so the script ends.
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
