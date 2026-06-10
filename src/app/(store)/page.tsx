import { ArrowRight, Truck, Stamp, Sparkles } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Aurora } from "@/components/ui/aurora";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { EditorialHero } from "@/components/store/editorial-hero";
import { DetailTabs } from "@/components/store/detail-tabs";
import { StorySection } from "@/components/store/story-section";
import { PullQuote } from "@/components/store/pull-quote";
import { StudioGallery } from "@/components/store/studio-gallery";
import { ArrivalsCarousel } from "@/components/store/arrivals-carousel";
import { Reveal } from "@/components/motion/reveal";
import { FeaturedRow } from "@/components/store/featured-row";
import { CategoryTeaser } from "@/components/store/category-teaser";
import { Testimonials } from "@/components/store/testimonials";
import { PressStrip } from "@/components/store/press-strip";
import { FaqSection } from "@/components/store/faq";
import {
  getFeaturedProducts,
  getStoreProducts,
} from "@/features/products/queries";
import type { Product } from "@/db/schema";

const toItem = (p: Product) => ({
  slug: p.slug,
  title: p.title,
  imageUrl: p.imageUrl,
  priceCents: p.priceCents,
  currency: p.currency,
  category: p.category,
});

export default async function HomePage() {
  // Cached reads (tagged `products`) — prerender into the static shell, then
  // pass plain serializable data into the client hero/carousel leaves.
  const [featured, newest] = await Promise.all([
    getFeaturedProducts(6),
    getStoreProducts({ sort: "newest" }),
  ]);
  const heroItems = (featured.length ? featured : newest).slice(0, 5).map(toItem);
  const arrivals = newest.slice(0, 10).map(toItem);

  return (
    <>
      <EditorialHero items={heroItems} />
      <DetailTabs />
      <ShipStrip />
      <Reveal>
        <FeaturedRow />
      </Reveal>
      <Reveal>
        <StorySection />
      </Reveal>
      <Reveal>
        <PullQuote />
      </Reveal>
      <StudioGallery />
      <Reveal>
        <CategoryTeaser />
      </Reveal>
      <ArrivalsCarousel items={arrivals} />
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <PressStrip />
      </Reveal>
      <Reveal>
        <FaqSection />
      </Reveal>
      <Reveal>
        <FinalCta />
      </Reveal>
    </>
  );
}

/* --------------------------------------------------------------- ship strip */

function ShipStrip() {
  const items = [
    { icon: Stamp, label: "A6 · 148 × 105 mm", sub: "Soft matte recycled stock" },
    { icon: Truck, label: "Posted flat & tracked", sub: "Ships worldwide in 2 days" },
    { icon: Sparkles, label: "Small-batch prints", sub: "Drawn entirely by hand" },
  ];
  return (
    <div className="border-y border-border/70 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{it.label}</p>
                <p className="text-xs text-muted-foreground">{it.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- final cta */

function FinalCta() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="surface relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-6 py-16 text-center">
        {/* Warm aurora glow background (gated on reduced-motion) */}
        <Aurora />
        <p className="stamp-label text-primary">Send something real</p>
        <h2 className="fluid-h2 mt-3 font-heading font-bold tracking-tight">
          <TextShimmer as="span">A small thing that means a lot</TextShimmer>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          In a world of notifications, a postcard still feels like a gift. Pick
          a few, jot a note, and brighten someone&apos;s week.
        </p>
        <div className="mt-8 flex justify-center">
          <RainbowButton href="/postcards">
            Browse all postcards
            <ArrowRight className="size-4" />
          </RainbowButton>
        </div>
      </div>
    </section>
  );
}
