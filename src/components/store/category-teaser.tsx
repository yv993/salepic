"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CATEGORY_META } from "@/features/products/constants";
import type { ProductCategory } from "@/db/schema";

type Teaser = {
  category: ProductCategory;
  image: string;
  blurb: string;
};

const TEASERS: Teaser[] = [
  {
    category: "travel",
    image: "/postcards/kyoto-at-dusk.jpg",
    blurb:
      "Postcards drawn on the road — golden hours in far-off cities and the quiet thrill of somewhere new. Perfect for the friend who's always halfway packed.",
  },
  {
    category: "nature",
    image: "/postcards/wildflower-field.jpg",
    blurb:
      "Mountains, meadows, and changing weather, rendered in soft washes. The slow, green antidote to a busy week.",
  },
  {
    category: "city",
    image: "/postcards/neon-district.jpg",
    blurb:
      "Rain-slick streets and electric signage after dark. For the night owls and the homesick city-dwellers.",
  },
  {
    category: "typography",
    image: "/postcards/hello-sunshine.jpg",
    blurb:
      "Hand-lettered words worth sending — a little burst of warmth that says more than the message inside.",
  },
];

export function CategoryTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <p className="stamp-label text-primary">Find your corner</p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Browse by mood
        </h2>
        <p className="mt-3 text-muted-foreground">
          Eight little worlds to choose from. Start with a favourite.
        </p>
      </div>

      <Tabs defaultValue="travel" className="mt-10 gap-6">
        <TabsList className="mx-auto flex h-auto flex-wrap justify-center gap-2 bg-transparent p-0">
          {TEASERS.map((t) => {
            const meta = CATEGORY_META[t.category];
            const Icon = meta.icon;
            return (
              <TabsTrigger
                key={t.category}
                value={t.category}
                className="flex-none gap-2 rounded-full border border-border bg-card px-4 py-2 data-active:border-primary/40 data-active:bg-primary/10 data-active:text-primary"
              >
                <Icon className="size-4" />
                {meta.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="surface mx-auto mt-2 w-full overflow-hidden rounded-3xl p-3 sm:p-4">
          {TEASERS.map((t) => {
            const meta = CATEGORY_META[t.category];
            return (
              <TabsContent
                key={t.category}
                value={t.category}
                className="grid items-center gap-8 lg:grid-cols-2"
              >
                <div className="relative aspect-[1.41/1] overflow-hidden rounded-2xl grain order-first lg:order-last">
                  <Image
                    src={t.image}
                    alt={meta.label}
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-5 p-4 lg:p-8">
                  <span className="stamp-label text-muted-foreground">
                    {meta.label} collection
                  </span>
                  <h3 className="font-heading text-3xl font-bold tracking-tight lg:text-4xl">
                    {meta.tagline}
                  </h3>
                  <p className="text-muted-foreground lg:text-lg">{t.blurb}</p>
                  <Button
                    size="lg"
                    className="mt-1 w-fit"
                    render={<Link href={`/postcards?category=${t.category}`} />}
                  >
                    Browse {meta.label}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </TabsContent>
            );
          })}
        </div>
      </Tabs>
    </section>
  );
}
