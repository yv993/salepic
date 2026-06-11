import { chromium } from "playwright";
import { existsSync } from "node:fs";
const slugs = process.argv.slice(2);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport:{width:900,height:638}, deviceScaleFactor:2 })).newPage();
let n=0;
for (const s of slugs) {
  const svg = `public/postcards/${s}.svg`;
  if (!existsSync(svg)) { console.log(`MISS ${s}`); continue; }
  await p.goto(`file:///C:/Users/ysaha/Desktop/robot/${svg}`, { waitUntil:"networkidle" });
  await p.waitForTimeout(150);
  await p.screenshot({ path:`public/postcards/${s}.jpg`, type:"jpeg", quality:88 });
  n++;
}
await b.close(); console.log(`rasterized ${n}`);
