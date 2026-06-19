---
name: competitor-research
description: |
  Pre-implementation research skill. Identifies, fetches, and analyzes 5+ premium
  reference sites to ground design decisions in modern patterns rather than training-
  data defaults. Use this for every landing page project, BEFORE design direction.
  Triggers on "competitor research", "find references", "what does the competition do",
  or auto-loaded by the premium-landing-page orchestrator.
---

# Competitor & Reference Research Skill

The Andy AI employee was shipping basic landing pages because it was building from
training data defaults rather than what the market currently looks like. This skill
forces a research pass before any design direction is committed.

---

## Output

`specs/<project>/02-references.md`

---

## Process

### Step 1 — Build the Reference List (3-5 minutes)

Use `web_search` to find 5+ reference sites. Mix is required:

- **3 direct competitors** (same category as the product). Search:
  `<category> SaaS landing page 2026`, `top <category> startups`, `<closest competitor> alternative`
- **2 best-in-class** regardless of category. Default rotating set:
  - Linear (https://linear.app)
  - Vercel (https://vercel.com)
  - Stripe (https://stripe.com)
  - Resend (https://resend.com)
  - Framer (https://framer.com)
  - Notion (https://notion.so)
  - Cursor (https://cursor.com)
  - Arc (https://arc.net)
  - Cal.com (https://cal.com)
  - PostHog (https://posthog.com)
  - Ramp (https://ramp.com)
  - Attio (https://attio.com)
  - Supabase (https://supabase.com)
  - Mercury (https://mercury.com)
  - Datadog (https://datadog.com)
  - Loom (https://loom.com)
  - Liveblocks (https://liveblocks.io)

  Pick best-in-class examples that align with the chosen tone (e.g., for warm/playful
  pick Cal.com or Loom; for dev/serious pick Linear or Vercel).

If the user supplied references in discovery, USE THOSE FIRST and only top up.

### Step 2 — Fetch Each Reference (2-3 minutes per site)

For each URL, run `web_fetch` and capture key markers. If a site is heavily JS-rendered
and returns thin content, just analyze what you can see — note that you couldn't fully
render it. Don't fabricate.

### Step 3 — Document Each Site (Reference Card Template)

For each of the 5+ references, write a card:

```markdown
### Reference: <Site Name> — <URL>

**Category:** <SaaS dev tool / fintech / collab / etc.>
**Mode:** Light / Dark / Dual
**Hero archetype:** <1 of 8 — see hero-section-specialist>
**Headline:** "<actual hero headline>"
**Subhead:** "<actual subheadline>"
**Primary CTA:** "<actual CTA text>"
**Secondary CTA:** "<actual or none>"

**Section order (homepage):**
1. <section>
2. <section>
3. <section>
... (10-14 typical)

**Visual system feel:**
- Palette: <e.g., near-black + violet + soft white>
- Typography: <best guess at display + body>
- Depth: <grid + radial glow / mesh / aurora / etc.>
- Iconography: <line / dual-tone / illustrated / SVG-only>

**Animation register:** subtle / confident / playful / cinematic

**Signature moments** (the things a designer screenshots):
- <e.g., scroll-pinned dashboard ticker>
- <e.g., gradient-text on key brand word>
- <e.g., bento with one cell containing live demo>

**What we steal:**
- <pattern 1>
- <pattern 2>

**What we avoid:**
- <thing that wouldn't fit our brand>
```

### Step 4 — Synthesis (3 minutes)

End the doc with a synthesis section:

```markdown
## Synthesis

### Common patterns across these references
- <pattern observed in 3+ refs>
- <pattern observed in 3+ refs>

### Where the references diverge
- <e.g., light vs dark; centered vs split hero>

### Direction recommendation for our project
Given the audience and the references, I recommend:
- Theme mode: <choice>
- Hero archetype: <choice>
- Motion register: <choice>
- Depth treatment: <choice>

This recommendation feeds Phase 3 (`design-direction`).
```

---

## Search Query Recipes

| Need | Search Query |
|------|--------------|
| Direct competitors by category | `top <category> startups 2026`, `<category> SaaS pricing page`, `best <category> alternatives` |
| Best-in-class for B2B SaaS | `Linear landing page hero`, `Vercel landing page design 2026`, `Stripe homepage` |
| Best-in-class for dev tools | `Cursor landing page`, `Resend homepage`, `PostHog homepage` |
| Premium consumer | `Mercury banking homepage`, `Arc browser landing page` |
| Agency / editorial | `<agency name> portfolio site` (for agency briefs only) |
| Specific pattern | `bento grid SaaS landing page 2026`, `aurora background hero Next.js` |

---

## Hard Rules

1. **Never claim to have visited a site you didn't fetch.** If `web_fetch` failed or
   returned nothing, say so in the card and analyze from search snippets only.
2. **Never copy headlines or copy verbatim.** Patterns and structure only.
3. **Always look at 2026-current refs**, not 2018 portfolios. If the site has
   2014-era stock photos, skip it.
4. **Use this research to inform the direction doc — don't just file it and forget.**

---

## Anti-Patterns

- Listing 5 sites in the same category — diversity beats sample size
- Looking at 1 reference and calling it research
- Picking references that look like the AI's training data default — actively pick
  things that look modern and challenge the default
- Letting the research take 60 minutes — 15-25 minutes total is enough for landing pages
