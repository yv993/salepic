import { PackageOpen } from "lucide-react";
import { getStoreProducts } from "@/features/products/queries";
import type { ProductCategory } from "@/db/schema";
import type { ProductSort } from "@/features/products/constants";
import { PaginatedGrid } from "./paginated-grid";

/**
 * Cached product grid. Receives plain string args (read from searchParams in
 * the uncached page) so it stays cacheable under `use cache`. The query it
 * calls is itself cached + tagged `products`.
 */
export async function ProductGrid({
  category,
  sort,
}: {
  category?: ProductCategory;
  sort?: ProductSort;
}) {
  const products = await getStoreProducts({ category, sort });

  if (products.length === 0) {
    return (
      <div className="surface flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <PackageOpen className="size-6" />
        </span>
        <p className="font-heading text-lg font-semibold">Nothing here yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          No postcards match this filter right now. Try another category or
          check back soon — new work is added often.
        </p>
      </div>
    );
  }

  return <PaginatedGrid products={products} />;
}
