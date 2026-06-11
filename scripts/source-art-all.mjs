// Source CC0 fine-art (Art Institute of Chicago Open Access) for the ~70
// postcards still on a placeholder, matching the meaning of each + the
// vintage-painting/print style of the 10 restored originals. De-dupes so no
// artwork is used twice (incl. the originals).
//   node scripts/source-art-all.mjs            (all)
//   node scripts/source-art-all.mjs slug1 ...  (only these — for re-tries)
import { writeFileSync, mkdirSync } from "node:fs";

mkdirSync("public/postcards", { recursive: true });

const ART_TYPES = [
  "Painting", "Print", "Woodblock Print", "Drawing and Watercolor",
  "Drawing", "Watercolor", "Poster", "Miniature Painting", "Etching",
];

const ORIGINALS = new Set([
  "kyoto-at-dusk", "alpine-silence", "neon-district", "cobalt-drift",
  "hello-sunshine", "first-snow", "the-red-fox", "postal-nostalgia",
  "harbor-lights", "wildflower-field",
]);
// Ids used by the 10 originals — never reuse.
const ORIGINAL_IDS = [87008, 72801, 20684, 109819, 94841, 81545, 36297, 154496, 180711, 4783];

// slug -> AIC search term (meaning-matched, varied so de-dupe finds distinct art).
const TERMS = {
  // travel
  "santorini-blue": "mediterranean coast village sea painting",
  "marrakech-market": "still life fruit market painting",
  "lisbon-tram": "european city street scene painting",
  "venice-canal": "venice canal painting",
  "sahara-dunes": "desert oasis landscape painting",
  "iceland-road": "glacier mountain landscape church painting",
  "patagonia-peaks": "snow mountain range bierstadt painting",
  "amalfi-coast": "cliffs sea coast monet painting",
  // nature
  "autumn-birches": "autumn forest trees landscape painting",
  "misty-pines": "alpine pine forest mountain painting",
  "desert-bloom": "blossoming branch flowers print",
  "river-bend": "river bank summer landscape painting",
  "coral-reef": "tropical fish watercolor",
  "thunderhead": "storm clouds sky cloud study painting",
  "mossy-falls": "forest stream rocks landscape painting",
  "lavender-rows": "summer field haystacks landscape painting",
  // city
  "midnight-metro": "railway station train painting",
  "rooftop-skyline": "city skyline view painting",
  "rainy-crossing": "paris boulevard street pissarro painting",
  "old-town-square": "village square town painting",
  "bridge-at-dawn": "waterloo bridge fog monet painting",
  "corner-cafe": "cafe terrace evening painting",
  "subway-stairs": "city street figures scene painting",
  "harbor-cranes": "industrial port harbor painting",
  "alley-lanterns": "japanese night street woodblock print",
  // abstract — varied artists so de-dupe yields different works
  "ember-fold": "kandinsky improvisation abstract",
  "tidal-static": "whistler nocturne grey blue",
  "gilded-fracture": "japanese gold folding screen print",
  "soft-machine": "kandinsky abstract composition painting",
  "night-bloom": "flowers vase still life painting",
  "paper-tide": "abstract watercolor wassily kandinsky",
  "magnetic-north": "abstract geometric composition painting",
  "warm-static": "abstract composition red modern",
  "prism-shift": "kupka color planes orphism",
  // typography — evocative fine-art (sentiment, not lettering)
  "thinking-of-you": "woman reading letter painting",
  "wish-you-were-here": "beach cliffs etretat painting",
  "good-news-soon": "sunrise dawn landscape painting",
  "be-kind": "vase of flowers still life painting",
  "safe-travels": "sailing ship sea painting",
  "happy-mail": "cheerful flowers bouquet still life painting",
  "take-it-slow": "pastoral landscape ruins painting",
  "big-love": "roses bouquet flowers print",
  "adventure-awaits": "italian landscape travelers painting",
  // seasonal
  "spring-thaw": "spring blossom trees landscape painting",
  "summer-solstice": "summer landscape golden field painting",
  "harvest-moon": "moonlit night landscape painting",
  "frost-window": "snow field morning winter painting",
  "cherry-blossom": "cherry blossom woodblock print",
  "autumn-hearth": "autumn red maple forest painting",
  "midwinter-lights": "winter night snow village painting",
  "equinox-tide": "calm seascape horizon painting",
  "new-year-sky": "fireworks night woodblock print",
  // animals
  "snowy-owl": "owl bird print engraving",
  "harbor-seal": "seal marine animal print",
  "garden-hare": "rabbit hare meadow woodblock print",
  "paper-crane": "crane bird japanese woodblock print",
  "humpback-breach": "ocean wave sea woodblock print",
  "hummingbird": "bird on flowering branch woodblock print",
  "sleeping-cat": "cat animal japanese woodblock print",
  "mountain-goat": "goat sheep animal painting",
  "koi-pond": "koi carp fish woodblock print",
  // vintage — distinct still-life / object subjects
  "airmail-par-avion": "still life letters writing table painting",
  "grand-hotel": "art nouveau poster mucha",
  "botanical-plate": "flowers botanical watercolor study",
  "steamliner": "steamship sailing ship storm painting",
  "typewriter-keys": "still life desk writing objects painting",
  "vintage-globe": "still life books table painting",
  "pressed-ticket": "still life playing cards papers painting",
  "old-camera": "still life table objects painting",
  "library-card": "still life books library painting",
};

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  Referer: "https://www.artic.edu/",
  Accept: "image/avif,image/webp,image/jpeg,*/*",
};

const used = new Set(ORIGINAL_IDS);

async function candidates(term) {
  const url =
    "https://api.artic.edu/api/v1/artworks/search?q=" +
    encodeURIComponent(term) +
    "&query%5Bterm%5D%5Bis_public_domain%5D=true" +
    "&fields=id,title,image_id,artwork_type_title,artist_title&limit=30";
  const r = await fetch(url, { headers: HEADERS });
  const j = await r.json();
  return (j.data || []).filter((a) => a.image_id);
}

async function download(a, slug) {
  const iiif = `https://www.artic.edu/iiif/2/${a.image_id}/full/900,/0/default.jpg`;
  const img = await fetch(iiif, { headers: HEADERS });
  if (!img.ok) return false;
  const buf = Buffer.from(await img.arrayBuffer());
  writeFileSync(`public/postcards/${slug}.jpg`, buf);
  return Math.round(buf.length / 1024);
}

const only = process.argv.slice(2);
const slugs = (only.length ? only : Object.keys(TERMS)).filter((s) => !ORIGINALS.has(s));

const rows = [];
for (const slug of slugs) {
  const term = TERMS[slug];
  try {
    const cands = await candidates(term);
    // ONLY 2D art types (no vessels/photographs/sculpture). Prefer unused ids.
    const art = cands.filter((a) => ART_TYPES.includes(a.artwork_type_title));
    const ranked = [...art.filter((a) => !used.has(a.id)), ...art];
    let done = false;
    for (const a of ranked) {
      const kb = await download(a, slug);
      if (kb) {
        used.add(a.id);
        rows.push([slug, `${kb}KB`, `${a.title} — ${a.artwork_type_title} (${a.id})`]);
        done = true;
        break;
      }
    }
    if (!done) rows.push([slug, "FAIL", term]);
  } catch (e) {
    rows.push([slug, "ERR", String(e).slice(0, 50)]);
  }
}
for (const r of rows) console.log(r.join("\t"));
console.log(`\nDone: ${rows.filter((r) => r[1].endsWith("KB")).length}/${slugs.length}`);
