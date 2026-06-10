import { chromium } from "playwright";
const base = "http://localhost:3000";
const r = [];
const ok = (n, p, d = "") => r.push(`${p ? "PASS" : "FAIL"}  ${n}${d ? " — " + d : ""}`);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Rainbow CTA: rendered, animated, clickable
await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
const rb = page.locator(".rainbow-btn").first();
const rbCount = await page.locator(".rainbow-btn").count();
const anim = await rb.evaluate((el) => getComputedStyle(el).animationName);
ok("rainbow CTA present", rbCount >= 1, `count=${rbCount}`);
ok("rainbow CTA animates", anim.includes("rainbow"), `animation-name=${anim}`);

// Scroll-progress bar present + tracks scroll
const bar = page.locator('div.fixed.top-0[aria-hidden]').first();
const barExists = await bar.count();
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
await page.waitForTimeout(500);
const sx = await page.locator('.origin-left').first().evaluate((el) => getComputedStyle(el).transform).catch(() => "none");
ok("scroll-progress bar present", barExists >= 1, `count=${barExists}`);
ok("scroll-progress tracks", sx !== "none" && sx !== "matrix(1, 0, 0, 1, 0, 0)", `transform=${sx}`);

// Progressive blur layers (testimonials + press strip)
const blurLayers = await page.evaluate(() =>
  [...document.querySelectorAll("*")].filter((e) => {
    const s = e.getAttribute("style") || "";
    return s.includes("backdrop-filter") || s.includes("backdropFilter");
  }).length,
);
ok("progressive-blur layers present", blurLayers >= 8, `layers=${blurLayers}`);

// Card spotlight wrapper present on gallery
await page.goto(`${base}/postcards`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);
const spot = await page.locator("article.group\\/card").count();
ok("postcard spotlight cards", spot >= 1, `cards=${spot}`);

// Add to cart → cart total ticker shows correct value
await page.locator('button:has-text("Add to cart")').first().click();
await page.waitForTimeout(1800);
await page.goto(`${base}/cart`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1800);
const totalText = await page.locator("dd").filter({ hasText: "$" }).last().innerText().catch(() => "?");
ok("cart total ticker value", /\$\d+\.\d{2}/.test(totalText), `total=${totalText}`);

// Rainbow CTA click navigates (hero)
await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);
await page.locator(".rainbow-btn").first().click();
await page.waitForTimeout(1200);
ok("rainbow CTA navigates", page.url().includes("/postcards"), page.url());

await b.close();
console.log("\n==== FX CHECK ====");
for (const x of r) console.log(x);
