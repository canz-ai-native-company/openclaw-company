---
name: design-qa-polish
description: |
  Final polish pass before shipping a landing page. The 30-minute "before client sees
  it" checklist that catches the small things — orphan elements, inconsistent radii,
  wonky mobile, missing focus rings, slow hero. Run AFTER ui-ux-audit and AFTER
  fixes. Triggers on "polish", "final pass", "ship it", "ready to deploy".
---

# Design QA & Final Polish Skill

`ui-ux-audit` finds problems. This skill is the **fix-and-ship** pass — methodical,
fast, item-by-item. It's what separates a 7/10 page from a 9/10 page.

---

## When to Run

- After `ui-ux-audit` issues are fixed, as the final gate
- Before pushing to production
- Before screenshot for portfolio / handoff to client
- Skipping this step is why pages ship feeling "almost there"

---

## The Polish Checklist (~30 minutes if no major issues)

Run top-to-bottom, in the live page (browser, not Figma).

### A. Hero Polish (5 min)

- [ ] Headline doesn't break awkwardly at any common viewport width (use `text-balance`)
- [ ] Subhead isn't too wide — uses `max-w-2xl` or `max-w-prose`
- [ ] CTAs have both hover AND focus states
- [ ] Primary CTA shadow / glow visible on dark mode (don't rely on drop shadow)
- [ ] Trust strip not too cramped — use `gap-x-6 gap-y-2` for wrapping
- [ ] Hero visual loads first paint (priority + WebP/AVIF)
- [ ] Background depth treatment doesn't cause horizontal overflow on mobile
  (`overflow-hidden` on hero section)

### B. Typography Pass (3 min)

- [ ] All headings have `letter-spacing: -0.02em` or per the system
- [ ] All body uses `text-pretty` or has `max-w-prose` to prevent rivers
- [ ] No orphan word at end of headline (one word alone) — fix with `text-balance`
  or different break
- [ ] Numbers in stats use tabular-nums: `font-feature-settings: 'tnum'`
- [ ] No font sizes < 14px for body text
- [ ] Mono font properly applied to code/numbers/eyebrows

### C. Color & Contrast (3 min)

Open DevTools accessibility panel:

- [ ] All body text contrast ≥ 4.5:1
- [ ] All large text contrast ≥ 3:1
- [ ] Disabled buttons have reduced opacity AND a subtle indicator (don't rely
  only on color)
- [ ] Focus rings visible — `ring-2 ring-accent ring-offset-2 ring-offset-bg`
- [ ] Selection color (`::selection`) matches brand
- [ ] Error states visible without color (icon + text)

### D. Spacing & Alignment (5 min)

Walk every section:

- [ ] Section padding consistent (`py-section` mobile, `py-section-lg` desktop)
- [ ] Container max-width consistent (`max-w-7xl` standard)
- [ ] Horizontal padding consistent (`px-6 sm:px-8 lg:px-12`)
- [ ] Element spacing within sections uses spacing tokens, not magic numbers
- [ ] Card grids use `gap-6` or `gap-8`, not mixed
- [ ] Bento grid (if any) has consistent gap throughout

### E. Component Consistency (3 min)

- [ ] All buttons same height per variant (`h-11` for md, `h-12` for lg)
- [ ] All cards same border treatment within a section
- [ ] All inputs same height as buttons (matches forms)
- [ ] Icons all from one set, all 1.5px or all 2px stroke — not mixed

### F. Animation Polish (3 min)

- [ ] All hover transitions 150-250ms
- [ ] Mount animations fully done by 1.5s
- [ ] No element flashes/snaps in (use `whileInView` with `once: true`)
- [ ] Reduced motion: open DevTools → Rendering → emulate `prefers-reduced-motion`,
  reload, verify no transforms run
- [ ] No animation runs while element is off-screen

### G. Mobile Pass (5 min)

Open DevTools at 375×812:

- [ ] No horizontal scroll
- [ ] Hero looks deliberate, not shrunk
- [ ] CTAs full-width
- [ ] Mobile nav (drawer) works smoothly
- [ ] Bento / cards stacked properly
- [ ] Text doesn't get tiny — minimum 14px body
- [ ] Tap targets ≥ 44×44
- [ ] Sticky bottom CTA appears after hero (long pages)
- [ ] Forms: input types correct (email, tel, url) for mobile keyboards

Then test at 768×1024 (tablet) and 1280 (laptop) — common breakdown points.

### H. Performance Pass (3 min)

Run Lighthouse on production build:

- [ ] LCP < 2.5s
- [ ] CLS < 0.1 (any layout shift on load? hero image without dimensions causes this)
- [ ] INP < 200ms (interaction delay)
- [ ] Total transferred < 1MB for first paint
- [ ] No 4xx/5xx in network panel
- [ ] No console errors / warnings in production build

If LCP > 2.5s:
- Hero image not WebP / not sized → fix
- Hero image missing `priority` → add
- Custom font blocking → ensure `display: swap`
- Too much JS on initial load → check if you can server-render more

### I. SEO & Meta (3 min)

- [ ] `<title>` set per page (≤ 60 chars), unique
- [ ] `<meta name="description">` set (≤ 160 chars), unique
- [ ] Open Graph tags: og:title, og:description, og:image, og:url, og:type
- [ ] Twitter Card tags: twitter:card (summary_large_image), twitter:image
- [ ] OG image is 1200×630
- [ ] favicon present (32×32 + 512×512 PWA)
- [ ] sitemap.xml exists
- [ ] robots.txt exists, allows indexing
- [ ] Structured data (JSON-LD) for Organization, Product, or LocalBusiness as
  fits the brand

### J. Form Polish (if forms present, 2 min)

- [ ] Loading state on submit ("Creating account…", not "Loading…")
- [ ] Success state with clear next step
- [ ] Error state with specific message ("Email already in use" not "Error")
- [ ] Required fields marked clearly
- [ ] Email validation client-side + server-side
- [ ] Honeypot or other spam protection
- [ ] Consent line / privacy link if collecting any data

### K. Final "Read it Like a Stranger" Pass (3 min)

Close all tabs. Open the page fresh. Pretend you've never seen it. Ask:

- Within 5 seconds of landing, do I know WHAT this is and WHO it's for?
- Within 10 seconds, do I know WHY I should care?
- Within 15 seconds, can I find the next step (CTA)?
- Is there one moment that makes me say "oh, nice"?
- Would I trust this brand to give them my email / credit card?

If any answer is no — back to `ui-ux-audit`.

---

## The "Tiny Wins" Polish List (Pick 3-5 to Add)

Once the checklist passes, these small touches push the page toward 9-10/10:

1. **Magnetic primary CTA** — see motion-design-system. Adds delight to the hero.
2. **Scroll progress bar** — thin accent-colored bar at top, premium feel.
3. **Cursor spotlight on cards** — radial-gradient that follows mouse on hover.
4. **Subtle gradient on key heading word** — `bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent`.
5. **Tabular-nums for stats / pricing** — numbers don't jiggle.
6. **Custom selection color** — `::selection { background: var(--accent); color: var(--accent-fg); }`
7. **Smooth-scroll to anchors** — `html { scroll-behavior: smooth; scroll-padding-top: 80px; }`
8. **Custom 404 page** — even if not linked from landing, shows you care.
9. **Subtle text shadow on hero headline (dark theme)** — `text-shadow: 0 0 24px rgba(139,92,246,0.2)` for a glow.
10. **Animate eyebrow shimmer** — subtle gradient sweep on the "New" badge.
11. **Copy link / share button** on testimonials.
12. **Animated favicon** during loading (subtle).

Don't add all 12. Pick 3-5 that match the motion register from `design-direction`.

---

## Final Sign-Off

After polish passes:

1. Update memory log: `[HH:MM] DEV TASK — landing page polish — Project X — 9.2/10 — shipped`
2. Add entry to shared timeline.
3. Commit with message: `chore: design QA polish — score 9.2/10 — see specs/<project>/audit-<date>.md`
4. Tag git: `v1.0-launch`
5. If deploying: confirm env vars, build green, lighthouse green.

---

## Anti-Patterns

- Treating polish as optional — it's the difference between 7 and 9
- Adding all 12 "tiny wins" — over-doing it makes the page busy
- Skipping mobile because the desktop "looks great"
- Forgetting to test reduced-motion
- Shipping with console errors because "they're harmless"
- Not running Lighthouse on production build (dev build numbers lie)
