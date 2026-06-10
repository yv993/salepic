"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

type Testimonial = { text: string; image: string; name: string; role: string };

const TESTIMONIALS: Testimonial[] = [
  {
    text: "The colours are even richer in person. I framed three of them instead of mailing a single one.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Maya Lindqvist",
    role: "Stockholm",
  },
  {
    text: "Arrived perfectly flat and so quickly. 'Kyoto at Dusk' is now on my fridge and I smile every morning.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Daniel Okafor",
    role: "Lagos",
  },
  {
    text: "I buy a set every season to send to my grandmother. The card stock feels genuinely lovely.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya Nair",
    role: "Bristol",
  },
  {
    text: "A tiny luxury. The hand-lettered ones make the best little notes — people always ask where they're from.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    name: "Tomás Rivera",
    role: "Mexico City",
  },
  {
    text: "Beautiful work and a beautiful unboxing. You can tell each one is made with care.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Hana Sato",
    role: "Osaka",
  },
  {
    text: "Ordered 'Harbor Lights' on a whim and ended up gifting a whole stack at the holidays.",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    name: "Felix Brandt",
    role: "Hamburg",
  },
];

function Column({
  items,
  duration = 16,
  className,
}: {
  items: Testimonial[];
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={className}>
      <motion.div
        animate={reduce ? undefined : { translateY: "-50%" }}
        transition={
          reduce
            ? undefined
            : { duration, repeat: Infinity, ease: "linear", repeatType: "loop" }
        }
        className="flex flex-col gap-5 pb-5"
      >
        {[...new Array(2)].map((_, dup) => (
          <React.Fragment key={dup}>
            {items.map((t, i) => (
              <figure
                key={`${dup}-${i}`}
                className="surface w-full max-w-xs rounded-2xl p-6"
              >
                <blockquote className="text-sm leading-relaxed text-foreground/90">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="leading-5">
                    <div className="font-medium tracking-tight">{t.name}</div>
                    <div className="text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  const a = TESTIMONIALS.slice(0, 2);
  const b = TESTIMONIALS.slice(2, 4);
  const c = TESTIMONIALS.slice(4, 6);
  return (
    <section className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="stamp-label text-primary">From the letterbox</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Sent, received, treasured
          </h2>
          <p className="mt-3 text-muted-foreground">
            A few words from people who&apos;ve mailed (and kept) a little art.
          </p>
        </div>

        <div className="relative mt-12 max-h-[34rem] overflow-hidden">
          <div className="flex justify-center gap-5">
            <Column items={a} duration={18} />
            <Column items={b} duration={22} className="hidden md:block" />
            <Column items={c} duration={20} className="hidden lg:block" />
          </div>
          {/* Progressive-blur edge fades (top + bottom) */}
          <ProgressiveBlur
            direction="top"
            blurIntensity={0.5}
            className="absolute inset-x-0 top-0 h-24"
          />
          <ProgressiveBlur
            direction="bottom"
            blurIntensity={0.5}
            className="absolute inset-x-0 bottom-0 h-24"
          />
        </div>
      </div>
    </section>
  );
}
