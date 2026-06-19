# DOM Recipes — live measurement via browsing-with-playwright

These are the measurement primitives that turn a CRO opinion into evidence. Run
them through the **`browsing-with-playwright`** skill (Playwright MCP server on
`http://localhost:8808`). Two tools matter:

- **`browser_evaluate`** — runs one `() => {…}` function in the page and returns
  its (JSON-serialisable) value. Use for snapshots of current DOM state.
- **`browser_run_code`** — runs `async (page) => {…}` Playwright code. Use when
  you need to wait, observe over time (Web Vitals), or resize between reads.

**Invocation shape** (from the skill's `scripts/`):

```bash
python3 scripts/mcp-client.py call -u http://localhost:8808 \
  -t browser_evaluate -p '{"function": "() => { return document.title; }"}'
```

> Embedding tip: the `function` value is a JSON string. To avoid quote-escaping
> pain, prefer **single quotes inside the JS** (as below) so the outer JSON can
> use double quotes. For anything multi-step, use `browser_run_code` instead.

Always run `browser_snapshot` first when you need element `ref`s; re-snapshot
after every `browser_navigate` (refs are not stable across navigations).

---

## 1. Hero & above-the-fold extraction
What's the H1, and which CTAs are visible without scrolling? (Run at desktop
1280px AND after resizing to mobile 390px.)

```js
() => {
  const vh = window.innerHeight, vw = window.innerWidth;
  const aboveFold = el => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0 && r.left < vw; };
  const h1 = document.querySelector('h1');
  const ctas = Array.from(document.querySelectorAll('a,button,[role=button],input[type=submit]'))
    .map(e => { const r = e.getBoundingClientRect(); return {
        text: (e.innerText || e.value || '').trim().slice(0,80),
        tag: e.tagName, top: Math.round(r.top),
        w: Math.round(r.width), h: Math.round(r.height),
        aboveFold: aboveFold(e) }; })
    .filter(c => c.text);
  return JSON.stringify({
    viewport: { vw, vh },
    h1: h1 ? h1.innerText.trim() : null,
    subhead: (document.querySelector('h1 + p, h1 ~ p') || {}).innerText || null,
    ctasAboveFold: ctas.filter(c => c.aboveFold),
    ctaTotal: ctas.length
  });
}
```
**Reads against:** brief §1 (CTA above fold, message match), hero spec sheet
(above-the-fold = H1 + sub + CTA visible).

## 2. Tap-target check (run after resize to 390×844)
Flag interactive elements smaller than 44×44px.

```js
() => {
  const small = Array.from(document.querySelectorAll('a,button,[role=button],input,select'))
    .map(e => { const r = e.getBoundingClientRect(); return {
        text: (e.innerText || e.value || e.getAttribute('aria-label') || '').trim().slice(0,40),
        w: Math.round(r.width), h: Math.round(r.height) }; })
    .filter(e => e.w > 0 && e.h > 0 && (e.w < 44 || e.h < 44));
  return JSON.stringify({ failingCount: small.length, items: small.slice(0,30) });
}
```
**Reads against:** brief §9 (tap targets ≥ 44×44px).

## 3. Contrast (WCAG AA) for text & CTAs
Computes the contrast ratio of text vs its effective background.

```js
() => {
  const lum = c => { const a = c.map(v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }); return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]; };
  const parse = s => { const m = s.match(/\d+(\.\d+)?/g); return m ? m.slice(0,3).map(Number) : null; };
  const ratio = (fg,bg) => { const L1=lum(fg), L2=lum(bg), hi=Math.max(L1,L2), lo=Math.min(L1,L2); return (hi+0.05)/(lo+0.05); };
  const bgOf = el => { let n = el; while (n) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return parse(c); n = n.parentElement; } return [255,255,255]; };
  const sample = Array.from(document.querySelectorAll('h1,h2,p,a,button,[role=button]')).slice(0,40).map(el => {
    const cs = getComputedStyle(el), fg = parse(cs.color), bg = bgOf(el);
    if (!fg || !bg) return null;
    const r = +ratio(fg,bg).toFixed(2), size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
    return { tag: el.tagName, text: (el.innerText||'').trim().slice(0,40), fontPx: Math.round(size), ratio: r, passAA: large ? r >= 3 : r >= 4.5 };
  }).filter(Boolean);
  return JSON.stringify({ failingAA: sample.filter(s => !s.passAA).length, samples: sample });
}
```
**Reads against:** brief §2 (CTA high contrast), §7 (accessibility), hero §C
(CTA = highest-contrast element).

## 4. Page performance — quick read (browser_evaluate)
Navigation timing + paint, available immediately after load.

```js
() => {
  const nav = performance.getEntriesByType('navigation')[0] || {};
  const paint = {}; performance.getEntriesByType('paint').forEach(p => paint[p.name] = Math.round(p.startTime));
  return JSON.stringify({
    ttfbMs: Math.round(nav.responseStart || 0),
    domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd || 0),
    loadMs: Math.round(nav.loadEventEnd || 0),
    transferKB: Math.round((nav.transferSize || 0) / 1024),
    firstContentfulPaintMs: paint['first-contentful-paint'] || null
  });
}
```

## 5. Core Web Vitals — LCP & CLS (browser_run_code, needs a wait)
Observes for 3s after load. Replace `URL`.

```js
async (page) => {
  await page.goto('URL', { waitUntil: 'load' });
  const vitals = await page.evaluate(() => new Promise(resolve => {
    const out = { lcp: null, cls: 0 };
    new PerformanceObserver(l => { const e = l.getEntries(); out.lcp = Math.round(e[e.length-1].startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => { out.cls = +out.cls.toFixed(3); resolve(out); }, 3000);
  }));
  return JSON.stringify(vitals);
}
```
**Targets:** LCP < 2.5s, CLS < 0.1, load < ~2.5s (brief §7). LCP/CLS are
Chromium-only; note as a limitation if the observer returns null.

## 6. Form audit (field count, types, validation, autofill)
```js
() => {
  const forms = Array.from(document.querySelectorAll('form')).map(f => {
    const fields = Array.from(f.querySelectorAll('input,select,textarea'))
      .filter(e => !['hidden','submit','button'].includes(e.type));
    return {
      action: f.getAttribute('action') || null,
      fieldCount: fields.length,
      fields: fields.map(e => ({
        type: e.type || e.tagName.toLowerCase(),
        name: e.name || e.id || null,
        required: e.required || e.getAttribute('aria-required') === 'true',
        hasLabel: !!(e.labels && e.labels.length) || !!e.getAttribute('aria-label') || !!e.placeholder,
        autocomplete: e.getAttribute('autocomplete') || null,
        inputmode: e.getAttribute('inputmode') || null
      }))
    };
  });
  return JSON.stringify({ formCount: forms.length, forms });
}
```
**Reads against:** brief §4 & §9 (minimum fields, right keyboard via
inputmode/type, autofill via autocomplete), and hands detail to `form-cro`.
Field-cost rule: 3 = baseline, 4–6 = 10–25% drop, 7+ = 25–50%+ drop.

## 7. Trust signals & social proof detection
```js
() => {
  const text = document.body.innerText.toLowerCase();
  const imgs = Array.from(document.images).map(i => (i.alt || i.src || '').toLowerCase());
  const has = re => re.test(text);
  return JSON.stringify({
    mentionsCustomers: has(/trusted by|join \d|\d[\d,]*\+? (customers|users|teams|companies)/),
    hasTestimonialWords: has(/testimonial|reviews?|loved|recommend/),
    hasRating: has(/[0-5]\.\d\s*(\/|out of)\s*5|★|rated/),
    hasRiskReversal: has(/money-back|guarantee|no credit card|free trial|cancel anytime|refund/),
    logoLikeImages: imgs.filter(s => /logo|client|partner|brand/.test(s)).length,
    securityBadges: imgs.filter(s => /secure|ssl|gdpr|soc ?2|hipaa|norton|mcafee|badge/.test(s)).length
  });
}
```
**Reads against:** brief §3 (proof early, risk reversal, trust near forms).

## 8. Heading hierarchy & alt text (scannability + a11y)
```js
() => {
  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    .map(h => ({ level: +h.tagName[1], text: h.innerText.trim().slice(0,60) }));
  const imgs = Array.from(document.images);
  return JSON.stringify({
    h1Count: headings.filter(h => h.level === 1).length,
    outline: headings.slice(0,30),
    imagesMissingAlt: imgs.filter(i => !i.alt || !i.alt.trim()).length,
    imageTotal: imgs.length
  });
}
```
**Reads against:** brief §5 (scannable, hierarchy), §7 (alt text).

## 9. Mobile structure check (run after resize to 390×844)
```js
() => {
  const doc = document.documentElement;
  const meta = document.querySelector('meta[name=viewport]');
  const bodyFont = parseFloat(getComputedStyle(document.body).fontSize);
  return JSON.stringify({
    hasViewportMeta: !!meta,
    viewportContent: meta ? meta.getAttribute('content') : null,
    horizontalScroll: doc.scrollWidth > window.innerWidth + 2,
    scrollWidth: doc.scrollWidth, innerWidth: window.innerWidth,
    bodyFontPx: Math.round(bodyFont),
    bodyFontTooSmall: bodyFont < 16
  });
}
```
**Reads against:** brief §9 (single column / no horizontal scroll, legible
without zoom ≥16px).

## 10. Conversion-killers: autoplay sound, carousels, intrusive modals
```js
() => {
  const vids = Array.from(document.querySelectorAll('video')).map(v => ({ autoplay: v.autoplay, muted: v.muted }));
  const carousels = document.querySelectorAll('[class*=carousel],[class*=slider],[class*=swiper],.slick-slider').length;
  const modals = Array.from(document.querySelectorAll('[role=dialog],[class*=modal],[class*=popup],[class*=interstitial]'))
    .filter(m => { const s = getComputedStyle(m), r = m.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && r.width > window.innerWidth*0.6 && r.height > window.innerHeight*0.5; }).length;
  return JSON.stringify({
    autoplayWithSound: vids.filter(v => v.autoplay && !v.muted).length,
    carousels, intrusiveModalsVisible: modals
  });
}
```
**Reads against:** hero §F (no carousels, no autoplay-with-sound), brief §9 (no
intrusive interstitials).

## 11. Message-match snapshot (compare to the ad/source promise)
```js
() => JSON.stringify({
  title: document.title,
  metaDescription: (document.querySelector('meta[name=description]') || {}).content || null,
  h1: (document.querySelector('h1') || {}).innerText || null,
  firstCtaText: (document.querySelector('a[href],button') || {}).innerText || null
})
```
**Reads against:** brief non-negotiable #3 + hero §E. Compare `h1`/`title`
against the campaign/ad wording the user provides.

---

### Capture order per page (desktop then mobile)
1. `browser_navigate` → URL · `browser_wait_for` (load) · `browser_take_screenshot` `{fullPage:true}` (desktop 1280)
2. `browser_evaluate` recipes **1, 3, 4, 6, 7, 8, 10, 11**
3. `browser_run_code` recipe **5** (Web Vitals)
4. `browser_resize` `{width:390,height:844}` → `browser_take_screenshot` `{fullPage:true}` (mobile)
5. `browser_evaluate` recipes **1, 2, 9** (mobile re-reads)
6. `browser_console_messages` `{level:'error'}` + `browser_network_requests` (page-health / weight)

---

## Additional checks (12–17) — full doc-coverage completion

These recipes close the remaining gaps from the CRO brief (§6, §9) and the hero
spec sheet. Run them in the desktop pass unless marked mobile. All return JSON.

## 12. Click-to-call & tap-to-map (brief §9)
Phone numbers and addresses must be directly tappable on mobile.

```js
() => {
  const tel = document.querySelectorAll('a[href^="tel:"]').length;
  const mapLinks = document.querySelectorAll('a[href*="maps.google"],a[href*="goo.gl/maps"],a[href*="maps.apple"],a[href^="geo:"]').length;
  const body = document.body.innerText;
  const phoneInText = (body.match(/(\+?\d[\d\s().-]{7,}\d)/g) || []).length;
  const addressLikely = /\b\d{1,5}\s+\w+(\s\w+){0,3}\s+(st|street|ave|avenue|rd|road|blvd|suite|ste)\b/i.test(body);
  return JSON.stringify({
    clickToCallLinks: tel,
    tapToMapLinks: mapLinks,
    phoneNumbersInText: phoneInText,
    addressLikelyPresent: addressLikely,
    flag_phone_not_tappable: phoneInText > 0 && tel === 0,
    flag_address_not_tappable: addressLikely && mapLinks === 0
  });
}
```
**Reads against:** brief §9 (click-to-call & tap-to-map).

## 13. Hover-only interaction risk (brief §9 — "no hover-only")
Touch has no hover; nothing essential should hide behind it.

```js
() => {
  let hoverMenus = 0;
  document.querySelectorAll('nav, header').forEach(n => {
    n.querySelectorAll('li,[class*=dropdown],[class*=submenu],[class*=menu-item]').forEach(li => {
      const sub = li.querySelector('ul,[class*=submenu],[class*=dropdown-menu]');
      if (sub) {
        const t = li.querySelector('a,button');
        const clickAffordance = t && (t.getAttribute('aria-expanded') !== null || t.getAttribute('aria-haspopup') !== null);
        if (!clickAffordance) hoverMenus++;
      }
    });
  });
  return JSON.stringify({
    hoverRevealMenusWithoutClickAffordance: hoverMenus,
    note: 'Approximate: submenus that may rely on hover only (no aria-expanded/haspopup) — likely unreachable on touch'
  });
}
```
**Reads against:** brief §9 (no hover-only interactions).

## 14. Sticky CTA / sticky element (brief §2 & §9 — mobile bottom bar / sticky header)
```js
() => {
  const fixed = Array.from(document.querySelectorAll('header,nav,div,section,a,button')).filter(el => {
    const p = getComputedStyle(el).position; return p === 'fixed' || p === 'sticky';
  });
  const stickyCta = fixed.filter(el =>
    el.querySelector('a,button,[role=button]') || /book|buy|start|get|sign ?up|call|contact|quote|demo/i.test(el.innerText || '')
  ).slice(0,5).map(el => ({ position: getComputedStyle(el).position, text: (el.innerText||'').trim().slice(0,60) }));
  return JSON.stringify({ stickyOrFixedElements: fixed.length, stickyCtaPresent: stickyCta.length > 0, samples: stickyCta });
}
```
**Reads against:** brief §2 (sticky CTA on mobile), hero §D (sticky CTA bar).

## 15. Hero spec compliance — word counts (hero spec sheet, §G)
```js
() => {
  const words = s => (s || '').trim().split(/\s+/).filter(Boolean).length;
  const h1 = document.querySelector('h1');
  const sub = document.querySelector('h1 + p, h1 ~ p, h1 + div, [class*=subhead], [class*=subtitle]');
  const eyebrow = document.querySelector('[class*=eyebrow],[class*=overline],[class*=pre-head],[class*=kicker]');
  const cta = document.querySelector('a[class*=btn],a[class*=button],button,[role=button]');
  const hw = words(h1 && h1.innerText), sw = words(sub && sub.innerText);
  const ew = words(eyebrow && eyebrow.innerText), cw = words(cta && (cta.innerText || cta.value));
  return JSON.stringify({
    headlineWords: hw, headlineInSpec: hw >= 6 && hw <= 12,          // spec: 6–12
    subheadlineWords: sw, subInSpec: sw >= 15 && sw <= 30,           // spec: 15–30
    eyebrowWords: ew, eyebrowInSpec: ew === 0 || (ew >= 2 && ew <= 5), // spec: 2–5 (optional)
    ctaWords: cw, ctaInSpec: cw >= 2 && cw <= 5                       // spec: 2–5
  });
}
```
**Reads against:** hero spec sheet (eyebrow 2–5, headline 6–12, subheadline 15–30, CTA 2–5 words).

## 16. Analytics & tracking tags (brief §8 — "tracking from day one")
```js
() => {
  const html = document.documentElement.outerHTML;
  const has = re => re.test(html);
  const ga = (typeof window !== 'undefined' && typeof window.gtag === 'function') || has(/googletagmanager\.com\/gtag|google-analytics\.com\/(g|analytics)/);
  const gtm = has(/googletagmanager\.com\/gtm\.js/) || (typeof window !== 'undefined' && Array.isArray(window.dataLayer));
  const meta = (typeof window !== 'undefined' && typeof window.fbq === 'function') || has(/connect\.facebook\.net|fbevents\.js/);
  const tiktok = has(/analytics\.tiktok\.com/);
  return JSON.stringify({ ga4_or_gtag: ga, gtm, metaPixel: meta, tiktokPixel: tiktok, anyTrackingDetected: ga || gtm || meta || tiktok });
}
```
**Reads against:** brief §8 (event/conversion tracking present). Detects presence only — not whether events are configured correctly.

## 17. Persuasion & objection signals (brief §6)
```js
() => {
  const text = document.body.innerText.toLowerCase();
  const has = re => re.test(text);
  const faqHeading = Array.from(document.querySelectorAll('h2,h3,h4')).some(h => /faq|frequently asked|questions/i.test(h.innerText));
  const accordions = document.querySelectorAll('[class*=accordion],[class*=faq],details').length;
  return JSON.stringify({
    hasFAQ: faqHeading || accordions > 0,
    hasPricing: has(/\$\s?\d|\/(mo|month|year|yr)\b|pricing|per month|\bplan\b/),
    hasGuaranteeOrRiskReversal: has(/money-back|guarantee|no credit card|free trial|cancel anytime|refund/),
    hasUrgency: has(/limited time|ends (in|soon)|only \d+ (left|spots|seats)|today only|hurry/),
    hasCountdownTimer: document.querySelectorAll('[class*=countdown],[class*=timer],[data-countdown]').length > 0,
    note: 'If hasUrgency or hasCountdownTimer is true, verify it is GENUINE (real deadline) — fake countdowns erode trust (brief §6).'
  });
}
```
**Reads against:** brief §6 (answer objections / FAQ, genuine urgency only, pricing framing).

### Extended capture order (run these in addition to 1–11)
- **Desktop pass:** also run recipes **12, 14, 15, 16, 17**.
- **Mobile pass (after resize to 390×844):** also run recipes **12, 13, 14**.

---

## Manual-only checks (cannot be measured in a single page-load — FLAG in the report's Limitations)

These items from the brief are out of scope for an automated single-page audit.
Do NOT score them as pass/fail from the page alone — list them under **Limitations**
and recommend a manual or separate check:

- **Post-conversion confirmation** (brief §8) — the thank-you page + follow-up email match the design and reaffirm value. *(Requires completing the conversion; check separately.)*
- **Disciplined A/B testing** (brief §8) — needs an experiment setup over time, not a snapshot.
- **Real-device & throttled-4G testing** (brief §9) — needs real phones / network throttling, not a desktop browser at a mobile size.
- **Motion with purpose** (brief §7) — whether animation guides attention vs decorates: assess qualitatively from the recording/screenshots; no hard metric.
- **Localization** (brief §7) — currency/date/idiom/imagery fit for the target market: assess against the client's target market, not measurable from markup alone.

State clearly in the report which of these were not auto-assessed and why.
