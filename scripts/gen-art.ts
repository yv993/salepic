/**
 * Generate a cohesive set of illustrated postcard SVGs — one for every entry in
 * the catalog — into public/postcards/<slug>.svg.
 *
 * ONE visual language (riso-grain "paper postcard": warm paper, 2–3 flat ink
 * colours, soft grain, an inner frame + a little "POSTED" stamp). The scene
 * archetype is chosen by CATEGORY; all positions/counts/variant are seeded by
 * the SLUG, so no two cards are identical and none are broken.
 *
 *   npx tsx scripts/gen-art.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { SEED } from "../src/db/catalog";
import type { ProductCategory } from "../src/db/schema";

const W = 1410;
const H = 1000;
const OUT = "public/postcards";
mkdirSync(OUT, { recursive: true });

/* ---------- seeded RNG (deterministic per slug) ---------- */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- cohesive palettes (warm paper + flat inks) ---------- */
type Pal = { paper: string; sky: [string, string]; sun: string; inks: string[] };
const PALETTES: Record<ProductCategory, Pal[]> = {
  travel: [
    { paper: "#f2e7d2", sky: ["#f6dcae", "#efc98f"], sun: "#e8a04b", inks: ["#7d9aa6", "#4d6b78", "#2f4651"] },
    { paper: "#f1e6d6", sky: ["#f3d2b0", "#e7a98a"], sun: "#d9772f", inks: ["#a8625a", "#7a3f3f", "#46322f"] },
    { paper: "#eee6d4", sky: ["#cfe0df", "#a9c6c6"], sun: "#e6b85c", inks: ["#5f8b86", "#3d6360", "#274240"] },
  ],
  nature: [
    { paper: "#eee7d3", sky: ["#dfe7c8", "#c2d3a0"], sun: "#e6c453", inks: ["#8aa364", "#5c7b46", "#3a512f"] },
    { paper: "#ece8d8", sky: ["#cfe1dc", "#a7c6bd"], sun: "#dcb24e", inks: ["#6f9079", "#47694f", "#2f4736"] },
    { paper: "#f0e8d6", sky: ["#f1d9b4", "#dcbf8e"], sun: "#d98a3a", inks: ["#9c8a52", "#6c6638", "#403d22"] },
  ],
  city: [
    { paper: "#e7e3df", sky: ["#3a4254", "#222633"], sun: "#e6b85c", inks: ["#5b6781", "#39435a", "#202632"] },
    { paper: "#e6e1dd", sky: ["#53364a", "#2a1d2e"], sun: "#e88a5a", inks: ["#7a5a72", "#4d3a4c", "#281d2a"] },
    { paper: "#e4e4e2", sky: ["#2f3b46", "#1b2228"], sun: "#d9a441", inks: ["#566571", "#384149", "#1f262b"] },
  ],
  abstract: [
    { paper: "#efe7d6", sky: ["#efe7d6", "#efe7d6"], sun: "#d9a441", inks: ["#c1543a", "#4d6b78", "#d9a441"] },
    { paper: "#ece6dc", sky: ["#ece6dc", "#ece6dc"], sun: "#c1543a", inks: ["#5f8b86", "#c9883f", "#3a4651"] },
    { paper: "#efe9dd", sky: ["#efe9dd", "#efe9dd"], sun: "#7a3f3f", inks: ["#cf9b5e", "#7d9aa6", "#a8462e"] },
  ],
  typography: [
    { paper: "#f3ead4", sky: ["#f3ead4", "#f3ead4"], sun: "#d9a441", inks: ["#c1543a", "#46322f", "#d9a441"] },
    { paper: "#efe7da", sky: ["#efe7da", "#efe7da"], sun: "#4d6b78", inks: ["#3a4651", "#d9772f", "#46322f"] },
    { paper: "#f1e8d2", sky: ["#f1e8d2", "#f1e8d2"], sun: "#d98a3a", inks: ["#5c7b46", "#a8462e", "#3a512f"] },
  ],
  seasonal: [
    { paper: "#eef0ec", sky: ["#dde7ec", "#bcd0da"], sun: "#e6c453", inks: ["#9fb2ba", "#6f8a93", "#46606a"] },
    { paper: "#f1e8d8", sky: ["#f4d8b6", "#e7b489"], sun: "#dd7a3a", inks: ["#b9743f", "#8a4a33", "#4a2f2a"] },
    { paper: "#efe9dc", sky: ["#e7d6e2", "#c7a9c2"], sun: "#e0a45a", inks: ["#9b7790", "#6b4d66", "#3e2d3c"] },
  ],
  animals: [
    { paper: "#f0e8d6", sky: ["#f1d9b4", "#dcbf8e"], sun: "#e0913a", inks: ["#a8623a", "#7a3f2f", "#402a22"] },
    { paper: "#eee7d3", sky: ["#dfe7c8", "#c2d3a0"], sun: "#e6c453", inks: ["#7f9a6a", "#52704a", "#33472f"] },
    { paper: "#eceae0", sky: ["#dfe6ea", "#b9ccd3"], sun: "#d9a441", inks: ["#6f8a93", "#46606a", "#2b3c43"] },
  ],
  vintage: [
    { paper: "#e9dcc0", sky: ["#e3d2ad", "#cdb487"], sun: "#b07a3a", inks: ["#9c7a4a", "#6f5331", "#3f2f1d"] },
    { paper: "#e7d8bd", sky: ["#ddc9a2", "#c2a877"], sun: "#a8633a", inks: ["#a06440", "#6f3f2a", "#3d251a"] },
    { paper: "#eaddc4", sky: ["#e0d0ac", "#c8ad80"], sun: "#9c7a4a", inks: ["#7d7a52", "#534f31", "#2f2c1a"] },
  ],
};

/* ---------- scene archetypes ---------- */
type R = () => number;
const ri = (r: R, a: number, b: number) => Math.floor(a + r() * (b - a + 1));
const f = (n: number) => Math.round(n * 10) / 10;

function hill(yBase: number, amp: number, r: R, fill: string) {
  const pts: string[] = [`M -20 ${H}`, `L -20 ${yBase}`];
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const x = f((-20 + (W + 40) * (i / steps)));
    const y = f(yBase + Math.sin(i * 1.3 + r() * 6) * amp - r() * amp * 0.5);
    pts.push(`L ${x} ${y}`);
  }
  pts.push(`L ${W + 20} ${H} Z`);
  return `<path d="${pts.join(" ")}" fill="${fill}"/>`;
}

function landscape(r: R, p: Pal, angular = false) {
  const sunX = ri(r, 280, 1120);
  const sunY = ri(r, 170, 360);
  const sunR = ri(r, 90, 150);
  let s = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
  s += `<circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${p.sun}" opacity="0.92"/>`;
  const layers = 3;
  for (let i = 0; i < layers; i++) {
    const yBase = 430 + i * 150 + ri(r, -30, 30);
    const amp = angular ? ri(r, 120, 200) : ri(r, 50, 110);
    if (angular) {
      // jagged mountains
      const pts: string[] = [`M -20 ${H} L -20 ${yBase}`];
      const peaks = ri(r, 3, 5);
      for (let k = 0; k <= peaks; k++) {
        const x = f((-20 + (W + 40) * (k / peaks)));
        const y = f(yBase - (k % 2 === 0 ? amp : 0) - r() * 40);
        pts.push(`L ${x} ${y}`);
      }
      pts.push(`L ${W + 20} ${H} Z`);
      s += `<path d="${pts.join(" ")}" fill="${p.inks[i]}" opacity="${0.95 - i * 0.05}"/>`;
    } else {
      s += hill(yBase, amp, r, p.inks[i]);
    }
  }
  return s;
}

function skyline(r: R, p: Pal) {
  let s = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
  s += `<circle cx="${ri(r, 200, 1200)}" cy="${ri(r, 150, 300)}" r="${ri(r, 70, 120)}" fill="${p.sun}" opacity="0.9"/>`;
  const base = H - 40;
  let x = -10;
  const inks = p.inks;
  let li = 0;
  while (x < W + 10) {
    const w = ri(r, 70, 150);
    const h = ri(r, 220, 620);
    const ink = inks[li % inks.length];
    s += `<rect x="${x}" y="${base - h}" width="${w - 8}" height="${h}" fill="${ink}"/>`;
    // windows
    const cols = Math.max(1, Math.floor((w - 28) / 26));
    const rows = Math.floor((h - 40) / 34);
    for (let cy = 0; cy < rows; cy++)
      for (let cx = 0; cx < cols; cx++)
        if (r() > 0.45)
          s += `<rect x="${x + 14 + cx * 26}" y="${base - h + 22 + cy * 34}" width="11" height="14" fill="${p.sun}" opacity="0.65"/>`;
    x += w;
    li++;
  }
  return s;
}

function abstractComp(r: R, p: Pal) {
  let s = `<rect width="${W}" height="${H}" fill="${p.paper}"/>`;
  s += `<circle cx="${ri(r, 400, 1000)}" cy="${ri(r, 300, 700)}" r="420" fill="${p.sun}" opacity="0.12"/>`;
  const n = ri(r, 5, 7);
  for (let i = 0; i < n; i++) {
    const ink = p.inks[i % p.inks.length];
    const cx = ri(r, 250, 1160);
    const cy = ri(r, 220, 780);
    const op = (0.55 + r() * 0.3).toFixed(2);
    const kind = ri(r, 0, 2);
    const sz = ri(r, 180, 360);
    if (kind === 0)
      s += `<circle cx="${cx}" cy="${cy}" r="${sz / 2}" fill="${ink}" opacity="${op}" style="mix-blend-mode:multiply"/>`;
    else if (kind === 1)
      s += `<rect x="${cx - sz / 2}" y="${cy - sz / 2}" width="${sz}" height="${sz * (0.5 + r())}" fill="${ink}" opacity="${op}" transform="rotate(${ri(r, -25, 25)} ${cx} ${cy})" style="mix-blend-mode:multiply"/>`;
    else
      s += `<path d="M ${cx} ${cy - sz / 2} L ${cx + sz / 2} ${cy + sz / 2} L ${cx - sz / 2} ${cy + sz / 2} Z" fill="${ink}" opacity="${op}" transform="rotate(${ri(r, -20, 20)} ${cx} ${cy})" style="mix-blend-mode:multiply"/>`;
  }
  return s;
}

function typographyCard(r: R, p: Pal, title: string) {
  const initial = (title.trim()[0] || "P").toUpperCase();
  const word = title.split(" ")[0].toUpperCase();
  let s = `<rect width="${W}" height="${H}" fill="${p.paper}"/>`;
  s += `<circle cx="${ri(r, 300, 1110)}" cy="${ri(r, 240, 520)}" r="${ri(r, 200, 340)}" fill="${p.sun}" opacity="0.16"/>`;
  s += `<text x="${W / 2}" y="${H / 2 + 170}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="560" fill="${p.inks[0]}">${initial}</text>`;
  s += `<text x="${W / 2}" y="${H - 150}" text-anchor="middle" font-family="Georgia, serif" font-size="78" letter-spacing="10" fill="${p.inks[1]}">${word}</text>`;
  s += `<rect x="${W / 2 - 90}" y="${H - 110}" width="180" height="6" fill="${p.sun}"/>`;
  return s;
}

function creature(r: R, p: Pal) {
  // a simple seeded silhouette sitting on the foreground hill
  const ink = p.inks[2];
  const cx = ri(r, 420, 1000);
  const gy = 760;
  const bodyW = ri(r, 150, 230);
  const bodyH = ri(r, 90, 140);
  let s = `<g fill="${ink}">`;
  s += `<ellipse cx="${cx}" cy="${gy}" rx="${bodyW}" ry="${bodyH}"/>`; // body
  const headX = cx + bodyW * 0.7;
  s += `<circle cx="${headX}" cy="${gy - bodyH * 0.7}" r="${bodyH * 0.7}"/>`; // head
  // ears
  s += `<path d="M ${headX - 20} ${gy - bodyH * 1.2} l 24 -60 l 24 56 z"/>`;
  s += `<path d="M ${headX + 30} ${gy - bodyH * 1.25} l 24 -60 l 22 60 z"/>`;
  // tail
  s += `<path d="M ${cx - bodyW} ${gy} q -120 -20 -150 -120 q 70 40 150 60 z"/>`;
  s += `</g>`;
  return s;
}

function vintageCard(r: R, p: Pal) {
  let s = `<rect width="${W}" height="${H}" fill="${p.paper}"/>`;
  // mini scene inside
  s += `<g opacity="0.9">`;
  s += `<rect x="120" y="120" width="${W - 240}" height="${H - 240}" fill="url(#sky)"/>`;
  s += `<circle cx="${ri(r, 360, 1050)}" cy="${ri(r, 240, 380)}" r="${ri(r, 70, 120)}" fill="${p.sun}"/>`;
  s += `<path d="M 120 ${H - 120} L 120 620 L 470 480 L 820 600 L 1120 460 L ${W - 120} 580 L ${W - 120} ${H - 120} Z" fill="${p.inks[1]}"/>`;
  s += `</g>`;
  // perforated stamp frame
  s += `<rect x="60" y="60" width="${W - 120}" height="${H - 120}" fill="none" stroke="${p.inks[2]}" stroke-width="6" stroke-dasharray="2 26" stroke-linecap="round" opacity="0.8"/>`;
  // postmark
  const px = ri(r, 980, 1180);
  const py = ri(r, 200, 320);
  s += `<g fill="none" stroke="${p.inks[2]}" stroke-width="6" opacity="0.5">`;
  s += `<circle cx="${px}" cy="${py}" r="92"/><circle cx="${px}" cy="${py}" r="70"/>`;
  for (let a = 0; a < 12; a++) {
    const ang = (a / 12) * Math.PI * 2;
    s += `<line x1="${f(px + Math.cos(ang) * 70)}" y1="${f(py + Math.sin(ang) * 70)}" x2="${f(px + Math.cos(ang) * 92)}" y2="${f(py + Math.sin(ang) * 92)}"/>`;
  }
  s += `</g>`;
  s += `<text x="${W / 2}" y="${H - 150}" text-anchor="middle" font-family="Georgia, serif" font-size="46" letter-spacing="14" fill="${p.inks[2]}" opacity="0.8">POST CARD</text>`;
  return s;
}

function render(category: ProductCategory, slug: string, title: string) {
  const r = mulberry32(hash(slug));
  const variants = PALETTES[category];
  const p = variants[Math.floor(r() * variants.length)];
  let scene = "";
  switch (category) {
    case "city":
      scene = skyline(r, p);
      break;
    case "abstract":
      scene = abstractComp(r, p);
      break;
    case "typography":
      scene = typographyCard(r, p, title);
      break;
    case "vintage":
      scene = vintageCard(r, p);
      break;
    case "animals":
      scene = landscape(r, p, false) + creature(r, p);
      break;
    case "seasonal": {
      scene = landscape(r, p, false);
      const dots = ri(r, 26, 46);
      let d = `<g fill="#ffffff" opacity="0.75">`;
      for (let i = 0; i < dots; i++)
        d += `<circle cx="${ri(r, 0, W)}" cy="${ri(r, 0, 620)}" r="${ri(r, 3, 9)}"/>`;
      scene += d + `</g>`;
      break;
    }
    case "travel":
      scene = landscape(r, p, true);
      break;
    case "nature":
    default:
      scene = landscape(r, p, false);
      break;
  }

  const sky = `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    ${sky}
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <radialGradient id="vig" cx="50%" cy="42%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.16"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${p.paper}"/>
  ${scene}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.06"/>
  <rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="${p.inks[2]}" stroke-width="3" opacity="0.4"/>
  <g transform="translate(${W - 150} ${H - 132})" opacity="0.8">
    <rect width="96" height="104" rx="6" fill="none" stroke="${p.inks[2]}" stroke-width="3" stroke-dasharray="2 9"/>
    <text x="48" y="56" text-anchor="middle" font-family="Georgia, serif" font-size="46" font-weight="700" fill="${p.inks[2]}">P</text>
    <text x="48" y="84" text-anchor="middle" font-family="Georgia, serif" font-size="13" letter-spacing="2" fill="${p.inks[2]}">POSTED</text>
  </g>
</svg>`;
}

let n = 0;
for (const card of SEED) {
  const svg = render(card.category ?? "travel", card.slug, card.title);
  writeFileSync(`${OUT}/${card.slug}.svg`, svg, "utf8");
  n++;
}
console.log(`Generated ${n} postcard SVGs into ${OUT}/`);
