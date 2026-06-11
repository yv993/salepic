import { getStoreProducts } from "@/features/products/queries";
import type { ProductCategory } from "@/db/schema";
import { PostcardCard } from "./postcard-card";

/**
 * "Related postcards" — other active pieces in the same category (cached query,
 * tagged `products`), excluding the current one. Server component.
 */
export async function RelatedPostcards({
  category,
  currentSlug,
}: {
  category: ProductCategory;
  currentSlug: string;
}) {
  const all = await getStoreProducts({ category, sort: "featured" });
  const related = all.filter((p) => p.slug !== currentSlug).slice(0, 4);
  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/70 pt-10">
      <p className="stamp-label text-primary">More like this</p>
      <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        Related postcards
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {related.map((p) => (
          <PostcardCard key={p.id} product={p} priority={false} />
        ))}
      </div>
    </section>
  );
}
