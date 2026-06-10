"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

/**
 * Above-footer editorial collage: overlapping framed photos at varied depth,
 * rotation and z-index. Each layer scroll-parallaxes at a different speed,
 * tilts/lifts on hover, and reveals on enter with a stagger. Reduced-motion →
 * a static, tasteful arrangement. All transform/opacity (no layout shift).
 */
const LAYERS = [
  { src: "/images/art-mail.jpg", alt: "Trompe-l'œil painting of a rack of letters and papers", w: "20rem", x: "-30%", y: "8%", rot: -7, z: 10, speed: 40 },
  { src: "/images/art-harbor.jpg", alt: "Impressionist seascape painting of the coast", w: "17rem", x: "26%", y: "0%", rot: 6, z: 20, speed: -30 },
  { src: "/images/art-studio.jpg", alt: "Trompe-l'œil still life with a flower garland", w: "15rem", x: "-8%", y: "26%", rot: -3, z: 30, speed: 64 },
  { src: "/images/art-flowers.jpg", alt: "A painting of chrysanthemums", w: "14rem", x: "44%", y: "30%", rot: 9, z: 15, speed: 18 },
  { src: "/images/art-travel.jpg", alt: "A vintage Italian landscape painting with travellers", w: "22rem", x: "6%", y: "-6%", rot: 2, z: 40, speed: -52 },
];

export function PhotoCollage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section className="relative overflow-hidden border-t border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="stamp-label text-primary">From the studio table</p>
        <h2 className="fluid-h2 mx-auto mt-2 max-w-2xl font-heading font-bold tracking-tight">
          Made by hand, sent with care
        </h2>
      </div>

      <div
        ref={ref}
        className="relative mx-auto mt-12 hidden h-[30rem] max-w-5xl md:block"
      >
        {LAYERS.map((l, i) => (
          <CollageLayer
            key={l.src}
            layer={l}
            index={i}
            progress={scrollYProgress}
            reduce={!!reduce}
          />
        ))}
      </div>

      {/* Mobile: simple non-overlapping row (no parallax) */}
      <div className="mt-10 flex gap-4 overflow-x-auto px-4 pb-2 md:hidden">
        {LAYERS.map((l) => (
          <div
            key={l.src}
            className="relative aspect-[1.3/1] w-56 shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-3"
          >
            <Image src={l.src} alt={l.alt} fill sizes="224px" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

function CollageLayer({
  layer: l,
  index,
  progress,
  reduce,
}: {
  layer: (typeof LAYERS)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean;
}) {
  // Parallax: map scroll progress (0→1) to a vertical offset per layer speed.
  const y = useTransform(progress, [0, 1], [l.speed, -l.speed]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        left: "50%",
        top: "50%",
        zIndex: l.z,
        x: `calc(-50% + ${l.x})`,
        ...(reduce ? {} : { y }),
      }}
      className="absolute"
    >
      <motion.div
        whileHover={reduce ? undefined : { scale: 1.05, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        style={{ width: l.w, rotate: l.rot, translateY: reduce ? `${l.y}` : 0 }}
        className="overflow-hidden rounded-2xl border border-border/80 bg-card p-2 shadow-4"
      >
        <div className="relative aspect-[1.35/1] overflow-hidden rounded-xl">
          <Image
            src={l.src}
            alt={l.alt}
            fill
            sizes="(min-width:1024px) 22rem, 18rem"
            className="object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
