import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus, ImageOff } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { adminListProducts } from "@/features/products/admin";
import { CATEGORY_META } from "@/features/products/constants";

export const metadata: Metadata = { title: "Postcards" };

const STATUS_CLASS: Record<string, string> = {
  active: "bg-success/15 text-success ring-1 ring-success/30",
  draft: "bg-warning/15 text-warning ring-1 ring-warning/30",
  archived: "bg-muted text-muted-foreground ring-1 ring-border",
};

export default async function AdminProductsPage() {
  const products = await adminListProducts();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Postcards"
        description={`${products.length} ${products.length === 1 ? "design" : "designs"} in the studio`}
      >
        <Button render={<Link href="/admin/products/new" />}>
          <Plus className="size-4" />
          New postcard
        </Button>
      </PageHeader>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <ImageOff className="size-6" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold">No postcards yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first artwork to start selling.
            </p>
          </div>
          <Button render={<Link href="/admin/products/new" />}>
            <Plus className="size-4" />
            New postcard
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Postcard</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  Stock
                </th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative aspect-[1.41/1] w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          /{p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {CATEGORY_META[p.category].label}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(p.priceCents, p.currency)}
                  </td>
                  <td
                    className={cn(
                      "hidden px-4 py-3 md:table-cell",
                      p.stock <= 5 && "text-warning",
                      p.stock === 0 && "text-destructive",
                    )}
                  >
                    {p.stock}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        STATUS_CLASS[p.status],
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href={`/admin/products/${p.id}/edit`} />}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
