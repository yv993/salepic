"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { HeroBackdrop } from "@/components/store/hero-backdrop";
import { formatPrice } from "@/lib/format";

export type HeroItem = {
  slug: string;
  title: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
  category: string;
};

/**
 * Dark cinematic hero: a featured postcard floating on a near-black stage with
 * a giant faint watermark word, an oversized index ("01"), prev/next arrows to
 * cycle featured pieces, and a scroll chevron. Always a dark stage (both
 * themes) for the editorial drama; motion gated on reduced-motion.
 */
export function EditorialHero({ items }: { items: HeroItem[] }) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [i, setI] = useState(0);
  const list = items.length ? items : [];
  if (list.length === 0) return null;
  const item = list[i];
  const go = (dir: number) => setI((p) => (p + dir + list.length) % list.length);

  return (
    <section className="relative isolate overflow-hidden bg-background text-foreground">
      {/* Animated WebGL shader backdrop (both themes, lazy three.js) + scrim */}
      <HeroBackdrop />
      {/* warm stage glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_70%_18%,rgba(217,164,65,0.20),transparent_62%)]" />
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.12]" />

      {/* giant watermark word behind */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-2 left-1/2 -z-10 -translate-x-1/2 select-none font-heading text-[28vw] font-bold leading-none text-foreground/[0.05] sm:text-[22vw]"
      >
        POSTED
      </span>

      <div className="mx-auto grid min-h-[88vh] max-w-6xl grid-cols-1 items-center gap-8 px-4 py-20 sm:px-6 lg:min-h-[92vh] lg:grid-cols-[1fr_1.05fr]">
        {/* Left: index + copy */}
        <div className="relative z-10">
          <div className="flex items-end gap-4">
            <span className="font-heading text-7xl font-bold leading-none text-primary sm:text-8xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="stamp-label mb-2 text-foreground/55">
              Featured · {item.category}
            </span>
          </div>

          <h1 className="fluid-display mt-6 font-heading font-bold tracking-tight">
            Little postcards,
            <br />
            <span className="italic text-primary">big somewhere-elses.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/70">
            Original artwork by an independent illustrator — drawn by hand,
            printed on A6 card stock, ready to mail.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <RainbowButton onClick={() => router.push("/postcards")}>
              Shop the collection
              <ChevronRight className="size-4" />
            </RainbowButton>
            <Link
              href="/about"
              className="link-underline text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              Meet the artist
            </Link>
          </div>
        </div>

        {/* Right: floating featured postcard with prev/next */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative aspect-[1.41/1] w-full max-w-md">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={item.slug}
                // No opacity on enter → the LCP image is painted immediately
                // (visible in SSR HTML, not gated on hydration). Swaps slide.
                initial={reduce ? false : { x: 40, rotate: -2 }}
                animate={reduce ? undefined : { x: 0, rotate: -2 }}
                exit={reduce ? undefined : { opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Link
                  href={`/postcards/${item.slug}`}
                  className="group/h surface grain block size-full overflow-hidden rounded-2xl p-2 shadow-4"
                >
                  <div className="relative size-full overflow-hidden rounded-xl">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      priority={i === 0}
                      sizes="(min-width:1024px) 28rem, 90vw"
                      className="object-cover transition-transform duration-500 group-hover/h:scale-[1.04]"
                    />
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* caption chip */}
            <div className="absolute -bottom-5 left-4 z-20 rounded-full bg-background/90 px-4 py-2 text-sm shadow-3 ring-1 ring-foreground/10 backdrop-blur">
              <span className="font-heading font-semibold">{item.title}</span>
              <span className="ml-2 text-primary">
                {formatPrice(item.priceCents, item.currency)}
              </span>
            </div>
          </div>

          {/* prev/next */}
          <div className="absolute -bottom-5 right-0 z-20 flex gap-2">
            <button
              type="button"
              aria-label="Previous featured postcard"
              onClick={() => go(-1)}
              className="grid size-10 place-items-center rounded-full ring-1 ring-foreground/20 text-foreground/80 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next featured postcard"
              onClick={() => go(1)}
              className="grid size-10 place-items-center rounded-full ring-1 ring-foreground/20 text-foreground/80 transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* scroll-down chevron */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <ChevronDown
          className={
            reduce
              ? "size-6 text-foreground/40"
              : "size-6 animate-bounce text-foreground/40"
          }
        />
      </div>
    </section>
  );
}
