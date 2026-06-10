"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/format";

export type CarouselItem = {
  slug: string;
  title: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
  category: string;
};

/**
 * Bright amber accent band with a horizontal, snap-scrolling carousel of
 * cut-out postcards, a faint "Collection" watermark, and prev/next controls —
 * the brand's answer to the reference's accessories carousel. Native scroll
 * (touch-friendly); buttons scroll by a card width.
 */
export function ArrivalsCarousel({ items }: { items: CarouselItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  if (!items.length) return null;

  const scrollBy = (dir: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none font-heading text-[22vw] font-bold leading-none text-black/[0.06]"
      >
        Collection
      </span>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="stamp-label text-primary-foreground/70">Fresh off the press</p>
            <h2 className="fluid-h2 mt-2 font-heading font-bold tracking-tight">
              New arrivals
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Scroll carousel left"
              onClick={() => scrollBy(-1)}
              className="grid size-11 place-items-center rounded-full ring-1 ring-black/25 transition-colors hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll carousel right"
              onClick={() => scrollBy(1)}
              className="grid size-11 place-items-center rounded-full ring-1 ring-black/25 transition-colors hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={track}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((p, idx) => (
            <Link
              key={p.slug}
              href={`/postcards/${p.slug}`}
              className="group/c relative w-64 shrink-0 snap-start"
            >
              <div className="relative aspect-[1.41/1] overflow-hidden rounded-xl bg-black/10 ring-1 ring-black/15 transition-transform duration-300 group-hover/c:-translate-y-1.5">
                <Image
                  src={p.imageUrl}
                  alt={p.title}
                  fill
                  loading={idx < 3 ? "eager" : "lazy"}
                  sizes="256px"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-heading font-semibold">{p.title}</p>
                  <p className="text-sm text-primary-foreground/70">
                    {formatPrice(p.priceCents, p.currency)}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover/c:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
