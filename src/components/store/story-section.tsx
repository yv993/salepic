import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Story band: a bold left headline + CTA over a faint dotted "map" backdrop,
 * with a captioned customer photo card on the right (the reference's
 * Instagram-style quote card, translated to the brand).
 */
export function StorySection() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-card/30 py-24">
      {/* faint world/route backdrop */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_30%,rgba(217, 164, 65,0.10),transparent_60%)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="stamp-label text-primary">Sent from everywhere</p>
          <h2 className="fluid-h1 mt-3 max-w-xl font-heading font-bold tracking-tight">
            Small art that travels the long way home.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            Every design begins as a sketch on the road — a harbour at dusk, a
            quiet alpine morning — then becomes a little print you can hold,
            write on, and post to someone far away.
          </p>
          <Button size="lg" className="mt-8" render={<Link href="/about" />}>
            Read the studio story
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* captioned customer photo card */}
        <figure className="surface mx-auto w-full max-w-sm rounded-2xl p-3 shadow-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted grain">
            <Image
              src="/images/art-mail.jpg"
              alt="A trompe-l'œil painting of a rack of letters, papers and a quill"
              fill
              sizes="(min-width:1024px) 24rem, 90vw"
              className="object-cover"
            />
          </div>
          <figcaption className="flex items-center gap-2 px-1 pt-3 text-sm">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">@maya.writes</span>{" "}
              — “framed three instead of mailing one.”
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
