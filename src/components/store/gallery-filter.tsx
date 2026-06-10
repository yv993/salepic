"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_ORDER,
  CATEGORY_META,
  SORT_OPTIONS,
  type ProductSort,
} from "@/features/products/constants";
import type { ProductCategory } from "@/db/schema";

/**
 * Props-only filter (no useSearchParams / usePathname) so it can render in the
 * static shell without reading request-time data. Current selection comes from
 * the server-read searchParams; navigation rebuilds the query string directly.
 */
export function GalleryFilter({
  category,
  sort,
}: {
  category?: ProductCategory;
  sort: ProductSort;
}) {
  const router = useRouter();

  function go(nextCategory: ProductCategory | undefined, nextSort: ProductSort) {
    const params = new URLSearchParams();
    if (nextCategory) params.set("category", nextCategory);
    if (nextSort && nextSort !== "featured") params.set("sort", nextSort);
    const qs = params.toString();
    router.push(qs ? `/postcards?${qs}` : "/postcards", { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="-mx-1 flex flex-wrap gap-2 px-1">
        <Pill active={!category} onClick={() => go(undefined, sort)}>
          All
        </Pill>
        {CATEGORY_ORDER.map((c) => (
          <Pill key={c} active={category === c} onClick={() => go(c, sort)}>
            {CATEGORY_META[c].label}
          </Pill>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort</span>
        <Select
          value={sort}
          onValueChange={(v) => v && go(category, v as ProductSort)}
        >
          <SelectTrigger size="sm" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-card text-foreground/70 hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
