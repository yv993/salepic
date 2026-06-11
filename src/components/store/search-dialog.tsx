"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";

export type SearchItem = {
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
};

/** Instant client-side search over the full catalog (passed from a cached
 *  server query). Opens in a dialog; filters by title + category as you type. */
export function SearchDialog({ products }: { products: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products.slice(0, 6);
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [q, products]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        aria-label="Search postcards"
        className="grid size-9 place-items-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
      >
        <Search className="size-5" />
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="top-24 max-w-lg translate-y-0 gap-0 p-0 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">Search postcards</DialogTitle>
        <DialogDescription className="sr-only">
          Type to filter the catalog by title or category.
        </DialogDescription>
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search postcards…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {q && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => setQ("")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2" data-lenis-prevent>
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No postcards match “{q}”.
            </p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/postcards/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <div className="relative aspect-[1.41/1] w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={p.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="text-xs capitalize text-muted-foreground">{p.category}</p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-primary">
                      {formatPrice(p.priceCents, p.currency)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
