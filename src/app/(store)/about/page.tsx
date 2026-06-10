import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About the artist",
  description:
    "The story behind Posted. — an independent illustrator drawing small worlds onto A6 card stock.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="stamp-label text-primary">The studio</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        Small worlds, drawn by hand
      </h1>

      <div className="surface grain my-10 overflow-hidden rounded-3xl p-2">
        <div className="relative aspect-[2/1] overflow-hidden rounded-2xl">
          <Image
            src="/postcards/wildflower-field.jpg"
            alt="A postcard from the studio"
            fill
            priority
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
        <p>
          Posted. began with a shoebox of old airmail and a stubborn belief that
          a real piece of paper still means something. Every design here starts
          as a sketch — at a café table, on a train, at the edge of a trail —
          and ends up as a small print you can hold, write on, and send.
        </p>
        <p>
          The cards are illustrated by hand and printed in small batches on A6
          recycled stock with a soft matte finish, chosen because it takes ink
          beautifully and feels like something. Nothing is mass-produced; when a
          run sells out, it&apos;s genuinely gone until the next one.
        </p>
        <p>
          Whether you frame it, pin it to a wall, or pop it in the post to
          someone who needs cheering up — thank you for giving a little drawing a
          home.
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
