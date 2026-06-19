import { createRequire } from 'module';
const require = createRequire('/home/raza/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const URL = 'https://web-paqbwgcv2-rrizwan1998-2036s-projects.vercel.app';
const OUT = '/home/raza/.openclaw/workspace/website-qa/evidence/lumiere-medspa';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(1500);
const h = await page.evaluate(() => document.body.scrollHeight);
const shots = [0.10, 0.22, 0.34, 0.46, 0.58, 0.70, 0.82, 0.94];
let i = 1;
for (const f of shots) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(h * f));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/scroll-${String(i).padStart(2,'0')}.png`, fullPage: false });
  i++;
}
// also count elements still at opacity 0 in viewport-independent way after a full scroll
await page.evaluate(async () => { for (let y=0; y<document.body.scrollHeight; y+=400){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,40)); } });
await page.waitForTimeout(1500);
const hidden = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('section, div, h2, h3, p, img'));
  let zero = 0;
  els.forEach(e => { const s = getComputedStyle(e); if (parseFloat(s.opacity) < 0.05) zero++; });
  return { totalChecked: els.length, stillOpacityZero: zero };
});
console.log(JSON.stringify(hidden));
await browser.close();
