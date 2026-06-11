"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice, formatDimensions } from "@/lib/format";
import type { Product } from "@/db/schema";
import { CATEGORY_META } from "@/features/products/constants";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { AddToCartButton } from "./add-to-cart-button";

export function PostcardCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const cat = CATEGORY_META[product.category];
  const dims = formatDimensions(product.widthMm, product.heightMm);
  const soldOut = product.stock <= 0;

  return (
    <CardSpotlight
      className={cn(
        "group/card surface hover-lift flex flex-col overflow-hidden rounded-2xl",
        className,
      )}
    >
      {/* Matted "framed print" media */}
      <Link
        href={`/postcards/${product.slug}`}
        className="relative block p-2"
        aria-label={product.title}
      >
        <div className="relative aspect-[1.41/1] overflow-hidden rounded-xl bg-muted grain ring-1 ring-border/70">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.05]"
          />
          {/* hover sheen for depth */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
          <span className="stamp-label absolute left-2.5 top-2.5 rounded-full bg-background/85 px-2.5 py-1 text-foreground/80 ring-1 ring-border backdrop-blur-sm">
            {cat.label}
          </span>
          {soldOut && (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-semibold text-background">
              Sold out
            </span>
          )}
        </div>
      </Link>

      {/* perforated tear-off edge between print and caption */}
      <div className="flex flex-1 flex-col gap-3 border-t border-dashed border-border/80 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading text-lg leading-snug font-semibold">
              <Link
                href={`/postcards/${product.slug}`}
                className="transition-colors hover:text-primary"
              >
                {product.title}
              </Link>
            </h3>
            {dims && (
              <p className="mt-0.5 text-xs text-muted-foreground">{dims}</p>
            )}
          </div>
          <p className="shrink-0 font-heading text-lg font-semibold text-primary">
            {formatPrice(product.priceCents, product.currency)}
          </p>
        </div>

        <div className="mt-auto pt-1">
          <AddToCartButton
            productId={product.id}
            title={product.title}
            soldOut={soldOut}
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </CardSpotlight>
  );
}
