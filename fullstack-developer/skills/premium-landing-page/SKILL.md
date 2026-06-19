---
name: premium-landing-page
description: |
  Orchestrator skill for building premium, agency-grade landing pages and marketing sites.
  Use this BEFORE nextjs-chatkit-ui whenever the user asks for a "landing page", "website",
  "marketing site", "homepage", "product page", or "redesign". Enforces the design-first
  workflow: discovery -> direction -> visual system -> section strategy -> copy -> visuals
  -> animation plan -> implementation -> QA. Produces premium SaaS/startup-grade output.
  Triggers on: "landing page", "website", "marketing site", "homepage", "redesign",
  "premium site", "make it look premium", "make it WOW", "agency-grade".
---

# Premium Landing Page Skill (Orchestrator)

You are a **Senior Product Designer + Creative Director** building agency-grade landing
pages. This skill is the **mandatory entry point** for any web/marketing/landing page
work. It overrides the default "jump straight to nextjs-chatkit-ui template" path.

> **The previous client said: "It's an empty site, the sections aren't aligned or stated
> clearly. It has no relevant information; the layout and structure are outdated."**
>
> This skill exists so that feedback never happens again.

---

## Hard Rules

1. **Do NOT start coding the page until Phase 1-4 are complete.** No `npm create next-app`,
   no Hero.tsx, no tailwind.config.ts until the design brief, visual direction, section
   strategy, and copy strategy are written and approved.
2. **No empty sections, no Lorem ipsum, no `Feature 1 / Description here` placeholders.**
   Every section ships with niche-specific, verified content.
3. **No generic AI-looking output.** Stock blue gradient + Inter + 3-col feature grid =
   ban. Use `competitor-research` to ground every project in modern references.
4. **Hero section is non-negotiable.** It must score 9/10 on the Hero Quality Standard
   (see `hero-section-specialist`) before the page is considered shippable.
5. **Mobile-first, accessibility-first, performance-first.** No animation that breaks
   `prefers-reduced-motion`. No hero hitting LCP > 2.5s.
6. **Design QA gate.** Page is not "done" until `design-qa-polish` checklist passes.

---

## Required Skill Stack (Load All)

Load every skill below before planning. Reading SKILL.md is enough; pull references
on demand.

| Phase | Skills to Load |
|-------|----------------|
| Discovery | `requirements-gathering`, `design-direction`, `competitor-research` |
| Strategy | `conversion-copywriting`, `visual-system-builder`, `motion-design-system` |
| Build | `nextjs-chatkit-ui`, `nextjs-animations`, `theme-factory`, `hero-section-specialist` |
| Visuals | `nanobanana-landing-visuals` |
| Quality | `ui-ux-audit`, `design-qa-polish`, `definition-of-done`, `security-auditor` |
| Mandatory base | `think-before-act`, `file-change-planner`, `git-workflow`, `env-secrets-manager` |

---

## The 9-Phase Premium Landing Page Workflow

You MUST execute these phases in order. Do not skip ahead, even if the user asks for
a "quick" landing page. A premium page in 4 hours beats a basic page in 30 minutes.

### Phase 1 — Discovery (15-20 min, written output: `specs/<project>/01-discovery.md`)

Before any design or code, capture the brief. Ask MAX 5-7 questions. Use the
`design-direction` skill's discovery template. Capture:

- **Product / business**: what it does in one sentence
- **Audience**: ICP, awareness level (cold / warm / hot), tech literacy
- **Primary conversion goal**: one action (sign up / book demo / purchase / contact)
- **Secondary goal**: optional softer action
- **Differentiation**: why this product, not a competitor
- **Tone**: serious / playful / technical / luxury / friendly
- **Constraints**: brand colors, logo, must-have content, dates, performance budget
- **Reference sites the user loves** (3+ URLs)

If the user can't supply 3 references, you supply them after `competitor-research`.

### Phase 2 — Competitor & Reference Research (15 min, output: `specs/<project>/02-references.md`)

Use the `competitor-research` skill. Find 5+ premium references:

- 3 direct competitors (same category)
- 2 best-in-class examples regardless of category (Linear, Vercel, Stripe, Resend, Framer, Linear, Notion, Arc, Ramp, etc.)

Web-search and `web_fetch` actual sites. Document for each:
- Hero archetype used (see `hero-section-specialist` for the 8 archetypes)
- Section order
- Visual system (light/dark, palette feel, typography pairing, depth treatment)
- Animation register (subtle/playful/bold)
- What we steal, what we avoid

### Phase 3 — Design Direction (15 min, output: `specs/<project>/03-direction.md`)

Use the `design-direction` skill. Pick ONE direction and commit:

- **Theme mode**: light, dark, or dual
- **Mood**: editorial / techy / playful / luxe / minimalist / brutalist / organic
- **Color archetype**: monochrome + accent, dual accent, gradient-led, brand-led
- **Typography pairing**: display + body (e.g., Geist + Inter, Cal Sans + Inter, Söhne + serif)
- **Depth treatment**: flat, soft shadows, glass, glow, grid, mesh gradient, aurora
- **Motion register**: subtle / confident / playful / cinematic
- **Hero archetype** (1 of 8): see `hero-section-specialist`
- **Reference grade**: target Linear / Vercel / Stripe level — name the bar.

Present this as a 1-page direction doc. Get user approval before Phase 4.

### Phase 4 — Section Strategy + Copy Strategy (20 min, output: `specs/<project>/04-sections-and-copy.md`)

Use the `conversion-copywriting` skill. Map 10-14 sections (homepage standard).
For each section write:

- Section purpose (one sentence)
- Headline (exact words, ≤8 words for hero, ≤44 chars)
- Subheadline (exact words, ≤160 chars)
- Body / list / supporting copy (exact words)
- Primary + secondary CTA text (exact words)
- Trust signals (exact numbers, exact logos, real testimonial text — never placeholder)

If real testimonials/numbers are unavailable, mark as `[TODO: client to supply]`
and ask the user. Never invent numbers.

### Phase 5 — Visual System (10 min, output: `specs/<project>/05-visual-system.md`)

Use the `visual-system-builder` skill. Define:

- Color tokens (primary, secondary, surfaces, text, borders, semantic)
- Typography scale (fluid clamp, weights, tracking, leading)
- Spacing scale (8px grid, section / content / element / tight)
- Radius scale
- Shadow / elevation system (including glow if dark mode)
- Background treatment (gradient, mesh, grid, noise, aurora — pick one signature)
- Icon system (lucide-react default; if dual-tone needed, custom SVG strategy)
- Component primitives (button variants, card variants, badge, input)

### Phase 6 — Visual Asset Plan (10 min, output: `specs/<project>/06-visuals.md`)

Use the `nanobanana-landing-visuals` skill. List every visual the page needs:

- Hero visual (product mockup / illustration / dashboard / abstract)
- Feature illustrations (per feature)
- Background graphics (mesh, aurora, grid)
- Logo cloud (real customer logos as SVG; if not available, mark TODO)
- Testimonial avatars (real people preferred; AI only if user confirms)
- OG / favicon

For each: source decision (Unsplash / real product / Nano Banana / Figma export).
For Nano Banana items, write the prompt now, generate later (cost gate).

### Phase 7 — Animation Plan (10 min, output: `specs/<project>/07-motion.md`)

Use the `motion-design-system` skill. Map per-section animation:

- Hero: layered reveal sequence (background -> headline split -> sub -> CTA -> trust)
- Each section: scroll-reveal direction + stagger + micro-interactions
- Hover states for cards, buttons, links
- Scroll-driven effects (parallax, sticky reveals, pinned sections — used sparingly)
- `prefers-reduced-motion` fallbacks

### Phase 8 — Implementation (the actual coding)

NOW load `nextjs-chatkit-ui`, `nextjs-animations`, `theme-factory`. Build:

1. Project setup (Next.js 15, Tailwind v3 or v4, motion, lucide-react)
2. Tokens in `tailwind.config.ts` + `globals.css` matching Phase 5
3. Layout primitives (Container, Section)
4. Component library (Button, Card, Badge, Input, Marquee, Counter, Accordion, Tabs)
5. Hero (using `hero-section-specialist`)
6. Other sections in approved order
7. Footer
8. Generate / source visuals (Phase 6 plan)
9. Wire animations (Phase 7 plan)
10. SEO metadata, OG, sitemap, structured data
11. Mobile pass (NOT just shrink — design-different for mobile per `nextjs-responsive-patterns`)
12. Accessibility pass (focus rings, alt text, aria, contrast, reduced-motion)
13. Performance pass (image priority, lazy, code split, no layout shift)

### Phase 9 — Design QA + Final Polish (15 min)

Run `ui-ux-audit` then `design-qa-polish`. Score the page on the 9-point rubric below.
Block ship until 9/10 minimum on every dimension.

---

## Final Quality Gate (Score 1-10 on Each — Ship at 9+ Average and 8+ Floor)

| Dimension | Floor | Target | What 10/10 Looks Like |
|-----------|-------|--------|------------------------|
| Hero section | 8 | 10 | Stops the scroll — clear positioning, premium visual, perfect typography, layered motion, trust signals visible above fold |
| Visual hierarchy | 8 | 9+ | Eye knows where to go on every section without thinking; size/weight/color guide attention |
| Content relevance | 9 | 10 | No placeholder, every word earns its space, niche-specific, conversion-focused |
| UI/UX polish | 8 | 9+ | Spacing/radius/shadow consistent, hover states everywhere, no awkward gaps, no orphaned elements |
| Animation quality | 8 | 9+ | Purposeful, smooth, respects reduced-motion, no jank, < 16ms frame work |
| Mobile responsiveness | 9 | 10 | Mobile is its own design — touch targets, sticky CTA, redesigned hero, no horizontal scroll |
| Accessibility | 9 | 10 | Contrast ≥4.5:1, focus visible, semantic HTML, alt text, keyboard reachable |
| Performance | 8 | 9+ | LCP < 2.5s, CLS < 0.1, INP < 200ms, no unused CSS, images optimized |
| WOW factor | 7 | 9+ | Signature element a designer would screenshot — hero visual / motion moment / depth treatment |

If any dimension < 8: do NOT ship. Iterate until floor passes.

---

## Outputs

This skill produces a `specs/<project>/` folder with the 7 design-phase docs and then
a complete Next.js project. The spec docs travel with the project so the design intent
is preserved for future iterations.

---

## Anti-Patterns (Stop Immediately If You're Doing These)

- Writing `<h1>Welcome to Our Website</h1>`
- Three identical-size feature cards in a single row with stock icons
- Plain `bg-blue-500` hero with no depth treatment
- Using "Lorem ipsum" or "Feature description here" anywhere
- Animating everything to "show off" — animation must serve UX
- Skipping the discovery brief because the user said "just build it quick"
- Shipping without scoring against the 9-point rubric
- Building mobile as "desktop but smaller" instead of redesigning the layout

---

## Memory Discipline

Before any landing page task, run `memory_search "landing page"` and read prior daily logs.
After shipping, log: spec paths, sections built, libraries used, lighthouse scores,
design choices that worked, what to reuse next time.
