---
name: design-direction
description: |
  Creative direction and discovery skill. Run BEFORE any landing page implementation
  to capture brief, define visual mood, and commit to one design direction. Produces
  a 1-page design brief and 1-page direction doc that all later work follows.
  Triggers on "design direction", "creative brief", "design discovery", "moodboard",
  or auto-loaded by the premium-landing-page orchestrator.
---

# Design Direction Skill

You are an Art Director taking a discovery brief, then committing the team to ONE
visual direction. Without this skill, AI-built landing pages default to generic
aesthetics — same blue, same Inter, same 3-column grid. This skill prevents that.

---

## Two Outputs

1. **Discovery Brief** → `specs/<project>/01-discovery.md`
2. **Direction Doc** → `specs/<project>/03-direction.md`

(Phase 02 lives in `competitor-research`.)

---

## Output 1: Discovery Brief Template

Ask MAX 5-7 questions. Don't ask everything — infer what you can. Save as
`01-discovery.md`:

```markdown
# Design Discovery — <Project Name>

## Product
- One-sentence description: [what it is + who it's for + the core outcome]
- Category: [SaaS / agency / e-commerce / clinic / restaurant / portfolio / education / fintech / etc.]
- Stage: [pre-launch / early / growth / mature]

## Audience
- Primary ICP: [job title + company size + industry]
- Awareness level: [unaware / problem-aware / solution-aware / product-aware / most-aware]
- Tech literacy: [low / medium / high]
- Decision style: [self-serve / committee / sales-led]

## Goal
- Primary conversion: [one action — sign up / book demo / contact / purchase]
- Secondary action: [optional softer ask]
- Success metric (if known): [conversion rate / signups / demos / etc.]

## Differentiation
- Unique angle: [what we say that competitors don't]
- Proof points: [specific numbers, awards, customer names — must be real]

## Tone & Brand
- Adjectives (3-5): [serious / playful / luxurious / techy / friendly / bold / minimalist]
- Existing brand assets: [logo, colors, fonts, links]
- Don't-do list: [things they reject — e.g., "no stock photos", "no purple", "no dark mode"]

## Constraints
- Performance budget: [LCP target, page weight]
- Accessibility: [WCAG level needed — usually AA]
- Browsers: [usually evergreen + mobile Safari]
- Languages / RTL: [if needed]
- Date / launch deadline:

## References (mandatory — 3 minimum)
1. [URL] — what they like about it
2. [URL] — what they like about it
3. [URL] — what they like about it

## Open Questions
- [Anything unclear that needs follow-up]
```

If user can't supply 3 references, skip to `competitor-research` to find references
yourself, then come back.

---

## Output 2: Direction Doc Template

After research (Phase 2), commit to ONE direction. Save as `03-direction.md`:

```markdown
# Design Direction — <Project Name>

## One-Line Pitch
"<Project> looks like <reference>'s clarity meets <reference>'s warmth, with a
<adjective> motion register."

## Visual Mood
Mood board adjectives (3-5): [editorial · techy · warm · architectural · soft · etc.]

## Theme Mode
- [ ] Light only
- [ ] Dark only  
- [ ] Light primary with dark accents
- [ ] Dual (theme toggle)

Decision: <picked one + why>

## Color Archetype
- [ ] Monochrome + 1 accent
- [ ] Dual accent (primary + complementary)
- [ ] Gradient-led (signature gradient is the brand)
- [ ] Brand-led (use existing brand palette as-is)
- [ ] Editorial (high-contrast neutrals + 1 vivid pop)

Decision + tokens (final tokens go in `05-visual-system.md`):
- Surface base: `#______`
- Surface raised: `#______`
- Text primary: `#______`
- Text secondary: `#______`
- Accent primary: `#______`
- Accent secondary: `#______`

## Typography Pairing
Pick ONE pairing. Avoid Inter+Inter unless deliberate.

| Display | Body | Vibe |
|---------|------|------|
| Geist | Geist | Modern, dev-tool clean (Vercel, Linear) |
| Cal Sans | Inter | Friendly, modern SaaS (Cal.com, Resend) |
| Inter Tight | Inter | Crisp, all-purpose |
| Söhne (paid) | Inter | Premium editorial |
| Instrument Serif | Inter | Editorial, luxury |
| Fraunces | Inter | Warm, distinctive serif |
| Satoshi | Satoshi | Modern, distinctive |
| GT Walsheim (paid) | Inter | Friendly, premium |
| Geist Mono (accents) | + | Code, numbers, eyebrows |

Decision: Display = ____ , Body = ____ , Mono accent = ____

## Depth Treatment (pick ONE signature)
- [ ] Mesh gradient (animated, soft)
- [ ] Aurora (CSS keyframes, dark)
- [ ] Subtle grid + radial glow
- [ ] Dot pattern + spotlight
- [ ] Animated beams
- [ ] Noise + gradient
- [ ] Photo + overlay (real-world brands)
- [ ] Video loop (consumer/cinematic only)

Decision: <picked one + why>

## Motion Register
- [ ] Subtle (Stripe, Linear) — fades, micro-interactions, no theatrics
- [ ] Confident (Vercel, Resend) — clear staggers, scroll reveals, gradient text
- [ ] Playful (Cal.com, Loom) — springy, characterful, micro-delights
- [ ] Cinematic (Apple, agencies) — pinned scrolls, parallax, video-grade reveals

Decision: <picked one>

## Hero Archetype (from hero-section-specialist)
- [ ] 1. Centered statement
- [ ] 2. Split hero
- [ ] 3. Product-first
- [ ] 4. Animated dashboard / live data
- [ ] 5. Bento hero
- [ ] 6. Interactive demo
- [ ] 7. Editorial / storytelling
- [ ] 8. Video / cinematic background

Decision: <picked one + reasoning vs the audience and product>

## Reference Bar
"This page should feel as polished as <specific URL>. If we can't hit that bar,
we revise rather than ship."

## Don't-Do List
- [Things explicitly off-table — e.g., "no glassmorphism", "no purple",
  "no stock photos of fake teams", "no walls of feature checkmarks"]
```

---

## Discovery Question Bank (Use 5-7 Max)

Order them by what's missing. Don't repeat what the user already gave you.

| # | Question | Why |
|---|----------|-----|
| 1 | "In one sentence, what does the product do and who is it for?" | Crystallize positioning |
| 2 | "What action do you want a visitor to take in their first visit?" | Conversion goal |
| 3 | "Who's the buyer — job title, company, technical level?" | ICP |
| 4 | "What's the one thing you do better than the alternatives?" | Differentiation |
| 5 | "Show me 2-3 sites you love — the look and feel you want to match." | Reference |
| 6 | "Three adjectives that describe the brand voice?" | Tone |
| 7 | "Anything we must NOT do? (colors, styles, claims)" | Don't-do list |

For products with brand assets:
| 8 | "Existing brand colors, fonts, logo files?" | Brand-led direction |

For repeat clients / existing site:
| 9 | "What's working / not working on the current site?" | Audit baseline |

---

## Anti-Patterns

- Asking 15 discovery questions and exhausting the user
- Picking 3 depth treatments because each looks cool — pick ONE signature
- Defaulting to dark + violet + Inter because that's what came up last time
- Skipping references "because we know what good looks like" — you don't, look anyway
- Writing the direction doc without committing to a hero archetype

---

## When the User Says "Just Build It Quick"

Hold the line. Spend 15 minutes on Phase 1-3. A direction doc is < 1 page. The
alternative is a generic page that gets rejected and rebuilt. Faster to do this once.

If truly time-pressured: do an abbreviated 5-question discovery + a direction
doc in under 20 minutes. But never zero.
