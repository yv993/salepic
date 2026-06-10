import { Star } from "lucide-react";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const NAMES = [
  "Paper & Post",
  "The Stationery Edit",
  "Wanderlust Weekly",
  "Maker's Almanac",
  "Kinfolk Mail",
  "Small Press Review",
  "Studio Notes",
  "The Letterbox",
];

/**
 * A lightweight "as featured in" strip — the LogoCloud idea, adapted to an
 * illustrator's brand as a quiet marquee of mastheads rather than tech logos.
 */
export function PressStrip() {
  return (
    <section className="border-y border-border/70 bg-card/40 py-10">
      <p className="stamp-label text-center text-muted-foreground">
        Loved &amp; featured in
      </p>
      <div className="group relative mt-6 flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee-x items-center gap-12 pr-12">
          {[...NAMES, ...NAMES].map((name, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2 font-heading text-lg font-semibold text-foreground/45"
            >
              <Star className="size-3.5 fill-current text-primary/40" />
              {name}
            </span>
          ))}
        </div>
        {/* Progressive-blur edge fades (left + right) */}
        <ProgressiveBlur
          direction="left"
          blurIntensity={0.4}
          className="absolute inset-y-0 left-0 w-28"
        />
        <ProgressiveBlur
          direction="right"
          blurIntensity={0.4}
          className="absolute inset-y-0 right-0 w-28"
        />
      </div>
    </section>
  );
}
