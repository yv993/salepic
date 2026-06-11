import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { POST_SLUGS, getPost } from "@/features/journal/posts";
import { ARTIST } from "@/lib/artist";
import { siteUrl } from "@/lib/env";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return POST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteUrl()}/journal/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function JournalPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: [`${siteUrl()}${post.coverImage}`],
    author: { "@type": "Person", name: ARTIST },
    publisher: { "@type": "Organization", name: "Posted." },
    mainEntityOfPage: `${siteUrl()}/journal/${post.slug}`,
  };

  const date = new Date(post.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/journal"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All posts
      </Link>

      <p className="mt-6 stamp-label text-primary">
        {date} · {post.readingMinutes} min read
      </p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">By {ARTIST}</p>

      <div className="surface grain my-8 overflow-hidden rounded-2xl">
        <div className="relative aspect-[2/1]">
          <Image
            src={post.coverImage}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 42rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
        {post.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-12 border-t border-border/70 pt-6">
        <Link href="/journal" className="text-sm font-medium text-primary hover:underline">
          ← Back to the journal
        </Link>
      </div>
    </article>
  );
}
