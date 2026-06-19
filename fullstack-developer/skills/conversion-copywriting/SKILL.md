---
name: conversion-copywriting
description: |
  Premium copywriting skill for landing pages. Covers positioning, hero copy formulas,
  section copy, CTA writing, social proof, microcopy, and trust signals. Forces
  niche-specific copy with no placeholders. Use during Phase 4 of the
  premium-landing-page workflow. Triggers on "copy", "headline", "messaging",
  "positioning", "writing".
---

# Conversion Copywriting Skill

The previous client said *"It has no relevant information."* That happens when an AI
ships landing pages with `Feature 1 / Description here` style placeholders or generic
"transform your business" filler. This skill prevents that. Every word is real,
specific, and earns its space.

---

## Hard Rules

1. **No placeholder text.** No `Lorem ipsum`, no `Feature description here`, no
   `Some text about our amazing product`. If you don't have content, ask the user.
   If they can't supply, mark `[TODO: client to supply X]` and continue.
2. **No invented numbers.** "10,000+ customers" is a lie unless verified. Mark
   `[TODO: confirm metric]` rather than fabricate.
3. **No invented testimonials.** Use the user's real testimonials or mark TODO.
4. **Customer language, not company language.** "Stop losing leads" beats
   "Industry-leading lead management platform".
5. **Reading-level: simple.** Aim for 6-8th grade reading level. Long words and
   jargon kill conversion.
6. **Specific beats clever.** "Cut deploy time from 4hrs to 4min" beats "Deploy
   blazingly fast" every time.

---

## Output

`specs/<project>/04-sections-and-copy.md` — every section's copy, exact words.

---

## Positioning First (April Dunford-style)

Before writing any headline, fill out a **positioning canvas** at the top of the
copy doc:

```markdown
## Positioning Canvas

- Category: <what bucket are we in — "developer tools", "expense management", etc.>
- For whom: <ICP — "Series A SaaS founders", "freelance designers", etc.>
- Who struggle with: <core pain — "manual deployment", "scattered receipts">
- Unlike: <main alternative — "Heroku + manual scripts", "Excel + receipts">
- We provide: <unique mechanism — "AI-powered auto-rollback", "OCR + auto-categorization">
- So that: <outcome — "ship 10x faster without breaking prod", "close the books in 1 day, not 1 week">
```

Every headline / subhead derives from this canvas. If the canvas is fuzzy, the
copy will be fuzzy.

---

## Hero Headline Formulas (Pick ONE — Don't Mix)

| Formula | Pattern | Example |
|---------|---------|---------|
| **Outcome without pain** | `[Outcome] without [Pain]` | "Ship code without breaking prod" |
| **Verb the noun** | `[Verb] your [Noun]` | "Automate your customer onboarding" |
| **Stop X. Start Y.** | `Stop [Pain]. Start [Outcome].` | "Stop chasing receipts. Start closing books." |
| **The X that Y** | `The [Category] that [Surprising benefit]` | "The CRM that schedules itself" |
| **For who, by what** | `[Outcome] for [Audience], built on [Mechanism]` | "Insights for finance teams, built on real-time data" |
| **Trust + outcome** | `[N] [Audience] trust us to [Outcome]` | "2,500+ teams trust us to ship Friday afternoon" |
| **Plain truth** | `[Plain statement of value]` | "Cron, but for AWS." |
| **Question** | `[Provocative question]?` | "What if your dashboard built itself?" |

Constraint: ≤ 8 words / ≤ 44 characters preferred. Two lines max.

---

## Subheadline Rules

- 1-2 sentences, ≤ 160 characters
- Adds the *what* (mechanism) and *for whom* if hero doesn't already
- Never repeats the headline in different words
- Specific number or proof point lands well: "Cut review cycles from 2 weeks to 2 days, with AI-powered diff summaries."

Example pairs:
- H: "Ship code without breaking prod"
- Sub: "Auto-rollback in under 60 seconds, AI-driven monitoring, zero config. The deploy platform 1,200+ teams use to sleep on Fridays."

---

## CTA Writing

### Primary CTA (verb + value)

| Niche | Strong | Weak |
|-------|--------|------|
| SaaS | "Start free trial" / "Try it free" | "Sign up" / "Get started" |
| Demo-led | "Book your demo" / "See it live" | "Contact us" |
| Self-serve | "Create my workspace" / "Get started — free" | "Submit" |
| Restaurant | "Reserve your table" / "Order now" | "Click here" |
| Clinic | "Book appointment" / "Find your doctor" | "Continue" |
| E-com | "Shop the collection" / "Get 20% off" | "Submit" |
| Agency | "Book a strategy call" / "Get a quote" | "Contact" |
| Education | "Enroll now" / "Start learning — free" | "Read more" |

Rules:
- Always start with a verb
- Tell the user exactly what happens
- ≤ 4 words preferred

### Secondary CTA (low commitment)

- "Watch 90s demo"
- "See how it works"
- "Read the docs"
- "Compare plans"
- "Take the tour"
- "Read customer stories"

NOT: "Learn more" (vague). If you must, contextualize: "Learn how it works".

---

## Section-by-Section Copy Templates

For each, fill in the brackets with niche-specific content. Never ship the bracketed
version.

### Eyebrow (above hero headline)

`[New / Now] [Product feature] · [Optional CTA]`

Examples:
- "New: AI-powered insights · Available now"
- "Series A backed by Sequoia"
- "Trusted by 2,500+ teams"

### Logo Cloud Section

Headline: `Trusted by [audience descriptor] worldwide` OR omit headline.
- Use real customer logos as SVGs
- 6-8 logos in a single row, marquee on hover
- If no real customers yet, replace with awards / featured-in publications

### Problem / Pain Section

Headline formula: `[Pain in customer's words]`
- "Your team spends 4 hours a week chasing receipts."
- "Half of your deploys roll back. Most do it at 4am."

Body (2-3 lines): describe the pain in detail using customer language.
List 2-3 specific symptoms. End with a question or thesis statement.

### Solution / Features Section

Headline: `Everything you need to [Core outcome]` OR `Built for [Audience] who [Need]`

Per feature card (3-6 features):
- **Eyebrow icon** (optional, lucide)
- **Title (3-6 words)**: outcome-focused, not feature-focused
  - GOOD: "Ship without 4am rollbacks"
  - BAD: "Auto-rollback engine"
- **Body (1-2 sentences, ≤140 chars)**: how it works + benefit
- **Optional metric**: "Cuts rollback time by 92%"

### Bento Grid (alternative to feature grid)

Use for 5-9 cells with varied importance. One large 2x2 hero cell + smaller
1x1 cells. Each cell:
- Headline (≤ 6 words)
- Body (≤ 80 chars)
- Visual / illustration / mini-UI

Cell type mix:
- Hero cell: flagship feature with rich visual
- Stat cell: one big number + label
- Quote cell: short testimonial pull-quote
- Logo cell: integration logos
- Feature cell: standard feature
- Demo cell: small interactive demo

### How It Works Section

Headline: `[Outcome] in [Number] simple steps` (3 steps standard)

Per step:
- Step number (large, decorative)
- Step title (3-5 words)
- Step description (1-2 sentences)
- Optional: small illustration / screenshot

Connect with an animated SVG path between steps for premium feel.

### Stats Section

Headline (optional): `Built for scale` / `Numbers that matter` / `By the numbers`

3-5 stats, each:
- Big number (animated counter)
- Suffix / unit (`%`, `+`, `M`, etc.)
- Label (3-5 words below the number)

Examples:
- 92% — Faster deploys
- 2,500+ — Active teams
- $4.2M — Saved by customers
- 99.99% — Uptime

NEVER make these up. Mark `[TODO: confirm]` if not verified.

### Testimonials Section

Headline: `What our [audience] are saying` / `Loved by [audience]`

Per testimonial card:
- Avatar (real photo, 64-80px)
- Quote (≤ 280 chars, lead with the outcome — "We cut deploy time by 4x using …")
- Name
- Title + company
- Optional: company logo

3-6 testimonials, can rotate in a carousel. Star rating optional.

### Pricing Section

Headline: `Simple, transparent pricing` / `Pricing that scales with you`
Toggle: monthly / yearly with animated switch (yearly typically discounted).

Per tier card:
- Tier name (3 tiers ideal: Free / Pro / Team-or-Enterprise)
- Price ($X/month) — large, bold
- "What's included:" — 4-7 bullet points
- CTA: "Start free" / "Get Pro" / "Talk to sales"
- One tier marked "Most popular" with subtle highlight

Always show pricing on landing page. Hidden pricing → trust drop.

### FAQ Section

Headline: `Frequently asked questions` / `Got questions?`

5-8 questions in accordion. Question must be in customer's voice
("Can I cancel anytime?"), answer must be direct (not "Yes, you can!" — actual
substance: "Yes — cancel anytime in your billing settings, no proration shenanigans").

Cover the **objections that block conversion**:
- Pricing / commitment
- Cancellation / refund
- Onboarding / time to value
- Integration / compatibility
- Security / data / privacy
- Support / SLA

### CTA Banner

Headline: `Ready to [outcome]?` / `Start [verb]ing today`
Subhead (optional): One trust-bolster sentence.
Primary CTA + secondary CTA.
Optional gradient background or signature visual.

### Footer

Beyond links and legal, include:
- One-line tagline
- Social links (real ones, not placeholder)
- Address / contact (if local)
- Compliance / certification badges (SOC 2, GDPR, HIPAA — only real ones)
- Newsletter signup (if user supports it)

---

## Microcopy Patterns

| Where | What |
|-------|------|
| Form button (loading) | "Creating account…" not "Loading…" |
| Form success | "Welcome aboard. Check your inbox." |
| Empty state | Describe what they're missing + how to fix |
| Error | Plain language, what to do next |
| Trust-on-form | "No credit card · Cancel anytime · 14-day trial" — under primary CTA |

---

## Social Proof Hierarchy (Strongest to Weakest)

1. **Specific outcome from a named customer** — "Acme cut churn by 32% in 60 days"
2. **Big-name logo** customer
3. **Quantified review aggregate** — "4.9/5 from 1,200 reviews on G2"
4. **Compliance / awards** — "SOC 2 Type II", "G2 Leader Spring 2026"
5. **User count** — "Trusted by 50,000+ teams"
6. **Generic praise** — DON'T USE ALONE

Sprinkle proof through the page; don't dump all of it in one section. Hero gets
1-2 strongest, then more around CTAs and pricing.

---

## Voice / Tone Calibration

Match `design-direction` adjectives. A few common voices:

### Direct / clear (dev tools)
- Short sentences, plain words
- "Sleep on Fridays. Auto-rollback in 60 seconds."

### Warm / human (consumer / SMB)
- Slightly longer, contractions, second person
- "We get it — tax season's a beast. We made it 5x easier."

### Authoritative (enterprise / fintech)
- Precise, third-person ok, less playful
- "Reduce settlement risk with multi-party reconciliation in real time."

### Playful (consumer / creator tools)
- Wit, occasional emoji, characterful
- "Ditch the spreadsheet. Your future self will high-five you."

---

## The "Place a Bet" Rule

If you're staring at three options and unsure which to pick — pick the most specific.
Specificity converts. "Save 4 hours a week" beats "Save time".

---

## Anti-Patterns

- "Welcome to [Company]"
- "We are a leading provider of..."
- "Best-in-class" / "World-class" / "Industry-leading"
- "Our innovative solution..."
- Any sentence starting with "We"
- Adjective stacks: "Powerful, beautiful, intuitive..."
- Vague metrics: "Many customers", "Tons of features", "Save lots of time"
- Headlines longer than 8 words
- Hero subheadlines longer than 160 characters
- CTA text that doesn't say what happens ("Submit", "Click here", "Go")
