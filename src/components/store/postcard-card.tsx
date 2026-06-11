"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatDimensions } from "@/lib/format";
import type { Product } from "@/db/schema";
import { CATEGORY_META } from "@/features/products/constants";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";

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
  const [quick, setQuick] = useState(false);

  return (
    <CardSpotlight
      className={cn(
        "group/card surface hover-lift flex flex-col overflow-hidden rounded-2xl",
        className,
      )}
    >
      {/* Matted "framed print" media (overlay buttons are siblings of the link
          so we never nest interactive controls inside an <a>). */}
      <div className="relative p-2">
        <Link
          href={`/postcards/${product.slug}`}
          className="relative block"
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
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
            <span className="stamp-label absolute left-2.5 top-2.5 rounded-full bg-background/85 px-2.5 py-1 text-foreground/80 ring-1 ring-border backdrop-blur-sm">
              {cat.label}
            </span>
            {soldOut && (
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-semibold text-background">
                Sold out
              </span>
            )}
          </div>
        </Link>

        {/* Overlays */}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton productId={product.id} title={product.title} />
        </div>
        <button
          type="button"
          onClick={() => setQuick(true)}
          className="absolute right-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground/80 opacity-0 shadow-2 ring-1 ring-border backdrop-blur transition-all duration-200 hover:text-primary focus-visible:opacity-100 group-hover/card:opacity-100"
        >
          <Eye className="size-3.5" />
          Quick view
        </button>
      </div>

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
            {dims && <p className="mt-0.5 text-xs text-muted-foreground">{dims}</p>}
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

      {/* Quick view */}
      <Dialog open={quick} onOpenChange={setQuick}>
        <DialogContent className="max-w-lg">
          <div className="surface grain relative aspect-[1.41/1] overflow-hidden rounded-xl">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(min-width: 640px) 32rem, 90vw"
              className="object-cover"
            />
          </div>
          <div className="mt-1">
            <p className="stamp-label text-primary">{cat.label}</p>
            <DialogTitle className="mt-1 font-heading text-2xl">
              {product.title}
            </DialogTitle>
            <p className="mt-1 font-heading text-xl font-semibold text-primary">
              {formatPrice(product.priceCents, product.currency)}
            </p>
            {product.description && (
              <DialogDescription className="mt-3 text-sm leading-relaxed">
                {product.description}
              </DialogDescription>
            )}
            <div className="mt-5 flex items-center gap-2">
              <AddToCartButton
                productId={product.id}
                title={product.title}
                soldOut={soldOut}
                className="flex-1"
              />
              <WishlistButton
                productId={product.id}
                title={product.title}
                variant="labelled"
              />
            </div>
            <Link
              href={`/postcards/${product.slug}`}
              onClick={() => setQuick(false)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View full details <ArrowRight className="size-4" />
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </CardSpotlight>
  );
}
