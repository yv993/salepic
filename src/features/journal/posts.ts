/**
 * "From the studio" journal — static, in-code posts by Tatevik Papyan. Content
 * is about the craft/process (no fabricated biographical claims). Add a post by
 * adding an entry; routes + RSS pick it up automatically.
 */
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  coverImage: string;
  readingMinutes: number;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "why-i-still-make-postcards",
    title: "Why I still make postcards",
    excerpt:
      "In a world of instant messages, a small piece of paper sent the long way round still means something.",
    date: "2026-05-28",
    coverImage: "/images/art-mail.jpg",
    readingMinutes: 3,
    body: [
      "There is something stubborn in me that believes a real piece of paper still matters. A message on a screen arrives instantly and disappears just as fast. A postcard takes its time — drawn, printed, written on, carried across the world — and then it sits on a fridge or a desk for years.",
      "Each design in this shop starts the same way: a small drawing made because the scene wouldn't leave me alone. I never set out to build a catalogue. I set out to make the kind of card I'd want to receive.",
      "So thank you for choosing the slow, kind kind of message. It's the whole reason the studio exists.",
    ],
  },
  {
    slug: "how-a-postcard-is-made",
    title: "How a postcard is made: from sketch to A6",
    excerpt:
      "A look at the path from a loose sketch to the matte A6 card that lands in your letterbox.",
    date: "2026-05-12",
    coverImage: "/images/art-studio.jpg",
    readingMinutes: 4,
    body: [
      "Every card begins as a rough sketch — usually small, usually fast, made while the light or the feeling is still fresh. Most never go further. The few that do get redrawn properly, with the composition tightened and the palette pared back to a handful of colours.",
      "From there it's about the print. I work on A6 (148 × 105 mm) recycled stock with a soft matte finish, chosen because it takes ink beautifully and feels like something in the hand. Proofs get pinned to the wall for a week so I can live with them before committing to a run.",
      "Runs are deliberately small. When a design sells out, it's genuinely gone until I decide to print it again — which keeps the whole thing closer to a sketchbook than a factory.",
    ],
  },
  {
    slug: "drawing-on-the-road",
    title: "Drawing on the road: a travel-sketch kit",
    excerpt:
      "The tiny, stubborn kit that fits in a coat pocket and turns a layover into a postcard.",
    date: "2026-04-20",
    coverImage: "/images/art-travel.jpg",
    readingMinutes: 3,
    body: [
      "The travel pieces in the shop almost all started in the same place: a pocket sketchbook, one pen, and a little tin of half-pans. The constraint is the point — a small kit means you actually carry it, and you stop fussing and just look.",
      "Harbours at dusk, a tram climbing a tiled hill, the quiet of an alpine morning — these are the moments that are hard to photograph and easy to feel. A five-minute sketch holds the feeling better than any photo I've taken.",
      "If you're tempted to start: keep it small, keep it cheap, and let the pages be bad for a while. The good ones come.",
    ],
  },
  {
    slug: "the-colours-of-the-studio",
    title: "The colours of the studio",
    excerpt:
      "Why the whole shop leans warm — clay, gold, and ink — and how a tight palette holds a collection together.",
    date: "2026-03-30",
    coverImage: "/images/art-flowers.jpg",
    readingMinutes: 2,
    body: [
      "If you scroll the collection you'll notice it leans warm: clay reds, burnished gold, the cool steel of a far-off sea. That isn't an accident. A tight, repeated palette is what lets a set of very different scenes still feel like they belong together.",
      "Limiting colour also forces better decisions. When you can't reach for a brighter version, you have to make the composition do the work — and the work is usually better for it.",
      "It's the same instinct as the small print runs: a few good choices, made on purpose, beat endless options.",
    ],
  },
];

export const POST_SLUGS = POSTS.map((p) => p.slug);
export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
export const POSTS_BY_DATE = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
