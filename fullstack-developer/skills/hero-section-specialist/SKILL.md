---
name: hero-section-specialist
description: |
  Specialist skill for premium hero sections. Defines 8 hero archetypes, anatomy,
  layered motion sequence, content rules, and a 12-point quality checklist. Use
  whenever a hero section is being designed or reviewed. Triggers on "hero",
  "hero section", "above the fold", "first impression", "header section".
---

# Hero Section Specialist

The hero is 60% of the page's perceived quality. If the hero is weak, no amount of
polish below the fold rescues it. This skill defines the patterns, the anatomy, and
the bar.

---

## Hard Rules

1. Hero ships with at least: **eyebrow tag, headline, subheadline, primary CTA,
   secondary CTA, trust strip, hero visual, depth treatment, layered entry motion.**
2. Headline ≤ 8 words / ≤ 44 characters whenever possible. Two lines max.
3. Subheadline ≤ 160 characters. Adds detail; never repeats the headline.
4. Primary CTA = verb-led, specific, value-promising ("Start free trial", "Book your
   demo", "Get the report"). NEVER "Submit", "Click here", "Learn more" as primary.
5. Secondary CTA exists. It's lower-commitment ("Watch 90s demo", "See how it works").
6. Trust strip is real or marked TODO — never invented numbers.
7. Hero LCP element (image / mockup) uses `priority` and proper `sizes`. LCP < 2.5s.
8. Mobile hero is its own design, not a shrunk desktop hero.
9. Motion respects `prefers-reduced-motion`.

---

## The 8 Hero Archetypes (Pick One in Phase 3 of premium-landing-page)

Choose deliberately. Match archetype to product, audience, and competitor research.

### 1. **Centered Statement** (Linear, Vercel, Resend)
Single column, centered text, large fluid headline, dual CTA, product visual below.
Best for: dev tools, productivity SaaS, dark themes.
Depth: subtle grid + radial glow + gradient text on accent words.

### 2. **Split Hero** (Stripe, Datadog, Notion)
Left = copy/CTAs. Right = product mockup / dashboard screenshot.
Best for: B2B SaaS, products where the UI sells itself.
Depth: gradient background, soft shadow on the mockup, optional floating UI cards.

### 3. **Product-First** (Cursor, Raycast, Arc)
Headline brief, the product (or animated demo) IS the hero visual. Massive screenshot
or video, often with bezel.
Best for: products with a strong visual interface.
Depth: large soft shadow, optional ambient glow, tilted mockup.

### 4. **Animated Dashboard / Live Data** (Vercel Analytics, PostHog, Plausible)
Hero contains real (or demo) data UI moving subtly — a chart drawing in, numbers
ticking, log lines streaming.
Best for: analytics, observability, monitoring.
Motion: subtle continuous, not distracting.

### 5. **Bento Hero** (Apple-style, Payhawk, some new SaaS)
Hero is a 3-5 cell bento grid showcasing multiple value props at once.
Best for: platforms with multiple products / wide value claim.
Risk: can feel busy — only use if the bento cells each tell a clear story.

### 6. **Interactive Demo Hero** (Tldraw, Linear's keyboard demo, Cron)
Hero contains a working mini-version of the product — a typing input, a draggable
card, a keyboard shortcut.
Best for: products where the magic is interaction-based.
Implementation: lightweight, not the full product — just enough to feel the value.

### 7. **Editorial / Storytelling** (luxury brands, agency sites, Awwwards-style)
Asymmetric typography, large serif headline, scroll-driven entry, often with
parallax or scroll-locked motion.
Best for: agencies, portfolios, luxury, fashion, opinionated B2C.
Risk: can hurt clarity for B2B SaaS — only use if the brand explicitly leans editorial.

### 8. **Video / Cinematic Background** (some consumer brands, education)
Looping muted video covers hero, content sits over a dark overlay.
Best for: experiential products, travel, education, consumer.
Performance: video must be < 2MB, autoplay+muted+playsinline+loop, with poster image.

---

## Hero Anatomy (Universal — All Archetypes Need These Layers)

```
┌──────────────────────────────────────────────────┐
│  Layer 0: Background depth (gradient/grid/aurora)│
│ ┌────────────────────────────────────────────┐   │
│ │  Layer 1: Eyebrow tag (badge)              │   │
│ │  "New" + product line / category          │   │
│ │                                            │   │
│ │  Layer 2: Headline (display, fluid clamp)  │   │
│ │  Bold, 1-2 lines, optional gradient on key │   │
│ │  word                                      │   │
│ │                                            │   │
│ │  Layer 3: Subheadline                      │   │
│ │  1-2 lines, benefit-rich                   │   │
│ │                                            │   │
│ │  Layer 4: CTA group                        │   │
│ │  [Primary CTA]  [Secondary CTA →]         │   │
│ │                                            │   │
│ │  Layer 5: Trust strip                      │   │
│ │  ★ 4.9/5 · 2,500+ teams · SOC 2           │   │
│ └────────────────────────────────────────────┘   │
│                                                  │
│  Layer 6: Hero visual (mockup / illustration /   │
│  dashboard / interactive demo)                   │
│                                                  │
│  Layer 7: Logo cloud (optional, can be its own  │
│  section right below)                            │
└──────────────────────────────────────────────────┘
```

---

## Layered Motion Sequence (Mount Animation)

Total runtime ~ 1.4s. All durations and delays in seconds.

```
0.00s — Background depth: fades in (opacity 0→1, 0.6s)
0.10s — Eyebrow tag: scale 0.9→1, opacity 0→1, 0.4s
0.25s — Headline: word-by-word stagger (TextReveal split=words),
         each word 0.4s, 0.05s stagger
0.55s — Subheadline: y +20 → 0, opacity 0→1, 0.4s
0.75s — CTA group: y +20 → 0, opacity 0→1, 0.4s
0.95s — Trust strip: y +12 → 0, opacity 0→1, 0.35s
1.10s — Hero visual: scale 0.96→1, opacity 0→1, 0.6s,
         soft easing (cubic-bezier(0.16, 1, 0.3, 1))
```

For `prefers-reduced-motion: reduce`: skip transforms and stagger; just fade
in container at 0.2s.

---

## Background Depth Treatments (Pick One Signature, Don't Stack 3)

| Treatment | Vibe | Performance | When to Use |
|-----------|------|-------------|-------------|
| Mesh gradient (animated) | Dreamy, modern | Cheap (CSS gradient) | Most SaaS heroes |
| Aurora (animated) | Magical, premium dark | Cheap if CSS-only | Dark dev tools, premium |
| Subtle grid + radial glow | Techy, focused | Cheapest | Linear/Vercel-style |
| Dot pattern + spotlight | Editorial, focused | Cheapest | Minimalist, clean |
| Beams (animated lines) | Energetic | Medium (canvas/SVG) | Bold, action-oriented |
| Noise + gradient | Tactile, premium | Cheap (PNG noise) | Editorial, organic brands |
| Static photo + overlay | Cinematic | Medium (image weight) | Restaurants, hospitality, real-world |
| Video loop | Experiential | Heavy — needs care | Consumer, education only |

**NEVER** stack mesh + aurora + beams + grid. ONE depth treatment, ONE accent. The
content is the star — the background supports.

---

## Reference Code: Premium Centered Hero (Archetype 1, Dark)

```tsx
'use client'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Layer 0: depth — radial glow + grid */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(120,119,198,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Layer 1: eyebrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          {/* TODO: replace with real eyebrow */}
          New: AI-powered insights
        </motion.div>

        {/* Layer 2: headline (replace TextReveal stagger here) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 text-balance bg-gradient-to-b from-white to-white/70 bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-7xl"
        >
          {/* TODO: ≤8 words */}
          Ship faster. Sleep better.
        </motion.h1>

        {/* Layer 3: subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-white/60 sm:text-xl"
        >
          {/* TODO: ≤160 chars, benefit-led */}
          The deployment platform that catches issues before your customers do — with
          AI-driven monitoring and auto-rollback in under 60 seconds.
        </motion.p>

        {/* Layer 4: CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="/signup"
            className="group inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 font-medium text-neutral-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_-8px_rgba(120,119,198,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_12px_32px_-8px_rgba(120,119,198,0.7)]"
          >
            Start free trial
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="/demo"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 font-medium text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            Watch 90s demo
          </a>
        </motion.div>

        {/* Layer 5: trust */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.95 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50"
        >
          {/* TODO: real numbers / replace */}
          <span>★ 4.9/5 from 1,200+ teams</span>
          <span className="hidden sm:inline">·</span>
          <span>SOC 2 Type II</span>
          <span className="hidden sm:inline">·</span>
          <span>Free 14-day trial · No card</span>
        </motion.div>

        {/* Layer 6: visual — replace with real mockup; use next/image with priority */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.10, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="relative rounded-xl border border-white/10 bg-white/5 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_64px_-16px_rgba(120,119,198,0.5)] backdrop-blur">
            {/* TODO: real product screenshot at 2x */}
            <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-950" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 12-Point Hero Quality Checklist (Score before shipping — must hit 12/12)

- [ ] Eyebrow tag present (or deliberately omitted with reason)
- [ ] Headline ≤ 8 words, scannable in < 1 second
- [ ] Subheadline adds detail, doesn't repeat headline
- [ ] Primary CTA is verb-led, specific, high-contrast
- [ ] Secondary CTA exists, lower commitment
- [ ] Trust strip with REAL numbers (or marked TODO)
- [ ] Background depth treatment (one signature, not stacked)
- [ ] Hero visual present (mockup / dashboard / illustration / demo)
- [ ] Layered motion sequence (5+ stagger points, total ≤ 1.5s)
- [ ] `prefers-reduced-motion` fallback in place
- [ ] Mobile redesigned (not shrunk): stacked, full-width CTAs, sticky CTA above 100vh
- [ ] LCP element marked `priority`, contrast ≥ 4.5:1, focus rings visible

---

## Anti-Patterns

- "Welcome to [Company]" — wastes the most valuable real estate on the page
- Three CTAs side by side — kills hierarchy
- Stock photo of a smiling team in a glass office
- Hero video on autoplay with sound
- Animation that runs forever and competes with reading
- Headline in 14px on mobile because of "responsive scaling"
- A horizontal scroll on mobile because the hero visual is 1600px wide

---

## Mobile Hero Rules

- Headline: drop to clamp(2rem, 8vw, 3rem). Stay 2 lines max.
- CTAs: full-width, stacked, primary first.
- Trust strip: stack vertically or hide non-critical items.
- Visual: shrink to 4:3 or hide entirely if it doesn't read at < 400px wide.
- Add a sticky bottom CTA bar that appears after scrolling past the hero.
