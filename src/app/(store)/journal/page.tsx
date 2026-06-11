import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Rss } from "lucide-react";
import { POSTS_BY_DATE } from "@/features/journal/posts";
import { ARTIST } from "@/lib/artist";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "From the studio",
  description: `Notes on the craft of postcard-making by ${ARTIST}.`,
  alternates: {
    canonical: `${siteUrl()}/journal`,
    types: { "application/rss+xml": `${siteUrl()}/feed.xml` },
  },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function JournalPage() {
  const [lead, ...rest] = POSTS_BY_DATE;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="stamp-label text-primary">From the studio</p>
          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Journal
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Notes on the craft — how the cards are made, drawn, and chosen, by {ARTIST}.
          </p>
        </div>
        <Link
          href="/feed.xml"
          className="hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-primary sm:inline-flex"
        >
          <Rss className="size-4" /> RSS
        </Link>
      </header>

      {/* Lead post */}
      <Link
        href={`/journal/${lead.slug}`}
        className="group/lead surface hover-lift block overflow-hidden rounded-3xl"
      >
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[16/10] md:aspect-auto">
            <Image
              src={lead.coverImage}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 40rem, 90vw"
              className="object-cover transition-transform duration-500 group-hover/lead:scale-[1.03]"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="stamp-label text-muted-foreground">
              {fmt(lead.date)} · {lead.readingMinutes} min read
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              {lead.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{lead.excerpt}</p>
          </div>
        </div>
      </Link>

      {/* Rest */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link
            key={p.slug}
            href={`/journal/${p.slug}`}
            className="group/post surface hover-lift flex flex-col overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={p.coverImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 22rem, 45vw"
                className="object-cover transition-transform duration-500 group-hover/post:scale-[1.04]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="stamp-label text-muted-foreground">
                {fmt(p.date)} · {p.readingMinutes} min
              </p>
              <h3 className="mt-2 font-heading text-lg font-semibold leading-snug">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
