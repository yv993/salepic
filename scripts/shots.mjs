// Screenshot every page at desktop+mobile, light+dark.
// Usage: node scripts/shots.mjs <label>   (label = before | after)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const label = process.argv[2] || "before";
const base = process.env.BASE || "http://localhost:3000";
const outDir = `screenshots/${label}`;
mkdirSync(outDir, { recursive: true });

const PAGES = [
  ["home", "/"],
  ["gallery", "/postcards"],
  ["detail", "/postcards/kyoto-at-dusk"],
  ["cart", "/cart"],
  ["checkout", "/checkout"],
  ["order", "/orders/PC-1FC573"],
  ["about", "/about"],
  ["notfound", "/this-route-does-not-exist"],
  ["admin", "/admin"],
];
const VIEWPORTS = [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
];
const THEMES = ["light", "dark"];

const browser = await chromium.launch();
let n = 0;
for (const theme of THEMES) {
  for (const [vp, w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
    });
    // next-themes reads localStorage "theme" before paint.
    await ctx.addInitScript((t) => {
      try { localStorage.setItem("theme", t); } catch {}
    }, theme);
    const page = await ctx.newPage();
    for (const [name, path] of PAGES) {
      try {
        await page.goto(base + path, { waitUntil: "networkidle", timeout: 45000 });
      } catch {
        // networkidle can hang on the animated shader canvas; fall back.
        await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
      }
      await page.waitForTimeout(600);
      // Scroll through (fires IntersectionObserver reveals), then force any
      // remaining reveal-up elements visible so the full page captures cleanly.
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y <= h; y += Math.round(window.innerHeight * 0.6)) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 150));
        }
        document.querySelectorAll(".reveal-up").forEach((e) => e.classList.add("is-visible"));
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      const file = `${outDir}/${name}__${vp}__${theme}.png`;
      await page.screenshot({ path: file, fullPage: true }).catch((e) => console.log("ERR", file, e.message));
      n++;
      console.log(file);
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`DONE ${n} shots -> ${outDir}`);
