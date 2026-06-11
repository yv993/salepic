import type { MetadataRoute } from "next";
import { getStoreProducts } from "@/features/products/queries";
import { CATEGORY_ORDER } from "@/features/products/constants";
import { LEGAL_SLUGS } from "@/features/legal/content";
import { siteUrl } from "@/lib/env";

const BASE = siteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/postcards`, priority: 0.9 },
    { url: `${BASE}/about`, priority: 0.5 },
    { url: `${BASE}/orders/lookup`, priority: 0.4 },
    ...CATEGORY_ORDER.map((c) => ({
      url: `${BASE}/postcards?category=${c}`,
      priority: 0.6,
    })),
    ...LEGAL_SLUGS.map((s) => ({ url: `${BASE}/legal/${s}`, priority: 0.3 })),
  ];

  // getStoreProducts is resilient (returns [] if the catalog is unavailable).
  const products = await getStoreProducts({});
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/postcards/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
