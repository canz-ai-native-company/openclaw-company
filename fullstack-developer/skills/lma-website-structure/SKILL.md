---
name: lma-website-structure
description: |
  The LMA multi-page website blueprint: how an LMA client website is structured —
  the premium 4-page architecture (Home, Services/Offer, About/Proof, Contact),
  per-page section flows, cross-page consistency, and where the LP-style
  conversion patterns repeat. Use for EVERY client full-website build (not
  single landing pages — use lma-lp-structure for those).
---

# LMA Website Structure (4-Page Website Blueprint)

Teaches the STRUCTURE an LMA client website follows. **The real knowledge is in
`references/examples/` — 3 verbatim production website blueprints from different
niches. Study them before building.**

## Skill Type
- **Classification**: Execution support (structure standard applied during a build)
- **Layer**: 3 — reusable component, used inside the `premium-landing-page` 9-phase workflow

## Persona — Execution Workflow

You are implementing an LMA-standard client website. For each website build:

1. **STUDY** — Read at least 2 blueprints in `references/examples/` (closest niche
   + one other). Note the 4-page architecture, per-page section flow, and how the
   pages share one visual system.
2. **MAP CONTENT** — All copy comes from the APPROVED research brief (Mode A) or
   the user's brief (Mode B). Examples give SHAPE, research gives WORDS — never
   reuse an example's client copy.
3. **BLUEPRINT** — Lay out all pages in the LMA pattern before coding
   (extend spec docs `04-sections-and-copy.md`):
   - **4-page premium architecture**: Home (conversion-led, LP-style flow) ·
     Services/Offer (mechanism + packages) · About/Proof (credibility, team,
     case proof) · Contact (low-friction conversion).
   - Home follows the LP flow (hero → pain → promise → mechanism → proof → CTA);
     inner pages each keep a conversion path back to the primary CTA.
   - **Cross-page consistency**: one nav, one palette/typography system, one
     CTA language, consistent footer with standard pages (Privacy, Terms).
4. **BUILD** — Implement via the existing 9-phase premium workflow (static
   HTML/CSS/JS Canz standard, mobile-first breakpoints, purposeful motion).
5. **VALIDATE** — All planned pages present, per-page flows complete, cross-page
   consistency holds, every internal link works, zero placeholder copy.

## Decision Questions
- **Context**: LP or full website? (single page → use `lma-lp-structure` instead). Which example is the closest niche?
- **Convergence**: Do all 4 pages exist with their full LMA section flows? (Y/N) Is the visual system identical across pages? (Y/N)
- **Safety**: Am I inventing services/claims not present in the research brief? (then STOP)

## Operating Principles
- **Structure-From-Examples, Words-From-Research** — Constraint: examples supply the pattern only; Reason: client copy must come from their approved research; Application: no example copy leaks into the build.
- **Home-Is-The-Converter** — Constraint: Home page follows the full LP conversion flow; Reason: most traffic lands there; Application: apply lma-lp-structure logic to Home.
- **One-System-Across-Pages** — Constraint: a single visual/CTA system sitewide; Reason: consistency = trust; Application: shared tokens, nav, footer, CTA language.

## Reference Files (VERBATIM LMA production outputs — structure reference only)
| File | Niche |
|---|---|
| `references/examples/Orquidea-Marketing__d620f940__website_copy.md` | Lawyers |
| `references/examples/ConsultEdge-Catalyst__3d9005c0__website_copy.md` | Cybersecurity |
| `references/examples/ByteCraft-Marketing__972d6d1b__website_copy.md` | Residential Contractors / Home Services |
