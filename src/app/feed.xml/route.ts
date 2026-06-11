import { POSTS_BY_DATE } from "@/features/journal/posts";
import { siteUrl } from "@/lib/env";

/** RSS 2.0 feed for the studio journal. */
export function GET() {
  const base = siteUrl();
  const items = POSTS_BY_DATE.map(
    (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${base}/journal/${p.slug}</link>
      <guid>${base}/journal/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`,
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Posted. — From the studio</title>
    <link>${base}/journal</link>
    <description>Notes on the craft of postcard-making by Tatevik Papyan.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
