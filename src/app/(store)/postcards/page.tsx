import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/store/product-grid";
import { ProductGridSkeleton } from "@/components/store/product-grid-skeleton";
import { GalleryFilter } from "@/components/store/gallery-filter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CATEGORY_META,
  isCategory,
  isSort,
  type ProductSort,
} from "@/features/products/constants";

export const metadata: Metadata = {
  title: "Shop postcards",
  description:
    "Browse every hand-illustrated postcard — filter by travel, nature, city, and more, sorted however you like.",
};

export default function PostcardsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* searchParams is a runtime API → read it inside <Suspense>. */}
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const category = isCategory(sp.category) ? sp.category : undefined;
  const sort: ProductSort = isSort(sp.sort) ? sp.sort : "featured";

  const heading = category ? CATEGORY_META[category].label : "All postcards";
  const tagline = category
    ? CATEGORY_META[category].tagline
    : "Every design in the studio, drawn by hand and ready to mail.";

  return (
    <>
      <header className="mb-8">
        <p className="stamp-label text-primary">The collection</p>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          {heading}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">{tagline}</p>
      </header>

      <div className="mb-8">
        <GalleryFilter category={category} sort={sort} />
      </div>

      {/* The grid query is cached; it streams into this boundary. Keyed on the
          filter so it re-suspends (showing the skeleton) when it changes. */}
      <Suspense
        key={`${category ?? "all"}-${sort}`}
        fallback={<ProductGridSkeleton />}
      >
        <ProductGrid category={category} sort={sort} />
      </Suspense>
    </>
  );
}

function CatalogSkeleton() {
  return (
    <>
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <Skeleton className="mb-8 h-9 w-full max-w-2xl" />
      <ProductGridSkeleton />
    </>
  );
}
