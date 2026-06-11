import type { Product } from "@/db/schema";

/**
 * Curated collections built from the EXISTING catalog — no new table needed.
 * A collection selects products by an explicit slug list and/or a category.
 */
export type Collection = {
  slug: string;
  title: string;
  blurb: string;
  /** Product slug used for the cover image. */
  coverSlug: string;
  productSlugs?: string[];
  category?: Product["category"];
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "travel-series",
    title: "The Travel Series",
    blurb: "Far-flung places drawn from the road — harbours, hill towns, and golden hours.",
    coverSlug: "kyoto-at-dusk",
    category: "travel",
  },
  {
    slug: "holiday-2026",
    title: "Holiday 2026",
    blurb: "A seasonal capsule for the turning of the year — snow, blossom, and warm light.",
    coverSlug: "first-snow",
    productSlugs: [
      "first-snow",
      "cherry-blossom",
      "midwinter-lights",
      "harvest-moon",
      "new-year-sky",
      "autumn-hearth",
    ],
  },
  {
    slug: "ink-and-paper",
    title: "Ink & Paper",
    blurb: "Woodblock prints and quiet line work — the slow, hand-drawn corner of the studio.",
    coverSlug: "the-red-fox",
    productSlugs: [
      "the-red-fox",
      "cherry-blossom",
      "koi-pond",
      "paper-crane",
      "sleeping-cat",
      "alley-lanterns",
      "humpback-breach",
    ],
  },
  {
    slug: "studio-favourites",
    title: "Studio Favourites",
    blurb: "The pieces people frame instead of mailing — Tatevik's most-loved designs.",
    coverSlug: "wildflower-field",
    productSlugs: [
      "wildflower-field",
      "neon-district",
      "santorini-blue",
      "lavender-rows",
      "harbor-lights",
      "cobalt-drift",
    ],
  },
];

export const COLLECTION_SLUGS = COLLECTIONS.map((c) => c.slug);
export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/** Resolve a collection's products from the full catalog (preserving order). */
export function selectCollectionProducts(
  c: Collection,
  all: Product[],
): Product[] {
  if (c.productSlugs?.length) {
    const order = new Map(c.productSlugs.map((s, i) => [s, i]));
    return all
      .filter((p) => order.has(p.slug))
      .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
  }
  if (c.category) return all.filter((p) => p.category === c.category);
  return [];
}
