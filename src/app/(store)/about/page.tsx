import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARTIST } from "@/lib/artist";

export const metadata: Metadata = {
  title: "About the artist",
  description: `The studio of illustrator ${ARTIST} — small worlds drawn by hand onto A6 card stock and sent the long way round.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="stamp-label text-primary">The studio</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        Small worlds, drawn by hand
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        The studio of illustrator{" "}
        <span className="font-medium text-foreground">{ARTIST}</span>.
      </p>

      <div className="surface grain my-10 overflow-hidden rounded-3xl p-2">
        <div className="relative aspect-[2/1] overflow-hidden rounded-2xl">
          <Image
            src="/postcards/wildflower-field.svg"
            alt={`A postcard illustration by ${ARTIST}`}
            fill
            priority
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
        <p>
          Posted. is the postcard studio of {ARTIST} — built on a stubborn
          belief that a real piece of paper still means something. Every design
          here begins as a drawing and ends up as a small print you can hold,
          write on, and send.
        </p>
        <p>
          The cards are illustrated in a single, cohesive hand and printed in
          small batches on A6 recycled stock with a soft matte finish, chosen
          because it takes ink beautifully and feels like something. Nothing is
          mass-produced; when a run sells out, it&apos;s genuinely gone until the
          next one.
        </p>
        <p>
          Whether you frame it, pin it to a wall, or pop it in the post to
          someone who needs cheering up — thank you for giving one of{" "}
          {ARTIST}&apos;s little drawings a home.
        </p>
      </div>

      <div className="mt-10">
        <Button size="lg" render={<Link href="/postcards" />}>
          Browse the collection
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
