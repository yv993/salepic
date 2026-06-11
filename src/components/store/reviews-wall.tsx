"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { BadgeCheck, ArrowUpRight } from "lucide-react";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StarRating } from "./stars";
import type { WallReview } from "@/features/reviews/queries";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={
        "grid shrink-0 place-items-center rounded-full bg-primary/15 font-heading font-semibold text-primary ring-1 ring-primary/25 " +
        (className ?? "size-10 text-sm")
      }
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

/** Compact, clickable review card (opens the modal). */
function ReviewCardButton({
  review,
  onOpen,
}: {
  review: WallReview;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="grow"
      className="surface hover-lift w-full max-w-xs rounded-2xl p-6 text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-between gap-2">
        <StarRating rating={review.rating} />
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
            <BadgeCheck className="size-3.5" />
            Verified
          </span>
        )}
      </div>
      {review.title && (
        <p className="mt-3 font-heading font-semibold tracking-tight">
          {review.title}
        </p>
      )}
      <blockquote className="mt-2 line-clamp-4 text-sm leading-relaxed text-foreground/85">
        “{review.body}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <Avatar name={review.authorName} />
        <span className="leading-5">
          <span className="block font-medium tracking-tight">
            {review.authorName}
          </span>
          <span className="block text-xs text-muted-foreground">
            {review.authorLocation ?? "Verified buyer"}
            {review.product ? ` · ${review.product.title}` : ""}
          </span>
        </span>
      </figcaption>
    </button>
  );
}

function Column({
  items,
  duration = 18,
  className,
  onOpen,
}: {
  items: WallReview[];
  duration?: number;
  className?: string;
  onOpen: (r: WallReview) => void;
}) {
  const reduce = useReducedMotion();
  // Only animate after mount so SSR and the first client render match
  // (useReducedMotion differs server vs client → would hydration-mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const animating = mounted && !reduce;
  if (items.length === 0) return null;
  return (
    <div className={className}>
      <motion.div
        animate={animating ? { translateY: "-50%" } : undefined}
        transition={
          animating
            ? { duration, repeat: Infinity, ease: "linear", repeatType: "loop" }
            : undefined
        }
        className="flex flex-col gap-5 pb-5"
      >
        {[...new Array(2)].map((_, dup) => (
          <React.Fragment key={dup}>
            {items.map((r, i) => (
              <ReviewCardButton
                key={`${dup}-${r.id}-${i}`}
                review={r}
                onOpen={() => onOpen(r)}
              />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function ReviewsWall({ reviews }: { reviews: WallReview[] }) {
  const [selected, setSelected] = useState<WallReview | null>(null);
  const onOpen = (r: WallReview) => setSelected(r);

  // Split across up to three marquee columns.
  const third = Math.ceil(reviews.length / 3) || 1;
  const a = reviews.slice(0, third);
  const b = reviews.slice(third, third * 2);
  const c = reviews.slice(third * 2);

  return (
    <>
      <div className="relative mt-12 max-h-[34rem] overflow-hidden">
        <div className="flex justify-center gap-5">
          <Column items={a} duration={20} onOpen={onOpen} />
          <Column items={b} duration={26} className="hidden md:block" onOpen={onOpen} />
          <Column items={c} duration={23} className="hidden lg:block" onOpen={onOpen} />
        </div>
        <ProgressiveBlur direction="top" blurIntensity={0.5} className="absolute inset-x-0 top-0 h-24" />
        <ProgressiveBlur direction="bottom" blurIntensity={0.5} className="absolute inset-x-0 bottom-0 h-24" />
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar name={selected.authorName} className="size-12 text-base" />
                  <div className="leading-tight">
                    <DialogTitle className="font-heading text-xl">
                      {selected.authorName}
                    </DialogTitle>
                    <DialogDescription>
                      {selected.authorLocation ?? "Verified buyer"} ·{" "}
                      {fmtDate(selected.createdAt)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-1 flex items-center gap-3">
                <StarRating rating={selected.rating} size="size-5" />
                {selected.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/25">
                    <BadgeCheck className="size-3.5" />
                    Verified buyer
                  </span>
                )}
              </div>

              {selected.title && (
                <p className="mt-4 font-heading text-lg font-semibold tracking-tight">
                  {selected.title}
                </p>
              )}
              <p className="mt-2 leading-relaxed text-foreground/90">
                “{selected.body}”
              </p>

              {selected.product && (
                <Link
                  href={`/postcards/${selected.product.slug}`}
                  className="group mt-6 flex items-center gap-3 rounded-xl border border-border/70 bg-card/50 p-3 transition-colors hover:border-primary/40"
                >
                  <div className="relative aspect-[1.41/1] w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                    {selected.product.imageUrl && (
                      <Image
                        src={selected.product.imageUrl}
                        alt={selected.product.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="stamp-label text-muted-foreground">
                      Reviewed postcard
                    </p>
                    <p className="truncate font-medium">{selected.product.title}</p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </Link>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
