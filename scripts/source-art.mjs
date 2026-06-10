// Source meaning-matched CC0 art prints from the Art Institute of Chicago
// (public domain). Picks an art-style result (painting/print/watercolor) per
// slot and downloads an IIIF JPG. Run: node scripts/source-art.mjs
import { writeFileSync, mkdirSync } from "node:fs";

mkdirSync("public/postcards", { recursive: true });
mkdirSync("public/images", { recursive: true });

const ART_TYPES = [
  "Painting", "Print", "Woodblock Print", "Drawing and Watercolor",
  "Drawing", "Watercolor", "Poster", "Miniature Painting",
];

// slot → { term, out, w } ; term chosen to match the slot's MEANING
const SLOTS = [
  { out: "public/postcards/kyoto-at-dusk.jpg", term: "kyoto evening japanese landscape", w: 760 },
  { out: "public/postcards/alpine-silence.jpg", term: "snow mountain winter landscape", w: 760 },
  { out: "public/postcards/neon-district.jpg", term: "paris street rainy day", w: 760 },
  { out: "public/postcards/cobalt-drift.jpg", term: "abstract blue composition", w: 760 },
  { out: "public/postcards/hello-sunshine.jpg", term: "sunrise sun landscape", w: 760 },
  { out: "public/postcards/first-snow.jpg", term: "snow effect road", w: 760 },
  { out: "public/postcards/the-red-fox.jpg", term: "fox", w: 760 },
  { out: "public/postcards/postal-nostalgia.jpg", term: "letters still life writing", w: 760 },
  { out: "public/postcards/harbor-lights.jpg", term: "harbor boats sea", w: 760 },
  { out: "public/postcards/wildflower-field.jpg", term: "poppies flowers field", w: 760 },
  // section slots (illustration/art)
  { out: "public/images/art-mail.jpg", term: "letters envelope still life", w: 1000 },
  { out: "public/images/art-travel.jpg", term: "travel landscape map", w: 1000 },
  { out: "public/images/art-studio.jpg", term: "still life desk interior painting", w: 1000 },
  { out: "public/images/art-flowers.jpg", term: "flowers bouquet still life", w: 1000 },
  { out: "public/images/art-harbor.jpg", term: "coast harbour seascape", w: 1000 },
];

async function pick(term) {
  const url =
    "https://api.artic.edu/api/v1/artworks/search?q=" +
    encodeURIComponent(term) +
    "&query%5Bterm%5D%5Bis_public_domain%5D=true" +
    "&fields=id,title,image_id,artwork_type_title,artist_title&limit=12";
  const r = await fetch(url);
  const j = await r.json();
  const data = (j.data || []).filter((a) => a.image_id);
  const art = data.find((a) => ART_TYPES.includes(a.artwork_type_title)) || data[0];
  return art || null;
}

const rows = [];
for (const s of SLOTS) {
  try {
    const a = await pick(s.term);
    if (!a) { rows.push([s.out, "NO RESULT", s.term]); continue; }
    const iiif = `https://www.artic.edu/iiif/2/${a.image_id}/full/${s.w},/0/default.jpg`;
    const img = await fetch(iiif, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        Referer: "https://www.artic.edu/",
        Accept: "image/avif,image/webp,image/jpeg,*/*",
      },
    });
    if (!img.ok) { rows.push([s.out, "DL FAIL " + img.status, a.title]); continue; }
    const buf = Buffer.from(await img.arrayBuffer());
    writeFileSync(s.out, buf);
    rows.push([s.out, `${Math.round(buf.length / 1024)}KB`, `${a.title} — ${a.artwork_type_title} (${a.artist_title || "—"})`, a.id]);
  } catch (e) {
    rows.push([s.out, "ERR", String(e).slice(0, 60)]);
  }
}
console.log("OUT\tSIZE\tARTWORK\tAIC_ID");
for (const r of rows) console.log(r.join("\t"));
