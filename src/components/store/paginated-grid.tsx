"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/db/schema";
import { PostcardCard } from "./postcard-card";

const PAGE = 12;

/**
 * Client-side "load more" over an already-fetched, cached product list. The
 * server query (cached + tagged `products`) returns the full filtered set; this
 * only controls how many are rendered, so the catalog stays fast for 80+ items
 * without extra requests or routes. No JS → graceful: all cards still render
 * (the button is the only progressive bit).
 */
export function PaginatedGrid({ products }: { products: Product[] }) {
  const [visible, setVisible] = useState(PAGE);
  const shown = products.slice(0, visible);
  const remaining = products.length - visible;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((product, i) => (
          <PostcardCard key={product.id} product={product} priority={i < 3} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setVisible((v) => v + PAGE)}
          >
            Load more — {remaining} {remaining === 1 ? "postcard" : "postcards"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Showing {shown.length} of {products.length}
          </p>
        </div>
      )}
    </div>
  );
}
