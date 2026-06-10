"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { toast } from "sonner";

/**
 * Studio media gallery: a row of framed process photos where the CENTER image
 * is larger and overlaps its neighbours, with a "Watch the studio" play button.
 * Staggered reveal on enter; reduced-motion → static. Photos are decorative
 * process imagery (not products).
 */
const SHOTS = [
  { src: "/images/art-studio.jpg", alt: "Trompe-l'œil still life with a flower garland and curtain", rot: -5 },
  { src: "/images/art-travel.jpg", alt: "A vintage Italian landscape painting with travellers", rot: 0, center: true },
  { src: "/images/art-flowers.jpg", alt: "A painting of chrysanthemums in bloom", rot: 5 },
];

export function StudioGallery() {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 text-center">
        <p className="stamp-label text-primary">Inside the studio</p>
        <h2 className="fluid-h2 mt-2 font-heading font-bold tracking-tight">
          How a postcard is made
        </h2>
      </div>

      <div className="relative flex items-center justify-center gap-3 sm:gap-0">
        {SHOTS.map((s, i) => (
          <motion.figure
            key={s.src}
            initial={reduce ? false : { opacity: 0, y: 30, scale: 0.95 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotate: reduce ? 0 : s.rot }}
            className={
              s.center
                ? "relative z-20 -mx-4 w-[46%] max-w-md sm:-mx-10"
                : "relative z-10 hidden w-[32%] max-w-xs sm:block"
            }
          >
            <div className="surface grain overflow-hidden rounded-2xl p-2 shadow-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width:1024px) 28rem, 90vw"
                  className="object-cover"
                />
              </div>
            </div>

            {s.center && (
              <button
                type="button"
                onClick={() =>
                  toast("Studio film — coming soon.", {
                    description: "A look behind the drawing board.",
                  })
                }
                aria-label="Watch the studio film"
                className="group absolute left-1/2 top-1/2 z-30 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-4 ring-4 ring-background/60 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
              >
                <Play className="size-6 translate-x-0.5 fill-current" />
              </button>
            )}
          </motion.figure>
        ))}
      </div>
      <p className="mt-12 text-center text-sm text-muted-foreground">
        Watch the studio — a short film on how each card is drawn &amp; printed.
      </p>
    </section>
  );
}
