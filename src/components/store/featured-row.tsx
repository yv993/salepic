import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/features/products/queries";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { PostcardCard } from "./postcard-card";

/**
 * Featured postcards. Backed by a cached query (tagged `products`), so it
 * prerenders into the static shell — no <Suspense> needed.
 */
export async function FeaturedRow() {
  const products = await getFeaturedProducts(3);
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="stamp-label text-primary">Studio picks</p>
          <TextShimmer
            as="h2"
            className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          >
            This season&apos;s favourites
          </TextShimmer>
        </div>
        <Link
          href="/postcards"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <PostcardCard key={product.id} product={product} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
