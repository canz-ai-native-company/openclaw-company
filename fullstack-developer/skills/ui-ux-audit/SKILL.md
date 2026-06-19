---
name: ui-ux-audit
description: |
  Critical design review skill. Audits a built or in-progress landing page against
  premium standards — visual hierarchy, content relevance, polish, accessibility,
  performance, mobile, animation. Run before shipping or when the user reports
  the page "feels off". Triggers on "audit the design", "review the page",
  "is this premium", "design review", "what's wrong with this page".
---

# UI/UX Audit Skill

This skill is the **internal critique** before the page goes to the user. The Andy
agent runs this on its own work to catch the things that read as "AI-built" or
"basic" — before the human sees it.

> **The previous client said: "It's an empty site, the sections aren't aligned or
> stated clearly. It has no relevant information; the layout and structure are
> outdated."** — every bullet in this audit exists because feedback like that
> existed.

---

## When to Run

- After implementation, before "done" handoff (mandatory)
- When the user says "doesn't feel premium" / "feels generic" / "something's off"
- During reviews of someone else's frontend code
- Before a public launch or screenshot for portfolio

---

## Audit Output

Save as `specs/<project>/audit-<date>.md`. Use this structure:

```markdown
# UI/UX Audit — <Project> — <Date>

## Score
| Dimension | Score (1-10) | Notes |
|-----------|--------------|-------|
| Hero | __ | |
| Visual hierarchy | __ | |
| Content relevance | __ | |
| UI/UX polish | __ | |
| Animation | __ | |
| Mobile | __ | |
| Accessibility | __ | |
| Performance | __ | |
| WOW factor | __ | |
| **Average** | __ | |

## Critical Issues (must fix before ship)
1. [issue] — at [section/file] — [recommended fix]
2. ...

## Important Issues (should fix)
1. ...

## Polish Suggestions (nice to have)
1. ...

## What's Working
- ...
```

---

## The 9-Dimension Audit

For each: review with intent. Don't rubber-stamp 9/10s.

### 1. Hero (most important — 60% of perceived quality)

Run the 12-point checklist from `hero-section-specialist`:

- [ ] Eyebrow tag present (or omitted with reason)
- [ ] Headline ≤ 8 words
- [ ] Subhead ≤ 160 chars and adds info
- [ ] Primary CTA verb-led, specific
- [ ] Secondary CTA exists, lower commitment
- [ ] Trust strip with real numbers
- [ ] Background depth treatment (one signature)
- [ ] Hero visual present
- [ ] Layered motion sequence
- [ ] Reduced-motion fallback
- [ ] Mobile redesigned, not shrunk
- [ ] LCP element marked priority

Also check:
- Is the headline scannable in < 1 second?
- Does the hero clearly say WHAT this is and WHO it's for?
- Would I trust this brand from the hero alone?

If < 9/10: STOP. Fix hero before any other review.

### 2. Visual Hierarchy

For every section, ask: where does my eye go FIRST? Should it go there?

Markers of failure:
- 3 things on the page demanding equal attention (3 same-size CTAs, etc.)
- Section headers same size as body text
- All cards same visual weight when one is meant to be primary
- Buttons, links, badges all using the same color
- No visual rest — every pixel competes

Markers of success:
- Clear primary action per section
- Size/weight/color guides eye through the page
- Whitespace works for the page, not against it (alternating section backgrounds)

### 3. Content Relevance

Word-by-word read:
- Any `Feature 1`, `Lorem ipsum`, `Description here`?
- Any `[bracket placeholder]` left in?
- Generic phrases: "world-class", "best-in-class", "industry-leading"?
- Made-up numbers? (Cross-check with discovery doc — was 10,000+ verified?)
- Missing testimonials marked TODO but not actually filled?
- "We are..." sentences that should be customer-focused?

If the page reads like a startup template — flag every violation.

### 4. UI/UX Polish

The "death by a thousand small misalignments" check:

- [ ] Are all radii consistent? (cards: lg, buttons: md, hero: 2xl)
- [ ] Are shadows consistent? Not 5 different shadow treatments
- [ ] Spacing consistent? Sections all `py-section` / `py-section-lg`
- [ ] No ad-hoc `mt-[37px]` magic numbers — using the spacing scale
- [ ] All buttons have the same hover behavior (within the same variant)
- [ ] All links have a hover state
- [ ] All interactive elements have a focus state
- [ ] Form inputs have focus rings
- [ ] No orphan elements (lone heading, lone CTA without context)
- [ ] No awkward wrapping at common breakpoints (test at 375, 768, 1024, 1280, 1536)
- [ ] Icons all from one set, all same stroke weight

### 5. Animation Quality

Run `motion-design-system` checklist:

- [ ] Hero has layered reveal sequence
- [ ] Section reveals on scroll (not all at once on load)
- [ ] All hover states have transitions (150-250ms)
- [ ] No animation plays forever in viewport (≤ 2 continuous)
- [ ] Reduced-motion respects user preference (test in DevTools)
- [ ] No jank — animate transform/opacity, not layout properties
- [ ] No animation runs before LCP element finishes
- [ ] `whileInView` uses `once: true` so things don't re-animate

Common failures:
- Heading word stagger taking 3+ seconds
- Section reveals happening AFTER the user has already scrolled past
- Hover scale of 1.1+ (looks janky vs 1.02-1.04)

### 6. Mobile Responsiveness

Open DevTools, test at 375×812 (iPhone) and 390×844:

- [ ] Hero is redesigned, not just shrunk
- [ ] Headline still readable (clamp doing its job)
- [ ] Primary CTA is full-width (or at least 200px+ touch target)
- [ ] Secondary CTA stacks below primary
- [ ] Trust strip readable (no horizontal scroll)
- [ ] Feature grid stacks to 1 column
- [ ] Bento grid (if used) reorders by importance, not desktop position
- [ ] Tap targets ≥ 44×44 pixels
- [ ] No horizontal page scroll
- [ ] Sticky bottom CTA on long pages (post-hero)
- [ ] Mobile nav drawer works (not just a CSS hide/show)
- [ ] Forms usable with mobile keyboard (proper input types: tel, email, url)

### 7. Accessibility

- [ ] Body text contrast ≥ 4.5:1 (WCAG AA)
- [ ] Large text contrast ≥ 3:1
- [ ] All images have meaningful alt text (decorative = `alt=""`)
- [ ] Headings in semantic order (h1 → h2 → h3, no skips)
- [ ] One h1 per page
- [ ] Buttons are `<button>`, links are `<a>` — no `<div onClick>`
- [ ] Interactive elements keyboard-reachable
- [ ] Focus rings visible (don't `outline: none` without replacement)
- [ ] Form inputs have associated `<label>`
- [ ] Color is never the only signal (e.g., red for error must also have icon/text)
- [ ] `prefers-reduced-motion` respected
- [ ] Lang attribute on `<html>`

### 8. Performance

Run Lighthouse on production build:

- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] Total page weight < 1MB (excluding hero video if any)
- [ ] Hero image WebP/AVIF, properly sized via `sizes`
- [ ] Below-fold images lazy-loaded (default in next/image)
- [ ] Fonts use `display: swap`, subsetted
- [ ] No unused CSS shipped (Tailwind purge working)
- [ ] No client component when a server component would do
- [ ] Animation libraries tree-shaken (LazyMotion if motion is heavy)

### 9. WOW Factor

The hardest to measure, the most important. Ask:

- Is there ONE moment that would make a designer screenshot this?
- Could a stranger tell this from a generic template in < 5 seconds?
- Does the hero create a small "oh, this is nice" reaction?
- Is there a signature element (depth treatment / motion / typography) that
  threads through the whole page?

If the page is technically perfect but boring — score this 5-6 and recommend
ONE wow moment to add (e.g., a magnetic primary CTA, an animated hero gradient,
a custom illustration, a scroll-pinned dashboard reveal).

---

## Scoring Calibration

| Score | Meaning |
|-------|---------|
| 10 | Best-in-class, screenshot-worthy, would win a Site of the Day |
| 9 | Premium / agency-grade, ships proudly |
| 8 | Solid professional, ships fine |
| 7 | "OK" — looks fine but not premium |
| 6 | "Generic" — looks like an AI default |
| 5 or below | Broken, basic, or visibly amateur |

A landing page must score **9+ on hero, 9+ on mobile, 9+ on accessibility**, and
**average 9+** to ship. Anything else: iterate.

---

## Common Failure Patterns (and Fixes)

### "Site feels empty"
- Hero subheadline too short
- Sections lack body copy under headings
- Whitespace ratio too high — aim 60% content, 40% whitespace, not 80/20
- Missing trust strip / social proof

Fix: `conversion-copywriting` audit, add real content per section.

### "Sections aren't aligned"
- Different max-widths across sections
- Different left/right padding
- Mixed text alignment (some center, some left, no rhythm)

Fix: Container component with consistent max-width. Pick a single text-alignment
strategy per section (centered hero + left-aligned features is fine; mixed within
one section is not).

### "Layout looks outdated"
- 3-column equal grid for everything
- Sidebar layouts on a marketing page
- Heavy borders everywhere
- Centered narrow column on a wide screen
- No depth — everything flat with hard edges

Fix: Bento grid for at least one section. Modern depth treatment in hero.
Generous max-width (`max-w-7xl` minimum). Soften with radii and gentle shadows.

### "Looks like AI made it"
- Default Inter on everything, default blue (Tailwind blue-500), default rounded-md
- Generic gradient (purple → pink)
- Stock photos of teams in glass offices
- Three feature cards with three lucide icons
- Lorem-style filler

Fix: Pick a distinctive type pairing in `visual-system-builder`. Replace any stock
photo with real product / illustration. Re-write copy. Use the Linear/Vercel feel.

---

## Anti-Patterns

- Rubber-stamping all 9s without actually checking
- Auditing your own work without checking the rubric — confirmation bias
- Auditing then not creating tasks for the issues found
- Skipping mobile because "it's responsive Tailwind, will be fine"
