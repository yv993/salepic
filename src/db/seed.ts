/**
 * Seed ~10 placeholder postcards.
 *
 * Runs in plain Node (via `tsx`), so it can't import the server-only getDb —
 * it constructs Drizzle inline against DATABASE_URL, loading .env.local the
 * same way drizzle.config.ts does. Idempotent: re-running skips existing slugs.
 *
 *   npm run db:seed
 */
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { products, type NewProduct } from "./schema";
import { createDb, isLocalDb, PGLITE_DIR } from "./connect";

// Load .env.local before any driver selection reads process.env.
config({ path: ".env.local" });

const A6 = { widthMm: 148, heightMm: 105 };

const SEED: NewProduct[] = [
  {
    slug: "kyoto-at-dusk",
    title: "Kyoto at Dusk",
    description:
      "Lantern light spills over the old quarter as the last of the sun slips behind the hills. A quiet, golden moment from a slow evening in Gion.",
    priceCents: 850,
    category: "travel",
    imageUrl: "/postcards/kyoto-at-dusk.jpg",
    featured: true,
    stock: 40,
    ...A6,
    status: "active",
  },
  {
    slug: "alpine-silence",
    title: "Alpine Silence",
    description:
      "Cold blue peaks under a paper-white sky. Painted on a still morning when the only sound was snow settling on the pines.",
    priceCents: 750,
    category: "nature",
    imageUrl: "/postcards/alpine-silence.jpg",
    stock: 32,
    ...A6,
    status: "active",
  },
  {
    slug: "neon-district",
    title: "Neon District",
    description:
      "Rain-slick streets and electric signage — the city after midnight, humming pink and indigo.",
    priceCents: 950,
    category: "city",
    imageUrl: "/postcards/neon-district.jpg",
    featured: true,
    stock: 28,
    ...A6,
    status: "active",
  },
  {
    slug: "cobalt-drift",
    title: "Cobalt Drift",
    description:
      "An abstract study in cobalt and cyan — overlapping washes that drift like tide pools at dawn.",
    priceCents: 650,
    category: "abstract",
    imageUrl: "/postcards/cobalt-drift.jpg",
    stock: 50,
    ...A6,
    status: "active",
  },
  {
    slug: "hello-sunshine",
    title: "Hello Sunshine",
    description:
      "Hand-lettered warmth in marigold and coral. A little burst of optimism to send across the miles.",
    priceCents: 550,
    category: "typography",
    imageUrl: "/postcards/hello-sunshine.jpg",
    featured: true,
    stock: 60,
    ...A6,
    status: "active",
  },
  {
    slug: "first-snow",
    title: "First Snow",
    description:
      "The hush of the season's first fall — soft blues and untouched white over a sleeping village.",
    priceCents: 700,
    category: "seasonal",
    imageUrl: "/postcards/first-snow.jpg",
    stock: 36,
    ...A6,
    status: "active",
  },
  {
    slug: "the-red-fox",
    title: "The Red Fox",
    description:
      "A curious visitor at the edge of the wood, caught mid-step in rust and amber. Drawn from a single lucky sighting.",
    priceCents: 800,
    category: "animals",
    imageUrl: "/postcards/the-red-fox.jpg",
    stock: 44,
    ...A6,
    status: "active",
  },
  {
    slug: "postal-nostalgia",
    title: "Postal Nostalgia",
    description:
      "An ode to the airmail era — warm sepia, deckled edges, and the romance of a stamp from somewhere far away.",
    priceCents: 600,
    category: "vintage",
    imageUrl: "/postcards/postal-nostalgia.jpg",
    stock: 48,
    ...A6,
    status: "active",
  },
  {
    slug: "harbor-lights",
    title: "Harbor Lights",
    description:
      "Dusk over the working harbor, where amber lamps meet a deepening blue sea. Painted dockside with cold hands.",
    priceCents: 900,
    category: "travel",
    imageUrl: "/postcards/harbor-lights.jpg",
    stock: 30,
    ...A6,
    status: "active",
  },
  {
    slug: "wildflower-field",
    title: "Wildflower Field",
    description:
      "High summer in the meadow — chartreuse grass and a scatter of golden blooms swaying in a warm breeze.",
    priceCents: 1200,
    category: "nature",
    imageUrl: "/postcards/wildflower-field.jpg",
    stock: 24,
    ...A6,
    status: "active",
  },
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
